import { Request, Response } from 'express';
import ProductInsights from '../models/productinsight.models';
import { GeminiService, ProductInsightData } from '../services/geminiService';
import { ResponseAggregationService } from '../services/responseAggregationService';

const geminiService = new GeminiService();
const aggregationService = new ResponseAggregationService();

export const generateProductInsights = async (req: Request, res: Response) => {
  const { productId } = req.params;

  if (!productId) {
    return res.status(400).json({
      success: false,
      message: 'Product ID is required'
    });
  }

  try {
    // Validate that product has responses
    const hasResponses = await aggregationService.validateProductHasResponses(productId);
    if (!hasResponses) {
      return res.status(400).json({
        success: false,
        message: 'No responses found for this product. Conduct interviews first.'
      });
    }

    // Aggregate responses
    const aggregatedData = await aggregationService.aggregateResponsesByProduct(productId);

    // Generate insights from Gemini
    const quantitativeInsights: ProductInsightData[] = await geminiService.generateProductInsights(
      aggregatedData.rawResponsesText
    );

    console.log('📊 Gemini quantitative insights:', quantitativeInsights);

    // Prepare data to upsert
    const productInsightsData = {
      product: productId,
      product_report: {
        qualitative: 'No qualitative insights yet', // optional, can extend later if you want qualitative insights
        quantitative: quantitativeInsights,
        generatedAt: new Date().toISOString(),
        productInfo: {
          name: aggregatedData.productName,
          description: aggregatedData.productDescription,
          totalInterviews: aggregatedData.totalInterviews
        },
        metadata: {
          totalQuestions: aggregatedData.questions.length,
          totalResponses: aggregatedData.questions.reduce((sum, q) => sum + q.responseCount, 0),
          aiModel: 'gemini-pro-latest'
        }
      }
    };

    // Upsert product insights
    const productInsights = await ProductInsights.findOneAndUpdate(
      { product: productId },
      productInsightsData,
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Product insights generated successfully',
      data: {
        productInsights,
        aggregatedData: {
          productName: aggregatedData.productName,
          totalInterviews: aggregatedData.totalInterviews,
          totalQuestions: aggregatedData.questions.length,
          totalResponses: aggregatedData.questions.reduce((sum, q) => sum + q.responseCount, 0)
        }
      }
    });
  } catch (error: any) {
    console.error('❌ Error generating product insights:', error);

    let message = 'Error generating product insights';
    if (error.message.includes('GEMINI_API_KEY')) {
      message = 'Gemini API key not configured. Set GEMINI_API_KEY.';
    } else if (error.message.includes('Failed to generate insights')) {
      message = 'Failed to generate insights from AI service.';
    }

    res.status(500).json({ success: false, message, error: error.message });
  }
};

export const getProductInsights = async (req: Request, res: Response) => {
  const { productId } = req.params;
  if (!productId) return res.status(400).json({ success: false, message: 'Product ID is required' });

  try {
    const productInsights = await ProductInsights.findOne({ product: productId });
    if (!productInsights)
      return res.status(404).json({ success: false, message: 'Product insights not found. Generate first.' });

    res.status(200).json({ success: true, data: productInsights });
  } catch (error: any) {
    console.error('❌ Error fetching product insights:', error);
    res.status(500).json({ success: false, message: 'Error fetching product insights', error: error.message });
  }
};

export const getAllProductInsights = async (_req: Request, res: Response) => {
  try {
    const productsWithResponses = await aggregationService.getAllProductsWithResponseCounts();
    const productInsights = await ProductInsights.find().populate('product');

    const result = productsWithResponses.map(product => {
      const insights = productInsights.find(pi => pi.product === product.productId);
      return {
        ...product,
        insightsGenerated: !!insights,
        lastGenerated: insights?.updatedAt || null
      };
    });

    res.status(200).json({ success: true, count: result.length, data: result });
  } catch (error: any) {
    console.error('❌ Error fetching all product insights:', error);
    res.status(500).json({ success: false, message: 'Error fetching product insights', error: error.message });
  }
};

export const deleteProductInsights = async (req: Request, res: Response) => {
  const { productId } = req.params;
  if (!productId) return res.status(400).json({ success: false, message: 'Product ID is required' });

  try {
    const deleted = await ProductInsights.findOneAndDelete({ product: productId });
    if (!deleted) return res.status(404).json({ success: false, message: 'Product insights not found' });

    res.status(200).json({ success: true, message: 'Product insights deleted successfully' });
  } catch (error: any) {
    console.error('❌ Error deleting product insights:', error);
    res.status(500).json({ success: false, message: 'Error deleting product insights', error: error.message });
  }
};

export const testGeminiConnection = async (_req: Request, res: Response) => {
  try {
    const connected = await geminiService.testConnection();
    res.status(200).json({
      success: true,
      data: { connected, message: connected ? 'Gemini API connection successful' : 'Gemini API connection failed' }
    });
  } catch (error: any) {
    console.error('❌ Error testing Gemini connection:', error);
    res.status(500).json({ success: false, message: 'Error testing Gemini API connection', error: error.message });
  }
};
