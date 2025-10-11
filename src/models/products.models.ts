import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  prod_name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  prod_desc: {
    type: String,
    required: true
  },
  prod_price: {
    type: Number,
    required: true
  },
  target_audience: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Product', productSchema);