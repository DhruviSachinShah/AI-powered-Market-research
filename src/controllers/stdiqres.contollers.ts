// controllers/stdIqResponseController.js
import StdIqResponse from '../models/stdiqres.models';

export const getAllResponses = async (req: any, res: any) => {
  try {
    const responses = await StdIqResponse.find();
    res.status(200).json({
      success: true,
      count: responses.length,
      data: responses
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching responses',
      error: error.message
    });
  }
};

export const getResponseByInterviewId = async (req: any, res: any) => {
  try {
    const response = await StdIqResponse.findOne({ interview: req.params.interviewId });
    if (!response) {
      return res.status(404).json({
        success: false,
        message: 'Response not found'
      });
    }
    res.status(200).json({
      success: true,
      data: response
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching response',
      error: error.message
    });
  }
};

export const createResponse = async (req: any, res: any) => {
  try {
    const response = await StdIqResponse.create(req.body);
    res.status(201).json({
      success: true,
      data: response
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Error creating response',
      error: error.message
    });
  }
};

export const updateResponse = async (req: any, res: any) => {
  try {
    const response = await StdIqResponse.findOneAndUpdate(
      { interview: req.params.interviewId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!response) {
      return res.status(404).json({
        success: false,
        message: 'Response not found'
      });
    }
    res.status(200).json({
      success: true,
      data: response
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Error updating response',
      error: error.message
    });
  }
};

export const deleteResponse = async (req: any, res: any) => {
  try {
    const response = await StdIqResponse.findOneAndDelete({ interview: req.params.interviewId });
    if (!response) {
      return res.status(404).json({
        success: false,
        message: 'Response not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Response deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error deleting response',
      error: error.message
    });
  }
};