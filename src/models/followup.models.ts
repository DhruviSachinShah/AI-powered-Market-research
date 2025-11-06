import mongoose from 'mongoose';

const followupSchema = new mongoose.Schema({
  interview: {
    type: String,
    ref: 'Interview',
    default: null
  },
  followup_ques: {
    type: String,
    default: null
  },
  followup_response: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

export default mongoose.model('Followup', followupSchema);