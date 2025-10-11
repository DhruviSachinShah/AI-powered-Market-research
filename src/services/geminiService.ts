import { GoogleGenerativeAI } from '@google/generative-ai';

export interface ProductInsightData {
  question_text: string;
  question_type: string;
  visualization_type: string;
  chart_data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
      borderColor?: string[];
      borderWidth?: number;
    }[];
  };
}

export class GeminiService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is required in environment variables');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateProductInsights(responsesText: string): Promise<ProductInsightData[]> {
    try {
      console.log('🤖 Sending request to Gemini API...');
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro-latest' });

      const prompt = `
You are a data analyst specializing in market research. I will provide you with interview responses for a specific product, and you need to analyze them and return quantitative insights in a specific JSON format.

INSTRUCTIONS:
1. Analyze the provided interview responses
2. Identify patterns, trends, and quantitative data points
3. For each question or topic, determine the appropriate visualization type
4. Return the data in the exact JSON format specified below

RESPONSE FORMAT:
Return an array of objects, where each object represents one insight with the following structure:

{
  "question_text": "string",
  "question_type": "string",
  "visualization_type": "string",
  "chart_data": {
    "labels": ["string"],
    "datasets": [
      {
        "label": "string",
        "data": [number],
        "backgroundColor": ["string"],
        "borderColor": ["string"],
        "borderWidth": number
      }
    ]
  }
}

VISUALIZATION TYPES:
- bar_chart, pie_chart, stacked_bar_chart, gauge_chart, heatmap, line_chart

QUESTION TYPES:
- rating, likert, nps, multiple_choice, scale, percentage

COLOR SCHEMES:
- #3B82F6, #10B981, #F59E0B, #EF4444, #8B5CF6, #EC4899, #6366F1, #6B7280

INTERVIEW RESPONSES TO ANALYZE:
${responsesText}

Return only valid JSON, no additional text.
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log('📊 Raw AI Response:');
      console.log(text);

      let cleanText = text.trim();
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      const insights = JSON.parse(cleanText);
      this.validateInsightFormat(insights);
      return insights;
    } catch (error) {
      console.error('❌ Error generating product insights:', error);
      throw new Error(`Failed to generate insights: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private validateInsightFormat(insights: any): void {
    if (!Array.isArray(insights)) throw new Error('Response must be an array of insights');

    for (const insight of insights) {
      if (!insight.question_text || typeof insight.question_text !== 'string')
        throw new Error('Each insight must have a valid question_text string');
      if (!insight.question_type || typeof insight.question_type !== 'string')
        throw new Error('Each insight must have a valid question_type string');
      if (!insight.visualization_type || typeof insight.visualization_type !== 'string')
        throw new Error('Each insight must have a valid visualization_type string');
      if (!insight.chart_data || typeof insight.chart_data !== 'object')
        throw new Error('Each insight must have a valid chart_data object');
      if (!Array.isArray(insight.chart_data.labels))
        throw new Error('chart_data.labels must be an array');
      if (!Array.isArray(insight.chart_data.datasets))
        throw new Error('chart_data.datasets must be an array');

      for (const dataset of insight.chart_data.datasets) {
        if (!dataset.label || typeof dataset.label !== 'string')
          throw new Error('Each dataset must have a valid label string');
        if (!Array.isArray(dataset.data))
          throw new Error('Each dataset must have a data array');
        if (!Array.isArray(dataset.backgroundColor))
          throw new Error('Each dataset must have a backgroundColor array');
      }
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      console.log('🔌 Testing Gemini API connection...');
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro-latest' });
      const result = await model.generateContent('Test connection - respond with "OK"');
      const response = await result.response;
      const text = response.text();
      return text.trim().toLowerCase().includes('ok');
    } catch (error) {
      console.error('❌ Gemini API connection test failed:', error);
      return false;
    }
  }
}
