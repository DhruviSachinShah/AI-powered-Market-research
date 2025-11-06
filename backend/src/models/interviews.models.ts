import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
    ref: 'User'
  },
  product: {
    type: String,
    required: true,
    ref: 'Product'
  }
}, {
  timestamps: true
});

export default mongoose.model('Interview', interviewSchema);