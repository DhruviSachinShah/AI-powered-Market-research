import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenerativeAI } from '@google/generative-ai';
import Followup from '../models/followup.models';

export class FollowupService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is required in environment variables');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  /**
   * Generate a follow-up question based on previous question + user response.
   * Stores current Q&A in DB and returns the next follow-up question.
   */
  async generateFollowupQuestion(
    interviewId: string,
    currentQuestion: string,
    userResponse: string
  ): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro-latest' });

      // Fetch recent context for continuity
      const previousFollowups = await Followup.find({ interview: interviewId })
        .sort({ createdAt: 1 })
        .limit(5);

      const historyText = previousFollowups
        .map((f) => `Q: ${f.followup_ques}\nA: ${f.followup_response}`)
        .join('\n\n');

      const prompt = `
You are an AI interviewer conducting qualitative market research.
Your job is to ask natural, human-like follow-up questions that dig deeper
into motivations, opinions, and reasoning.
Given the previous conversation and the user's most recent response,
generate ONE thoughtful follow-up question. Avoid generic or repetitive questions.
Return only the question text.
---
PREVIOUS CONTEXT:
${historyText || 'No previous followups yet.'}
CURRENT EXCHANGE:
Q: ${currentQuestion}
A: ${userResponse}
Your response (a single follow-up question only):
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const followupText = response.text().trim();

      // Store this Q&A before returning new question
      await Followup.create({
        interview: interviewId,
        followup_ques: currentQuestion,
        followup_response: userResponse
      });

      console.log(`🤖 Generated follow-up for interview ${interviewId}:`, followupText);

      return followupText;
    } catch (error: any) {
      console.error('❌ Error generating follow-up question:', error);
      throw new Error(
        `Failed to generate follow-up: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}