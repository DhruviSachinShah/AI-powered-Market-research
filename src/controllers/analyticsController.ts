import { Request, Response } from 'express';
import { Interview } from '../models/Interview';
import { InterviewTemplate } from '../models/InterviewTemplate';

export class AnalyticsController {
  
  // Get interview analytics
  async getInterviewAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const interview = await Interview.findById(id)
        .populate('templateId', 'title description');
      
      if (!interview) {
        res.status(404).json({
          success: false,
          message: 'Interview not found'
        });
        return;
      }
      
      // Calculate analytics
      const analytics = {
        interviewId: interview._id,
        respondentName: interview.respondentName,
        templateTitle: interview.templateId.title,
        overallScore: interview.overallScore,
        insights: interview.insights,
        metadata: interview.metadata,
        responseCount: interview.responses.length,
        averageResponseLength: this.calculateAverageResponseLength(interview.responses),
        scoreBreakdown: this.generateScoreBreakdown(interview.responses),
        sentimentTrend: this.generateSentimentTrend(interview.responses),
        completionRate: this.calculateCompletionRate(interview)
      };
      
      res.json({
        success: true,
        data: analytics
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch analytics'
      });
    }
  }

  // Get aggregate analytics across all interviews
  async getAggregateAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const interviews = await Interview.find({ status: 'completed' })
        .populate('templateId', 'title');
      
      const analytics = {
        totalInterviews: interviews.length,
        averageScore: this.calculateAverageScore(interviews),
        completionRate: this.calculateOverallCompletionRate(interviews),
        topThemes: this.extractTopThemes(interviews),
        sentimentDistribution: this.calculateSentimentDistribution(interviews),
        responseQualityTrend: this.generateResponseQualityTrend(interviews),
        templatePerformance: this.analyzeTemplatePerformance(interviews)
      };
      
      res.json({
        success: true,
        data: analytics
      });
    } catch (error) {
      console.error('Error fetching aggregate analytics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch aggregate analytics'
      });
    }
  }

  // Get template analytics
  async getTemplateAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const { templateId } = req.params;
      
      const interviews = await Interview.find({ 
        templateId, 
        status: 'completed' 
      });
      
      const template = await InterviewTemplate.findById(templateId);
      
      if (!template) {
        res.status(404).json({
          success: false,
          message: 'Template not found'
        });
        return;
      }
      
      const analytics = {
        templateTitle: template.title,
        totalInterviews: interviews.length,
        averageScore: this.calculateAverageScore(interviews),
        questionPerformance: this.analyzeQuestionPerformance(interviews, template),
        commonThemes: this.extractCommonThemes(interviews),
        responsePatterns: this.analyzeResponsePatterns(interviews)
      };
      
      res.json({
        success: true,
        data: analytics
      });
    } catch (error) {
      console.error('Error fetching template analytics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch template analytics'
      });
    }
  }

  // Export interview data
  async exportInterviewData(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { format = 'json' } = req.query;
      
      const interview = await Interview.findById(id)
        .populate('templateId', 'title description');
      
      if (!interview) {
        res.status(404).json({
          success: false,
          message: 'Interview not found'
        });
        return;
      }
      
      const exportData = {
        interviewId: interview._id,
        respondentName: interview.respondentName,
        respondentEmail: interview.respondentEmail,
        templateTitle: interview.templateId.title,
        status: interview.status,
        startedAt: interview.startedAt,
        completedAt: interview.completedAt,
        overallScore: interview.overallScore,
        insights: interview.insights,
        metadata: interview.metadata,
        responses: interview.responses.map(response => ({
          questionId: response.questionId,
          questionText: response.questionText,
          questionType: response.questionType,
          userAnswer: response.userAnswer,
          scores: response.scores,
          timestamp: response.timestamp
        }))
      };
      
      if (format === 'json') {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="interview-${id}.json"`);
        res.json(exportData);
      } else {
        res.status(400).json({
          success: false,
          message: 'Unsupported export format'
        });
      }
    } catch (error) {
      console.error('Error exporting interview data:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to export interview data'
      });
    }
  }

  // Helper methods
  private calculateAverageResponseLength(responses: any[]): number {
    if (responses.length === 0) return 0;
    
    const totalLength = responses.reduce((sum, response) => 
      sum + response.userAnswer.split(' ').length, 0
    );
    
    return Math.round(totalLength / responses.length);
  }

  private generateScoreBreakdown(responses: any[]): any {
    if (responses.length === 0) {
      return {
        averageRelevance: 0,
        averageDepth: 0,
        averageConsistency: 0,
        averageSentiment: 0
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
      averageSentiment: totalSentiment / responses.length
    };
  }

  private generateSentimentTrend(responses: any[]): any[] {
    return responses.map((response, index) => ({
      questionIndex: index + 1,
      sentimentScore: response.scores.sentimentAlignment,
      compositeScore: response.scores.composite
    }));
  }

  private calculateCompletionRate(interview: any): number {
    const expectedQuestions = interview.metadata.questionCount;
    const answeredQuestions = interview.responses.filter((r: any) => r.questionType === 'initial').length;
    
    return expectedQuestions > 0 ? answeredQuestions / expectedQuestions : 0;
  }

  private calculateAverageScore(interviews: any[]): number {
    if (interviews.length === 0) return 0;
    
    const totalScore = interviews.reduce((sum, interview) => 
      sum + interview.overallScore, 0
    );
    
    return totalScore / interviews.length;
  }

  private calculateOverallCompletionRate(interviews: any[]): number {
    if (interviews.length === 0) return 0;
    
    const completedInterviews = interviews.filter(i => i.status === 'completed').length;
    return completedInterviews / interviews.length;
  }

  private extractTopThemes(interviews: any[]): string[] {
    const themeCounts: { [key: string]: number } = {};
    
    interviews.forEach(interview => {
      interview.insights.keyThemes.forEach((theme: string) => {
        themeCounts[theme] = (themeCounts[theme] || 0) + 1;
      });
    });
    
    return Object.entries(themeCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([theme]) => theme);
  }

  private calculateSentimentDistribution(interviews: any[]): any {
    const distribution = { positive: 0, neutral: 0, negative: 0 };
    
    interviews.forEach(interview => {
      distribution[interview.insights.sentiment]++;
    });
    
    return distribution;
  }

  private generateResponseQualityTrend(interviews: any[]): any[] {
    return interviews.map(interview => ({
      interviewId: interview._id,
      date: interview.completedAt,
      score: interview.overallScore,
      responseCount: interview.responses.length
    }));
  }

  private analyzeTemplatePerformance(interviews: any[]): any[] {
    const templateStats: { [key: string]: any } = {};
    
    interviews.forEach(interview => {
      const templateId = interview.templateId._id.toString();
      if (!templateStats[templateId]) {
        templateStats[templateId] = {
          templateTitle: interview.templateId.title,
          interviewCount: 0,
          totalScore: 0,
          averageScore: 0
        };
      }
      
      templateStats[templateId].interviewCount++;
      templateStats[templateId].totalScore += interview.overallScore;
    });
    
    Object.values(templateStats).forEach((stats: any) => {
      stats.averageScore = stats.totalScore / stats.interviewCount;
    });
    
    return Object.values(templateStats);
  }

  private analyzeQuestionPerformance(interviews: any[], template: any): any[] {
    const questionStats: { [key: string]: any } = {};
    
    template.questions.forEach((question: any) => {
      questionStats[question.id] = {
        questionText: question.text,
        responseCount: 0,
        averageScore: 0,
        totalScore: 0
      };
    });
    
    interviews.forEach(interview => {
      interview.responses.forEach((response: any) => {
        if (questionStats[response.questionId]) {
          questionStats[response.questionId].responseCount++;
          questionStats[response.questionId].totalScore += response.scores.composite;
        }
      });
    });
    
    Object.values(questionStats).forEach((stats: any) => {
      if (stats.responseCount > 0) {
        stats.averageScore = stats.totalScore / stats.responseCount;
      }
    });
    
    return Object.values(questionStats);
  }

  private extractCommonThemes(interviews: any[]): string[] {
    const themeCounts: { [key: string]: number } = {};
    
    interviews.forEach(interview => {
      interview.insights.keyThemes.forEach((theme: string) => {
        themeCounts[theme] = (themeCounts[theme] || 0) + 1;
      });
    });
    
    return Object.entries(themeCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([theme]) => theme);
  }

  private analyzeResponsePatterns(interviews: any[]): any {
    const patterns = {
      averageResponseLength: 0,
      commonWords: [] as string[],
      responseQualityDistribution: { high: 0, medium: 0, low: 0 }
    };
    
    let totalLength = 0;
    let totalResponses = 0;
    const wordCounts: { [key: string]: number } = {};
    
    interviews.forEach(interview => {
      interview.responses.forEach((response: any) => {
        const words = response.userAnswer.toLowerCase().split(/\s+/);
        totalLength += words.length;
        totalResponses++;
        
        words.forEach(word => {
          if (word.length > 3) { // Only count words longer than 3 characters
            wordCounts[word] = (wordCounts[word] || 0) + 1;
          }
        });
        
        // Categorize response quality
        if (response.scores.composite >= 0.8) patterns.responseQualityDistribution.high++;
        else if (response.scores.composite >= 0.6) patterns.responseQualityDistribution.medium++;
        else patterns.responseQualityDistribution.low++;
      });
    });
    
    patterns.averageResponseLength = totalResponses > 0 ? totalLength / totalResponses : 0;
    patterns.commonWords = Object.entries(wordCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
    
    return patterns;
  }
}
