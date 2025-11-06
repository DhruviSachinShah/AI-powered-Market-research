// controllers/stdInterviewQuesController.js
import StdInterviewQues from '../models/stdiq.models';

export const getAllQuestions = async (req: any, res: any) => {
  try {
    const questions = await StdInterviewQues.find();
    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching questions',
      error: error.message
    });
  }
};

export const getQuestionById = async (req: any, res: any) => {
  try {
    const question = await StdInterviewQues.findById(req.params.quesId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }
    res.status(200).json({
      success: true,
      data: question
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching question',
      error: error.message
    });
  }
};

export const getQuestionsByProduct = async (req: any, res: any) => {
  try {
    const questions = await StdInterviewQues.find({ product: req.params.productId });
    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product questions',
      error: error.message
    });
  }
};

export const createQuestion = async (req: any, res: any) => {
  try {
    const question = await StdInterviewQues.create(req.body);
    res.status(201).json({
      success: true,
      data: question
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Error creating question',
      error: error.message
    });
  }
};

export const updateQuestion = async (req: any, res: any) => {
  try {
    const question = await StdInterviewQues.findByIdAndUpdate(
      req.params.quesId,
      req.body,
      { new: true, runValidators: true }
    );
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }
    res.status(200).json({
      success: true,
      data: question
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Error updating question',
      error: error.message
    });
  }
};

export const deleteQuestion = async (req: any, res: any) => {
  try {
    const question = await StdInterviewQues.findByIdAndDelete(req.params.quesId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Question deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error deleting question',
      error: error.message
    });
  }
};