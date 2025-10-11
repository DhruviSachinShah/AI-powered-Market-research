import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  user_name: {
    type: String,
    required: true
  },
  user_type: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);