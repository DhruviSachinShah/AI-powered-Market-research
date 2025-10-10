import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage, AIMessage } from '@langchain/core/messages';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { IQuestion, IResponse } from '../models/Interview';

export class AIService {
  private llm: ChatOpenAI;
  private conversationHistory: Array<HumanMessage | AIMessage> = [];

  constructor() {
    this.llm = new ChatOpenAI({
      modelName: 'gpt-4',
      temperature: 0.7,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateInitialQuestion(template: any, questionIndex: number): Promise<string> {
    const currentQuestion = template.questions[questionIndex];
    
    const systemPrompt = this.buildSystemPrompt(template, currentQuestion);
    
    const messages = [
      new SystemMessage(systemPrompt),
      new HumanMessage(`Ask the first question: "${currentQuestion.text}"`)
    ];

    const response = await this.llm.invoke(messages);
    this.conversationHistory.push(new AIMessage(response.content as string));
    
    return response.content as string;
  }

  async generateFollowUpQuestion(
    template: any, 
    currentQuestion: IQuestion, 
    userResponse: string,
    conversationHistory: string[]
  ): Promise<string> {
    const systemPrompt = this.buildSystemPrompt(template, currentQuestion);
    
    const followUpPrompt = `
    The user just responded: "${userResponse}"
    
    Based on their response, decide if you need to ask a follow-up question to get more depth.
    
    Follow-up triggers:
    - Response is too short (<30 words)
    - Response lacks specific examples
    - Response seems vague or unclear
    - Response contradicts previous answers
    
    If you need a follow-up, ask ONE probing question based on the strategy: ${currentQuestion.probingStrategy}
    
    If the response is sufficient, say: "Thank you for that detailed response. Let's move on to the next question."
    `;

    const messages = [
      new SystemMessage(systemPrompt),
      new HumanMessage(followUpPrompt)
    ];

    const response = await this.llm.invoke(messages);
    this.conversationHistory.push(new AIMessage(response.content as string));
    
    return response.content as string;
  }

  async generateNextQuestion(template: any, questionIndex: number): Promise<string> {
    if (questionIndex >= template.questions.length) {
      return "Thank you! That completes our interview. I'll now analyze your responses and provide you with insights.";
    }

    const currentQuestion = template.questions[questionIndex];
    const systemPrompt = this.buildSystemPrompt(template, currentQuestion);
    
    const messages = [
      new SystemMessage(systemPrompt),
      new HumanMessage(`Ask the next question: "${currentQuestion.text}"`)
    ];

    const response = await this.llm.invoke(messages);
    this.conversationHistory.push(new AIMessage(response.content as string));
    
    return response.content as string;
  }

  async analyzeResponse(
    question: IQuestion,
    userResponse: string,
    previousResponses: IResponse[]
  ): Promise<{
    shouldProbe: boolean;
    probeReason?: string;
    scores: {
      relevance: number;
      depth: number;
      consistency: number;
      sentimentAlignment: number;
      composite: number;
    };
  }> {
    // Calculate depth score
    const depthScore = this.calculateDepthScore(userResponse);
    
    // Calculate consistency score
    const consistencyScore = this.calculateConsistencyScore(userResponse, previousResponses);
    
    // Calculate sentiment alignment
    const sentimentScore = this.calculateSentimentScore(userResponse, question.expectedSentiment);
    
    // Calculate relevance (simplified - in production, use vector embeddings)
    const relevanceScore = this.calculateRelevanceScore(userResponse, question.expectedThemes);
    
    // Calculate composite score
    const compositeScore = 
      (relevanceScore * 0.4) +
      (depthScore * 0.25) +
      (consistencyScore * 0.20) +
      (sentimentScore * 0.15);

    // Determine if probing is needed
    const shouldProbe = this.shouldProbe(userResponse, compositeScore);

    return {
      shouldProbe,
      probeReason: shouldProbe ? this.getProbeReason(userResponse, compositeScore) : undefined,
      scores: {
        relevance: relevanceScore,
        depth: depthScore,
        consistency: consistencyScore,
        sentimentAlignment: sentimentScore,
        composite: compositeScore
      }
    };
  }

  async generateInsights(responses: IResponse[]): Promise<{
    keyThemes: string[];
    sentiment: 'positive' | 'neutral' | 'negative';
    completionRate: number;
  }> {
    const allAnswers = responses.map(r => r.userAnswer).join(' ');
    
    const prompt = `
    Analyze the following interview responses and extract key insights:
    
    Responses: ${allAnswers}
    
    Please provide:
    1. Top 5 key themes/topics discussed
    2. Overall sentiment (positive/neutral/negative)
    3. Completion rate (0-1) based on response quality
    
    Format as JSON:
    {
      "keyThemes": ["theme1", "theme2", ...],
      "sentiment": "positive|neutral|negative",
      "completionRate": 0.85
    }
    `;

    const response = await this.llm.invoke([new HumanMessage(prompt)]);
    
    try {
      return JSON.parse(response.content as string);
    } catch (error) {
      // Fallback if JSON parsing fails
      return {
        keyThemes: ['general feedback', 'user preferences'],
        sentiment: 'neutral',
        completionRate: 0.7
      };
    }
  }

  private buildSystemPrompt(template: any, currentQuestion: IQuestion): string {
    return `
    You are conducting a professional market research interview about ${template.title}.
    
    RULES:
    1. Ask ONE question at a time
    2. Be conversational and friendly
    3. When responses are vague (<30 words), ask a follow-up like:
       - "Can you tell me more about that?"
       - "What specifically made you feel that way?"
       - "Can you give me an example?"
    4. When responses contradict previous answers, gently probe:
       - "Earlier you mentioned X, but now you're saying Y. Can you clarify?"
    5. Keep track of the conversation flow
    6. When you've gathered sufficient depth, move to the next question
    7. After all questions, say: "Thank you! That completes our interview."
    
    CURRENT QUESTION: ${currentQuestion.text}
    EXPECTED THEMES: ${currentQuestion.expectedThemes.join(', ')}
    PROBING STRATEGY: ${currentQuestion.probingStrategy}
    
    Now respond naturally:
    `;
  }

  private calculateDepthScore(response: string): number {
    const wordCount = response.split(' ').length;
    const hasExamples = /for example|such as|like when/i.test(response);
    const hasNumbers = /\d+/.test(response);
    const hasSpecifics = /specifically|exactly|precisely/i.test(response);
    
    let score = Math.min(wordCount / 100, 0.7); // Max 0.7 for length
    if (hasExamples) score += 0.15;
    if (hasNumbers) score += 0.1;
    if (hasSpecifics) score += 0.05;
    
    return Math.min(score, 1);
  }

  private calculateConsistencyScore(response: string, previousResponses: IResponse[]): number {
    // Simplified consistency check - in production, use AI to detect contradictions
    if (previousResponses.length === 0) return 1;
    
    // Check for hedging words that might indicate inconsistency
    const hedgingWords = ['maybe', 'perhaps', 'not sure', 'I guess', 'probably', 'I think'];
    const hasHedging = hedgingWords.some(word => response.toLowerCase().includes(word));
    
    return hasHedging ? 0.7 : 1;
  }

  private calculateSentimentScore(response: string, expectedSentiment: string): number {
    // Simplified sentiment analysis
    const positiveWords = ['love', 'great', 'excellent', 'amazing', 'perfect', 'wonderful'];
    const negativeWords = ['hate', 'terrible', 'awful', 'bad', 'horrible', 'disappointing'];
    
    const responseLower = response.toLowerCase();
    const positiveCount = positiveWords.filter(word => responseLower.includes(word)).length;
    const negativeCount = negativeWords.filter(word => responseLower.includes(word)).length;
    
    let actualSentiment = 'neutral';
    if (positiveCount > negativeCount) actualSentiment = 'positive';
    else if (negativeCount > positiveCount) actualSentiment = 'negative';
    
    return actualSentiment === expectedSentiment ? 1 : 0.5;
  }

  private calculateRelevanceScore(response: string, expectedThemes: string[]): number {
    // Simplified relevance calculation
    const responseLower = response.toLowerCase();
    const themeMatches = expectedThemes.filter(theme => 
      responseLower.includes(theme.toLowerCase())
    ).length;
    
    return Math.min(themeMatches / expectedThemes.length, 1);
  }

  private shouldProbe(response: string, compositeScore: number): boolean {
    const wordCount = response.split(' ').length;
    
    // Short response
    if (wordCount < 25) return true;
    
    // Low composite score
    if (compositeScore < 0.6) return true;
    
    // Contains hedging words
    const hedgingWords = ['maybe', 'perhaps', 'not sure', 'I guess', 'probably'];
    if (hedgingWords.some(word => response.toLowerCase().includes(word))) return true;
    
    return false;
  }

  private getProbeReason(response: string, compositeScore: number): string {
    const wordCount = response.split(' ').length;
    
    if (wordCount < 25) return 'Response too short';
    if (compositeScore < 0.6) return 'Low relevance score';
    
    return 'Contains hedging language';
  }

  clearHistory(): void {
    this.conversationHistory = [];
  }
}
