import mongoose from 'mongoose';

const stdIqResponseSchema = new mongoose.Schema({
  interview: {
    type: String,
    required: true,
    ref: 'Interview',
    index: true
  },
    ques: {
    type: String,
    required: true,
    ref: 'StdInterviewQues'
  },
  responses: {
    type: mongoose.Schema.Types.Mixed,
    default: []
  }
}, {
  timestamps: true
});

export default mongoose.model('StdIqResponse', stdIqResponseSchema);