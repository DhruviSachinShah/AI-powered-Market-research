// controllers/followupController.js
import Followup from '../models/followup.models';

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