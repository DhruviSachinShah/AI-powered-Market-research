import mongoose from 'mongoose';

const productInsightsSchema = new mongoose.Schema({
  product: {
    type: String,
    ref: 'Product',
    unique: true,
    sparse: true,
    default: null
  },
  productReport: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  }
}, {
  timestamps: true
});

export default mongoose.model('ProductInsights', productInsightsSchema);