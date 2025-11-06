import mongoose from 'mongoose';

const interviewInsightsSchema = new mongoose.Schema({
  interview: {
    type: String,
    ref: 'Interview',
    unique: true,
    sparse: true,
    default: null
  },
  interviewReport: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  }
}, {
  timestamps: true
});

export default mongoose.model('InterviewInsights', interviewInsightsSchema);