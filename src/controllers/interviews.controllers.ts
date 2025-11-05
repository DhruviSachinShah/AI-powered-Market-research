// controllers/interviewController.js
import Interview from '../models/interviews.models';

export const getAllInterviews = async (req: any, res: any) => {
  try {
    const interviews = await Interview.find();
    res.status(200).json({
      success: true,
      count: interviews.length,
      data: interviews
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching interviews',
      error: error.message
    });
  }
};

export const getInterviewById = async (req: any, res: any) => {
  try {
    const interview = await Interview.findById(req.params.interviewId);
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }
    res.status(200).json({
      success: true,
      data: interview
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching interview',
      error: error.message
    });
  }
};

export const getInterviewsByUser = async (req: any, res: any) => {
  try {
    const interviews = await Interview.find({ user: req.params.userId });
    res.status(200).json({
      success: true,
      count: interviews.length,
      data: interviews
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user interviews',
      error: error.message
    });
  }
};

export const getInterviewsByProduct = async (req: any, res: any) => {
  try {
    const interviews = await Interview.find({ product: req.params.productId });
    res.status(200).json({
      success: true,
      count: interviews.length,
      data: interviews
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product interviews',
      error: error.message
    });
  }
};

export const createInterview = async (req: any, res: any) => {
  try {
    const interview = await Interview.create(req.body);
    res.status(201).json({
      success: true,
      data: interview
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Error creating interview',
      error: error.message
    });
  }
};

export const updateInterview = async (req: any, res: any) => {
  try {
    const interview = await Interview.findByIdAndUpdate(
      req.params.interviewId,
      req.body,
      { new: true, runValidators: true }
    );
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }
    res.status(200).json({
      success: true,
      data: interview
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Error updating interview',
      error: error.message
    });
  }
};

export const deleteInterview = async (req: any, res: any) => {
  try {
    const interview = await Interview.findByIdAndDelete(req.params.interviewId);
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Interview deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error deleting interview',
      error: error.message
    });
  }
};