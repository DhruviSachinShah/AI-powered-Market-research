import api from './api';
import type { Product, ApiResponse } from '../types';

class ProductService {
  // Get all products
  async getAllProducts(): Promise<ApiResponse<Product[]>> {
    try {
      const response = await api.get('/products');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch products',
        data: undefined
      };
    }
  }

  // Get product by ID
  async getProductById(productId: string): Promise<ApiResponse<Product>> {
    try {
      const response = await api.get(`/products/${productId}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch product',
        data: undefined
      };
    }
  }

  // Create new product
  async createProduct(productData: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Product>> {
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create product',
        data: undefined
      };
    }
  }

  // Update product by ID
  async updateProduct(productId: string, productData: Partial<Omit<Product, '_id' | 'createdAt' | 'updatedAt'>>): Promise<ApiResponse<Product>> {
    try {
      const response = await api.put(`/products/${productId}`, productData);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update product',
        data: undefined
      };
    }
  }

  // Delete product by ID
  async deleteProduct(productId: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await api.delete(`/products/${productId}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete product',
        data: undefined
      };
    }
  }
}

export const productService = new ProductService();
