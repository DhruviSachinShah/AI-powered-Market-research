import { IResponse, IQuestion } from '../models/Interview';

export class ScoringService {
  
  /**
   * Calculate composite score for a response
   */
  calculateCompositeScore(
    relevance: number,
    depth: number,
    consistency: number,
    sentimentAlignment: number
  ): number {
    return (
      (relevance * 0.4) +
      (depth * 0.25) +
      (consistency * 0.20) +
      (sentimentAlignment * 0.15)
    );
  }

  /**
   * Calculate depth score based on response characteristics
   */
  calculateDepthScore(response: string): number {
    const wordCount = response.split(' ').length;
    const hasExamples = /for example|such as|like when|specifically/i.test(response);
    const hasNumbers = /\d+/.test(response);
    const hasSpecifics = /exactly|precisely|particularly/i.test(response);
    const hasEmotions = /feel|emotion|excited|frustrated|happy|sad/i.test(response);
    
    let score = Math.min(wordCount / 100, 0.6); // Max 0.6 for length
    
    if (hasExamples) score += 0.2;
    if (hasNumbers) score += 0.1;
    if (hasSpecifics) score += 0.05;
    if (hasEmotions) score += 0.05;
    
    return Math.min(score, 1);
  }

  /**
   * Calculate consistency score by checking for contradictions
   */
  calculateConsistencyScore(response: string, previousResponses: IResponse[]): number {
    if (previousResponses.length === 0) return 1;
    
    // Check for hedging words that might indicate uncertainty
    const hedgingWords = ['maybe', 'perhaps', 'not sure', 'I guess', 'probably', 'I think', 'might be'];
    const hasHedging = hedgingWords.some(word => 
      response.toLowerCase().includes(word)
    );
    
    if (hasHedging) return 0.7;
    
    // Check for contradiction indicators
    const contradictionWords = ['but', 'however', 'although', 'despite', 'on the other hand'];
    const hasContradiction = contradictionWords.some(word => 
      response.toLowerCase().includes(word)
    );
    
    if (hasContradiction) return 0.8;
    
    return 1;
  }

  /**
   * Calculate sentiment alignment score
   */
  calculateSentimentScore(response: string, expectedSentiment: string): number {
    const positiveWords = [
      'love', 'great', 'excellent', 'amazing', 'perfect', 'wonderful', 
      'fantastic', 'outstanding', 'brilliant', 'superb', 'delighted', 'pleased'
    ];
    
    const negativeWords = [
      'hate', 'terrible', 'awful', 'bad', 'horrible', 'disappointing',
      'frustrated', 'annoyed', 'upset', 'disgusted', 'angry', 'displeased'
    ];
    
    const neutralWords = [
      'okay', 'fine', 'average', 'normal', 'standard', 'typical',
      'acceptable', 'decent', 'reasonable', 'adequate'
    ];
    
    const responseLower = response.toLowerCase();
    
    const positiveCount = positiveWords.filter(word => responseLower.includes(word)).length;
    const negativeCount = negativeWords.filter(word => responseLower.includes(word)).length;
    const neutralCount = neutralWords.filter(word => responseLower.includes(word)).length;
    
    let actualSentiment = 'neutral';
    if (positiveCount > negativeCount && positiveCount > neutralCount) {
      actualSentiment = 'positive';
    } else if (negativeCount > positiveCount && negativeCount > neutralCount) {
      actualSentiment = 'negative';
    }
    
    // Perfect match
    if (actualSentiment === expectedSentiment) return 1;
    
    // Partial match (neutral can match anything)
    if (expectedSentiment === 'neutral' || actualSentiment === 'neutral') return 0.7;
    
    // Complete mismatch
    return 0.3;
  }

  /**
   * Calculate relevance score using simple keyword matching
   * In production, this would use vector embeddings
   */
  calculateRelevanceScore(response: string, expectedThemes: string[]): number {
    if (expectedThemes.length === 0) return 0.5;
    
    const responseLower = response.toLowerCase();
    const themeMatches = expectedThemes.filter(theme => 
      responseLower.includes(theme.toLowerCase()) ||
      this.findRelatedWords(theme, responseLower)
    ).length;
    
    return Math.min(themeMatches / expectedThemes.length, 1);
  }

  /**
   * Find related words for better theme matching
   */
  private findRelatedWords(theme: string, response: string): boolean {
    const relatedWords: { [key: string]: string[] } = {
      'price': ['cost', 'expensive', 'cheap', 'affordable', 'budget', 'money'],
      'quality': ['good', 'bad', 'excellent', 'poor', 'high', 'low', 'standard'],
      'taste': ['flavor', 'flavour', 'delicious', 'yummy', 'bitter', 'sweet'],
      'convenience': ['easy', 'quick', 'fast', 'simple', 'accessible', 'nearby'],
      'service': ['staff', 'employee', 'helpful', 'friendly', 'customer'],
      'ambiance': ['atmosphere', 'environment', 'mood', 'feeling', 'vibe'],
      'brand': ['company', 'name', 'logo', 'reputation', 'trust'],
      'frequency': ['often', 'daily', 'weekly', 'monthly', 'regular', 'sometimes']
    };
    
    const related = relatedWords[theme.toLowerCase()] || [];
    return related.some(word => response.includes(word));
  }

  /**
   * Calculate overall interview score
   */
  calculateOverallScore(responses: IResponse[]): number {
    if (responses.length === 0) return 0;
    
    const totalScore = responses.reduce((sum, response) => 
      sum + response.scores.composite, 0
    );
    
    return totalScore / responses.length;
  }

  /**
   * Generate score breakdown for analytics
   */
  generateScoreBreakdown(responses: IResponse[]): {
    averageRelevance: number;
    averageDepth: number;
    averageConsistency: number;
    averageSentiment: number;
    overallScore: number;
    scoreTrend: number[];
  } {
    if (responses.length === 0) {
      return {
        averageRelevance: 0,
        averageDepth: 0,
        averageConsistency: 0,
        averageSentiment: 0,
        overallScore: 0,
        scoreTrend: []
      };
    }

    const totalRelevance = responses.reduce((sum, r) => sum + r.scores.relevance, 0);
    const totalDepth = responses.reduce((sum, r) => sum + r.scores.depth, 0);
    const totalConsistency = responses.reduce((sum, r) => sum + r.scores.consistency, 0);
    const totalSentiment = responses.reduce((sum, r) => sum + r.scores.sentimentAlignment, 0);

    return {
      averageRelevance: totalRelevance / responses.length,
      averageDepth: totalDepth / responses.length,
      averageConsistency: totalConsistency / responses.length,
      averageSentiment: totalSentiment / responses.length,
      overallScore: this.calculateOverallScore(responses),
      scoreTrend: responses.map(r => r.scores.composite)
    };
  }
}
