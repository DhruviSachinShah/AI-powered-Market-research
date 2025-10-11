import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();
export interface InterviewInsightData {
  category: string;
  insight: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  confidence?: 'high' | 'medium' | 'low';
}

export class InterviewGeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY not found in environment variables');
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro-latest' });
  }

  async generateInterviewInsights(rawResponsesText: string): Promise<InterviewInsightData[]> {
    const prompt = `You are a market research analyst. You are analyzing an interview that includes both main responses and follow-up responses.

${rawResponsesText}

Your task:
- Consider both initial and follow-up answers for deeper understanding.
- Extract behavioral, emotional, and preference-based insights.
- Highlight consistent themes between main and follow-up answers.
- Identify contradictions or clarifications revealed by follow-ups.

Return insights in **JSON array** with this structure:
[
  {
    "category": "Respondent Profile" | "Key Finding" | "Sentiment" | "Behavior" | "Follow-up Insight" | "Recommendation",
    "insight": "detailed insight text referencing main and follow-up responses where relevant",
    "sentiment": "positive" | "neutral" | "negative",
    "confidence": "high" | "medium" | "low"
  }
]

Be specific and data-driven. Do NOT include any text before or after the JSON.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error('Failed to parse Gemini response as JSON');
      
      return JSON.parse(jsonMatch[0]);
    } catch (error: any) {
      console.error('❌ Gemini API Error:', error);
      throw new Error(`Failed to generate interview insights: ${error.message}`);
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const result = await this.model.generateContent('Hello');
      const response = await result.response;
      return !!response.text();
    } catch (error) {
      console.error('❌ Gemini connection test failed:', error);
      return false;
    }
  }
}
