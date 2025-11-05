import Interview from '../models/interviews.models';
import StdIqResponse from '../models/stdiqres.models';
import StdInterviewQues from '../models/stdiq.models';
import Product from '../models/products.models';
import User from '../models/users.models';
import Followup from '../models/followup.models';

export interface InterviewQuestion {
  questionText: string;
  questionType: string;
  questionIndex: number;
  userResponse: any;
  metadata: any;
}

export interface AggregatedInterviewData {
  interviewId: string;
  userId: string;
  userName: string;
  userType: string;
  productId: string;
  productName: string;
  productDescription: string;
  questions: InterviewQuestion[];
  totalQuestions: number;
  answeredQuestions: number;
  rawResponsesText: string;
}

export class InterviewInsightsAggregationService {
  
  async validateInterviewHasResponses(interviewId: string): Promise<boolean> {
    const stdIq = await StdIqResponse.findOne({ 
      interview: interviewId,
      responses: { $exists: true, $ne: [] }
    });

    const followups = await Followup.findOne({ 
      interview: interviewId,
      followup_response: { $exists: true, $ne: null }
    });

    return !!stdIq || !!followups;
  }
  
  async aggregateResponsesByInterview(interviewId: string): Promise<AggregatedInterviewData> {
    // 1️⃣ Get interview, user, and product
    const interview = await Interview.findById(interviewId);
    if (!interview) throw new Error(`Interview ${interviewId} not found`);
  
    const user = await User.findById(interview.user);
    if (!user) throw new Error(`User ${interview.user} not found`);
  
    const product = await Product.findById(interview.product);
    if (!product) throw new Error(`Product ${interview.product} not found`);
  
    // 2️⃣ Get question set
    const questionSet = await StdInterviewQues.findOne({ product: product._id });
    if (!questionSet) throw new Error(`Questions not found for product ${interview.product}`);
  
    // 3️⃣ Get standard interview responses
    const stdIqDoc = await StdIqResponse.findOne({ interview: interviewId });
    let stdResponses: any[] = [];
  
    if (stdIqDoc?.responses) {
      // Handle both array and object formats
      if (Array.isArray(stdIqDoc.responses)) {
        stdResponses = stdIqDoc.responses;
      } else if (typeof stdIqDoc.responses === 'object') {
        stdResponses = Object.entries(stdIqDoc.responses).map(([key, value], idx) => ({
          question_index: idx,
          question_type: 'text',
          answer: value,
          metadata: { key }
        }));
      }
    }
  
    // 4️⃣ Get follow-up responses
    const followups = await Followup.find({ interview: interviewId });
    const followupData = followups.map(f => ({
      questionText: f.followup_ques,
      questionType: 'followup',
      questionIndex: -1,
      userResponse: f.followup_response,
      metadata: { source: 'followup' }
    }));
  
    // 5️⃣ Merge question set with responses
    const questions: InterviewQuestion[] = questionSet.questions.map((questionText: string, idx: number) => {
      const response = stdResponses[idx]; // match by index since we built array sequentially
      return {
        questionText,
        questionType: response?.question_type || 'text',
        questionIndex: idx,
        userResponse: response?.answer || null,
        metadata: response?.metadata || {}
      };
    });
  
    // 6️⃣ Combine all responses (main + follow-up)
    const allResponses = [...questions, ...followupData];
  
    // 7️⃣ Prepare text for Gemini model
    const rawResponsesText = this.generateRawResponsesText(
      user.user_name,
      user.user_type,
      product.prod_desc,
      allResponses
    );
  
    // 8️⃣ Return aggregated data
    return {
      interviewId: interviewId,
      userId: user._id.toString(),
      userName: user.user_name,
      userType: user.user_type,
      productId: product._id.toString(),
      productName: product.prod_name || product.prod_desc || 'Unnamed Product',
      productDescription: product.prod_desc,
      questions: allResponses,
      totalQuestions: allResponses.length,
      answeredQuestions: allResponses.filter(q => q.userResponse !== null && q.userResponse !== '').length,
      rawResponsesText
    };
  }
  
  
  private generateRawResponsesText(
    userName: string,
    userType: string,
    productName: string,
    questions: InterviewQuestion[]
  ): string {
    let text = `INTERVIEW ANALYSIS REQUEST\n\n`;
    text += `Respondent: ${userName} (${userType})\n`;
    text += `Product: ${productName}\n\n`;
    text += `RESPONSES (INCLUDING FOLLOW-UPS):\n\n`;
    
    questions.forEach((q, idx) => {
      text += `Question ${idx + 1}: ${q.questionText}\n`;
      text += `Type: ${q.questionType}\n`;
      text += `Response: ${q.userResponse ? this.formatResponse(q.userResponse, q.questionType) : 'No answer'}\n\n`;
    });
    
    return text;
  }
  
  private formatResponse(response: any, questionType: string): string {
    if (response === null || response === undefined) return 'No response';
    if (typeof response === 'object') return JSON.stringify(response, null, 2);
    return String(response);
  }
  
  async getAllInterviewsWithResponseCounts() {
    const interviews = await Interview.find();
    
    return Promise.all(
      interviews.map(async (interview) => {
        const stdIq = await StdIqResponse.findOne({ interview: interview._id });
        const followups = await Followup.find({ interview: interview._id });
        const product = await Product.findById(interview.product);
        const user = await User.findById(interview.user);

        const stdCount = Array.isArray(stdIq?.responses) ? stdIq.responses.length : 0;
        const followupCount = followups.length;
        
        return {
          interviewId: interview._id.toString(),
          userId: interview.user,
          userName: user?.user_name || 'Unknown',
          userType: user?.user_type || 'Unknown',
          productId: interview.product,
          productName: product?.prod_desc || 'Unknown Product',
          responseCount: stdCount + followupCount,
          hasResponses: stdCount + followupCount > 0
        };
      })
    );
  }
}
