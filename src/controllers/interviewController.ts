import { Request, Response } from 'express';
import { Interview } from '../models/Interview';
import { InterviewTemplate } from '../models/InterviewTemplate';

export class InterviewController {
  
  // Get all interviews
  async getAllInterviews(req: Request, res: Response): Promise<void> {
    try {
      const interviews = await Interview.find()
        .populate('templateId', 'title description')
        .sort({ createdAt: -1 });
      
      res.json({
        success: true,
        data: interviews
      });
    } catch (error) {
      console.error('Error fetching interviews:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch interviews'
      });
    }
  }

  // Get interview by ID
  async getInterviewById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const interview = await Interview.findById(id)
        .populate('templateId', 'title description questions');
      
      if (!interview) {
        res.status(404).json({
          success: false,
          message: 'Interview not found'
        });
        return;
      }
      
      res.json({
        success: true,
        data: interview
      });
    } catch (error) {
      console.error('Error fetching interview:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch interview'
      });
    }
  }

  // Get interviews by email
  async getInterviewsByEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.params;
      
      const interviews = await Interview.find({ respondentEmail: email })
        .populate('templateId', 'title description')
        .sort({ createdAt: -1 });
      
      res.json({
        success: true,
        data: interviews
      });
    } catch (error) {
      console.error('Error fetching interviews by email:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch interviews'
      });
    }
  }

  // Create new interview (for manual creation)
  async createInterview(req: Request, res: Response): Promise<void> {
    try {
      const { respondentName, respondentEmail, templateId } = req.body;
      
      const interview = new Interview({
        respondentName,
        respondentEmail,
        templateId,
        status: 'in-progress',
        responses: [],
        overallScore: 0,
        insights: {
          keyThemes: [],
          sentiment: 'neutral',
          completionRate: 0
        },
        metadata: {
          duration: 0,
          questionCount: 0,
          followUpCount: 0
        }
      });
      
      await interview.save();
      
      res.status(201).json({
        success: true,
        data: interview
      });
    } catch (error) {
      console.error('Error creating interview:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create interview'
      });
    }
  }

  // Update interview
  async updateInterview(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const interview = await Interview.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!interview) {
        res.status(404).json({
          success: false,
          message: 'Interview not found'
        });
        return;
      }
      
      res.json({
        success: true,
        data: interview
      });
    } catch (error) {
      console.error('Error updating interview:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update interview'
      });
    }
  }

  // Delete interview
  async deleteInterview(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const interview = await Interview.findByIdAndDelete(id);
      
      if (!interview) {
        res.status(404).json({
          success: false,
          message: 'Interview not found'
        });
        return;
      }
      
      res.json({
        success: true,
        message: 'Interview deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting interview:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete interview'
      });
    }
  }
}
