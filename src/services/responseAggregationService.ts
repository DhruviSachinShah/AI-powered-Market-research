import mongoose from 'mongoose';
import Interview from '../models/interviews.models';
import StdInterviewQues from '../models/stdiq.models';
import StdIqResponse from '../models/stdiqres.models';
import Product from '../models/products.models';
import InterviewInsights from '../models/interviewinsight.models';
import { GeminiService, ProductInsightData } from '../services/geminiService';

export interface AggregatedResponse {
  productId: string;
  productName: string;
  productDescription: string;
  totalInterviews: number;
  questions: Array<{
    questionId: string;
    questionText: string;
    responses: any[];
    responseCount: number;
  }>;
  rawResponsesText: string;
  qualitativeSummary?: string;
}

export class ResponseAggregationService {
  private geminiService: GeminiService;

  constructor() {
    this.geminiService = new GeminiService();
  }

  async aggregateResponsesByProduct(productId: string): Promise<AggregatedResponse> {
    try {
      // Validate product ID
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error('Invalid product ID format');
      }

      // Get product information
      const product = await Product.findById(productId);
      if (!product) throw new Error('Product not found');

      // Get all interviews for this product
      const interviews = await Interview.find({ product: productId });
      if (interviews.length === 0) throw new Error('No interviews found for this product');

      // Get interview IDs
      const interviewIds = interviews.map(interview => interview._id.toString());

      // Get standard questions for this product
      const stdQuestions = await StdInterviewQues.findOne({ product: productId });
      if (!stdQuestions) throw new Error('No standard questions found for this product');

      // Get all responses for these interviews
      const responses = await StdIqResponse.find({
        interview: { $in: interviewIds }
      });

      // Aggregate responses by question
      const aggregatedQuestions = stdQuestions.questions.map((questionText, index) => {
        const questionId = `q${index + 1}`;
        const questionResponses = responses
          .map(response => {
            if (response.responses && typeof response.responses === 'object') {
              const questionKey = `question${index + 1}`;
              return response.responses[questionKey] || null;
            }
            return null;
          })
          .filter(r => r !== null);

        return {
          questionId,
          questionText,
          responses: questionResponses,
          responseCount: questionResponses.length
        };
      });

      // Generate raw responses text for LLM analysis
      const rawResponsesText = this.generateRawResponsesText(product, aggregatedQuestions, interviews.length);

      // Generate qualitative summary from interview insights
      const qualitativeSummary = await this.generateQualitativeSummary(productId);

      return {
        productId: product._id.toString(),
        productName: product.prod_name,
        productDescription: product.prod_desc,
        totalInterviews: interviews.length,
        questions: aggregatedQuestions,
        rawResponsesText,
        qualitativeSummary
      };
    } catch (error) {
      console.error('Error aggregating responses by product:', error);
      throw error;
    }
  }

  private generateRawResponsesText(
    product: any,
    questions: Array<{ questionId: string; questionText: string; responses: any[]; responseCount: number }>,
    totalInterviews: number
  ): string {
    let text = `PRODUCT ANALYSIS: ${product.prod_name}\n`;
    text += `Product Description: ${product.prod_desc}\n`;
    text += `Target Audience: ${product.target_audience}\n`;
    text += `Total Interviews Conducted: ${totalInterviews}\n\n`;

    text += `INTERVIEW RESPONSES ANALYSIS:\n`;
    text += `=====================================\n\n`;

    questions.forEach((question, index) => {
      text += `QUESTION ${index + 1}: ${question.questionText}\n`;
      text += `Response Count: ${question.responseCount}\n`;
      text += `Responses:\n`;

      question.responses.forEach((response, responseIndex) => {
        text += `  Response ${responseIndex + 1}: ${JSON.stringify(response)}\n`;
      });

      text += `\n`;
    });

    text += `SUMMARY:\n`;
    text += `========\n`;
    text += `Total Questions: ${questions.length}\n`;
    text += `Total Responses: ${questions.reduce((sum, q) => sum + q.responseCount, 0)}\n`;
    text += `Average Responses per Question: ${(questions.reduce((sum, q) => sum + q.responseCount, 0) / questions.length).toFixed(2)}\n`;

    return text;
  }

  private async generateQualitativeSummary(productId: string): Promise<string> {
    // Find all interview insights for this product
    const interviews = await Interview.find({ product: productId });
    const interviewIds = interviews.map(i => i._id.toString());

    const insightsDocs = await InterviewInsights.find({
      interview: { $in: interviewIds },
      interviewReport: { $ne: null }
    });

    if (insightsDocs.length === 0) return 'No qualitative insights available for this product.';

    // Combine all insights text
    const allInsightsText: string[] = [];
    for (const doc of insightsDocs) {
      const insights = doc.interviewReport?.insights || [];
      for (const insight of insights) {
        if (insight.insight) allInsightsText.push(insight.insight);
      }
    }

    const combinedText = allInsightsText.join(' ');

    // Use Gemini to summarize into 5 lines
    try {
      const summaryPrompt = `
You are an analyst. Summarize the following insights into a concise 5-line qualitative summary:

${combinedText}

Return only plain text summary (5 lines max).
`;

      const model = this.geminiService['genAI'].getGenerativeModel({ model: 'gemini-pro-latest' });
      const result = await model.generateContent(summaryPrompt);
      const response = await result.response;
      return response.text().trim().split('\n').slice(0, 5).join(' ');
    } catch (error) {
      console.error('Error generating qualitative summary:', error);
      return 'Qualitative summary unavailable due to AI processing error.';
    }
  }

  async getAllProductsWithResponseCounts(): Promise<Array<{
    productId: string;
    productName: string;
    interviewCount: number;
    hasResponses: boolean;
  }>> {
    try {
      const products = await Product.find();
      const result = [];

      for (const product of products) {
        const interviews = await Interview.find({ product: product._id.toString() });
        const interviewIds = interviews.map(interview => interview._id.toString());

        const responses = await StdIqResponse.find({
          interview: { $in: interviewIds }
        });

        result.push({
          productId: product._id.toString(),
          productName: product.prod_name,
          interviewCount: interviews.length,
          hasResponses: responses.length > 0
        });
      }

      return result;
    } catch (error) {
      console.error('Error getting products with response counts:', error);
      throw error;
    }
  }

  async validateProductHasResponses(productId: string): Promise<boolean> {
    try {
      if (!mongoose.Types.ObjectId.isValid(productId)) return false;

      const interviews = await Interview.find({ product: productId });
      if (interviews.length === 0) return false;

      const interviewIds = interviews.map(interview => interview._id.toString());
      const responses = await StdIqResponse.find({
        interview: { $in: interviewIds }
      });

      return responses.length > 0;
    } catch (error) {
      console.error('Error validating product responses:', error);
      return false;
    }
  }
}
