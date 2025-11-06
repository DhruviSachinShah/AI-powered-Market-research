import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product.controllers';

const router = express.Router();

// Product routes
router.get('/', getAllProducts);
router.get('/:productId', getProductById);
router.post('/', createProduct);
router.put('/:productId', updateProduct);
router.delete('/:productId', deleteProduct);

export default router;
