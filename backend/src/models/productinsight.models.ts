import mongoose from 'mongoose';

const productInsightsSchema = new mongoose.Schema({
  product: {
    type: String,
    ref: 'Product',
    required: true,
    unique: true
  },
  product_report: {
    qualitative: {
      type: String,
      required: true
    },
    quantitative: [
      {
        question_text: String,
        question_type: String,
        visualization_type: String,
        chart_data: {
          labels: [String],
          datasets: [
            {
              label: String,
              data: [Number],
              backgroundColor: [String]
            }
          ]
        }
      }
    ]
  }
}, { timestamps: true });

export default mongoose.model('ProductInsights', productInsightsSchema);
