import { Request, Response } from 'express';
import InterviewInsights from '../models/interviewinsight.models';
import { InterviewGeminiService, InterviewInsightData } from '../services/interviewGeminiService';
import { InterviewInsightsAggregationService } from '../services/interviewInsightsAggregationService';

const geminiService = new InterviewGeminiService();
const aggregationService = new InterviewInsightsAggregationService();

export const generateInterviewInsights = async (req: Request, res: Response) => {
  const { interviewId } = req.params;

  if (!interviewId) {
    return res.status(400).json({
      success: false,
      message: 'Interview ID is required'
    });
  }

  try {
    // Validate that interview has responses
    const hasResponses = await aggregationService.validateInterviewHasResponses(interviewId);
    if (!hasResponses) {
      return res.status(400).json({
        success: false,
        message: 'No responses found for this interview. Complete the interview first.'
      });
    }

    // Aggregate interview responses
    const aggregatedData = await aggregationService.aggregateResponsesByInterview(interviewId);

    // Generate insights from Gemini
    const insights: InterviewInsightData[] = await geminiService.generateInterviewInsights(
      aggregatedData.rawResponsesText
    );

    console.log('📊 Gemini interview insights:', insights);

    // Prepare data to upsert
    const interviewInsightsData = {
      interview: interviewId,
      interviewReport: {
        insights: insights,
        generatedAt: new Date().toISOString(),
        respondentInfo: {
          userId: aggregatedData.userId,
          userName: aggregatedData.userName,
          userType: aggregatedData.userType
        },
        productInfo: {
          productId: aggregatedData.productId,
          productName: aggregatedData.productName
        },
        metadata: {
          totalQuestions: aggregatedData.totalQuestions,
          answeredQuestions: aggregatedData.answeredQuestions,
          completionRate: ((aggregatedData.answeredQuestions / aggregatedData.totalQuestions) * 100).toFixed(1),
          aiModel: 'gemini-pro'
        }
      }
    };

    // Upsert interview insights
    const interviewInsights = await InterviewInsights.findOneAndUpdate(
      { interview: interviewId },
      interviewInsightsData,
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Interview insights generated successfully',
      data: {
        interviewInsights,
        aggregatedData: {
          interviewId: aggregatedData.interviewId,
          userName: aggregatedData.userName,
          productName: aggregatedData.productName,
          totalQuestions: aggregatedData.totalQuestions,
          answeredQuestions: aggregatedData.answeredQuestions
        }
      }
    });
  } catch (error: any) {
    console.error('❌ Error generating interview insights:', error);

    let message = 'Error generating interview insights';
    if (error.message.includes('GEMINI_API_KEY')) {
      message = 'Gemini API key not configured. Set GEMINI_API_KEY.';
    } else if (error.message.includes('Failed to generate insights')) {
      message = 'Failed to generate insights from AI service.';
    }

    res.status(500).json({ success: false, message, error: error.message });
  }
};

export const getInterviewInsights = async (req: Request, res: Response) => {
  const { interviewId } = req.params;
  
  if (!interviewId) {
    return res.status(400).json({ 
      success: false, 
      message: 'Interview ID is required' 
    });
  }

  try {
    const interviewInsights = await InterviewInsights.findOne({ interview: interviewId });
    
    if (!interviewInsights) {
      return res.status(404).json({ 
        success: false, 
        message: 'Interview insights not found. Generate first.' 
      });
    }

    res.status(200).json({ 
      success: true, 
      data: interviewInsights 
    });
  } catch (error: any) {
    console.error('❌ Error fetching interview insights:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching interview insights', 
      error: error.message 
    });
  }
};

export const getAllInterviewInsights = async (_req: Request, res: Response) => {
  try {
    const interviewsWithResponses = await aggregationService.getAllInterviewsWithResponseCounts();
    const interviewInsights = await InterviewInsights.find();

    const result = interviewsWithResponses.map(interview => {
      const insights = interviewInsights.find(ii => ii.interview === interview.interviewId);
      return {
        ...interview,
        insightsGenerated: !!insights,
        lastGenerated: insights?.updatedAt || null
      };
    });

    res.status(200).json({ 
      success: true, 
      count: result.length, 
      data: result 
    });
  } catch (error: any) {
    console.error('❌ Error fetching all interview insights:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching interview insights', 
      error: error.message 
    });
  }
};

export const deleteInterviewInsights = async (req: Request, res: Response) => {
  const { interviewId } = req.params;
  
  if (!interviewId) {
    return res.status(400).json({ 
      success: false, 
      message: 'Interview ID is required' 
    });
  }

  try {
    const deleted = await InterviewInsights.findOneAndDelete({ interview: interviewId });
    
    if (!deleted) {
      return res.status(404).json({ 
        success: false, 
        message: 'Interview insights not found' 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Interview insights deleted successfully' 
    });
  } catch (error: any) {
    console.error('❌ Error deleting interview insights:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting interview insights', 
      error: error.message 
    });
  }
};

export const testGeminiConnection = async (_req: Request, res: Response) => {
  try {
    const connected = await geminiService.testConnection();
    res.status(200).json({
      success: true,
      data: { 
        connected, 
        message: connected ? 'Gemini API connection successful' : 'Gemini API connection failed' 
      }
    });
  } catch (error: any) {
    console.error('❌ Error testing Gemini connection:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error testing Gemini API connection', 
      error: error.message 
    });
  }
};