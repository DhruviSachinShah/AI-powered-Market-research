import mongoose from 'mongoose';

const stdInterviewQuesSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  questions: [{
    type: String,
    required: true
  }]
}, {
  timestamps: true
});

export default mongoose.model('StdInterviewQues', stdInterviewQuesSchema);