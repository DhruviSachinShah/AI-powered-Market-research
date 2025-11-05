// controllers/followupController.js
import Followup from '../models/followup.models';
import { FollowupService } from '../services/followupService';

const followupService = new FollowupService();
export const generateFollowup = async (req: any, res: any) => {
  try {
    const { interviewId, currentQuestion, userResponse } = req.body;

    if (!interviewId || !currentQuestion || !userResponse) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: interviewId, currentQuestion, userResponse'
      });
    }

    const nextQuestion = await followupService.generateFollowupQuestion(
      interviewId,
      currentQuestion,
      userResponse
    );

    res.status(200).json({
      success: true,
      followup_question: nextQuestion
    });
  } catch (error: any) {
    console.error('❌ Error generating follow-up:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate follow-up question',
      error: error.message
    });
  }
};

export const getAllFollowups = async (req: any, res: any) => {
  try {
    const followups = await Followup.find();
    res.status(200).json({
      success: true,
      count: followups.length,
      data: followups
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching followups',
      error: error.message
    });
  }
};

export const getFollowupsByInterviewId = async (req: any, res: any) => {
  try {
    const followups = await Followup.find({ interview: req.params.interviewId });
    res.status(200).json({
      success: true,
      count: followups.length,
      data: followups
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching followups',
      error: error.message
    });
  }
};

export const createFollowup = async (req: any, res: any) => {
  try {
    const followup = await Followup.create(req.body);
    res.status(201).json({
      success: true,
      data: followup
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Error creating followup',
      error: error.message
    });
  }
};

export const updateFollowup = async (req: any, res: any) => {
  try {
    const followup = await Followup.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!followup) {
      return res.status(404).json({
        success: false,
        message: 'Followup not found'
      });
    }
    res.status(200).json({
      success: true,
      data: followup
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Error updating followup',
      error: error.message
    });
  }
};

export const deleteFollowup = async (req: any, res: any) => {
  try {
    const followup = await Followup.findByIdAndDelete(req.params.id);
    if (!followup) {
      return res.status(404).json({
        success: false,
        message: 'Followup not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Followup deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error deleting followup',
      error: error.message
    });
  }
};