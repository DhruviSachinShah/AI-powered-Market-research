import React, { useState, useEffect } from 'react';
import { productService } from '../../services';
import type { Product } from '../../types';

const Admin: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    prod_name: '',
    category: '',
    prod_desc: '',
    prod_price: '',
    target_audience: '',
    image: null as File | null
  });
  const [errors, setErrors] = useState({
    prod_name: '',
    category: '',
    prod_desc: '',
    prod_price: '',
    target_audience: '',
    image: ''
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Load products on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await productService.getAllProducts();
      if (response.success && response.data) {
        setProducts(response.data);
      } else {
        console.error('Failed to load products:', response.message);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = { prod_name: '', category: '', prod_desc: '', prod_price: '', target_audience: '', image: '' };
    let isValid = true;

    if (!formData.prod_name.trim()) {
      newErrors.prod_name = 'Product name is required';
      isValid = false;
    } else if (formData.prod_name.trim().length < 3) {
      newErrors.prod_name = 'Product name must be at least 3 characters';
      isValid = false;
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
      isValid = false;
    } else if (formData.category.trim().length < 2) {
      newErrors.category = 'Category must be at least 2 characters';
      isValid = false;
    }

    if (!formData.prod_desc.trim()) {
      newErrors.prod_desc = 'Product description is required';
      isValid = false;
    } else if (formData.prod_desc.trim().length < 10) {
      newErrors.prod_desc = 'Product description must be at least 10 characters';
      isValid = false;
    }

    if (!formData.prod_price.trim()) {
      newErrors.prod_price = 'Product price is required';
      isValid = false;
    } else {
      const price = parseFloat(formData.prod_price);
      if (isNaN(price) || price <= 0) {
        newErrors.prod_price = 'Please enter a valid price (greater than 0)';
        isValid = false;
      }
    }

    if (!formData.target_audience.trim()) {
      newErrors.target_audience = 'Target audience is required';
      isValid = false;
    } else if (formData.target_audience.trim().length < 3) {
      newErrors.target_audience = 'Target audience must be at least 3 characters';
      isValid = false;
    }

    if (formData.image) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(formData.image.type)) {
        newErrors.image = 'Please upload a valid image file (JPEG, PNG, GIF, or WebP)';
        isValid = false;
      } else if (formData.image.size > 5 * 1024 * 1024) { // 5MB limit
        newErrors.image = 'Image size must be less than 5MB';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Clear error when user selects a file
      if (errors.image) {
        setErrors(prev => ({
          ...prev,
          image: ''
        }));
      }
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }));
    setImagePreview(null);
    setErrors(prev => ({
      ...prev,
      image: ''
    }));
  };


  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting form', formData);
    if (validateForm()) {
      setSubmitting(true);
      try {
        const productData = {
          prod_name: formData.prod_name.trim(),
          category: formData.category.trim(),
          prod_desc: formData.prod_desc.trim(),
          prod_price: parseFloat(formData.prod_price),
          target_audience: formData.target_audience.trim()
        };

        const response = await productService.createProduct(productData);
        if (response.success && response.data) {
          setProducts(prev => [response.data!, ...prev]);
          setFormData({ prod_name: '', category: '', prod_desc: '', prod_price: '', target_audience: '', image: null });
          setErrors({ prod_name: '', category: '', prod_desc: '', prod_price: '', target_audience: '', image: '' });
          setImagePreview(null);
        } else {
          console.error('Failed to create product:', response.message);
        }
      } catch (error) {
        console.error('Error creating product:', error);
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const response = await productService.deleteProduct(id);
      if (response.success) {
        setProducts(prev => prev.filter(product => product._id !== id));
      } else {
        console.error('Failed to delete product:', response.message);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage your products and inventory</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Product Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Add New Product</h2>
            
             <form onSubmit={handleSubmit} className="space-y-6">
               {/* Product Name */}
               <div>
                 <label htmlFor="prod_name" className="block text-sm font-medium text-gray-700 mb-2">
                   Product Name *
                 </label>
                 <input
                   type="text"
                   id="prod_name"
                   name="prod_name"
                   value={formData.prod_name}
                   onChange={handleInputChange}
                   className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                     errors.prod_name ? 'border-red-300' : 'border-gray-300'
                   }`}
                   placeholder="Enter product name"
                 />
                 {errors.prod_name && (
                   <p className="mt-1 text-sm text-red-600">{errors.prod_name}</p>
                 )}
               </div>

               {/* Category */}
               <div>
                 <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                   Category *
                 </label>
                 <input
                   type="text"
                   id="category"
                   name="category"
                   value={formData.category}
                   onChange={handleInputChange}
                   className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                     errors.category ? 'border-red-300' : 'border-gray-300'
                   }`}
                   placeholder="Enter product category"
                 />
                 {errors.category && (
                   <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                 )}
               </div>

               {/* Product Description */}
               <div>
                 <label htmlFor="prod_desc" className="block text-sm font-medium text-gray-700 mb-2">
                   Product Description *
                 </label>
                 <textarea
                   id="prod_desc"
                   name="prod_desc"
                   rows={4}
                   value={formData.prod_desc}
                   onChange={handleInputChange}
                   className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                     errors.prod_desc ? 'border-red-300' : 'border-gray-300'
                   }`}
                   placeholder="Enter detailed product description"
                 />
                 {errors.prod_desc && (
                   <p className="mt-1 text-sm text-red-600">{errors.prod_desc}</p>
                 )}
               </div>

               {/* Product Price */}
               <div>
                 <label htmlFor="prod_price" className="block text-sm font-medium text-gray-700 mb-2">
                   Product Price *
                 </label>
                 <input
                   type="number"
                   id="prod_price"
                   name="prod_price"
                   value={formData.prod_price}
                   onChange={handleInputChange}
                   min="0"
                   step="0.01"
                   className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                     errors.prod_price ? 'border-red-300' : 'border-gray-300'
                   }`}
                   placeholder="Enter product price"
                 />
                 {errors.prod_price && (
                   <p className="mt-1 text-sm text-red-600">{errors.prod_price}</p>
                 )}
               </div>

               {/* Target Audience */}
               <div>
                 <label htmlFor="target_audience" className="block text-sm font-medium text-gray-700 mb-2">
                   Target Audience *
                 </label>
                 <input
                   type="text"
                   id="target_audience"
                   name="target_audience"
                   value={formData.target_audience}
                   onChange={handleInputChange}
                   className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                     errors.target_audience ? 'border-red-300' : 'border-gray-300'
                   }`}
                   placeholder="Enter target audience"
                 />
                 {errors.target_audience && (
                   <p className="mt-1 text-sm text-red-600">{errors.target_audience}</p>
                 )}
               </div>

              {/* Product Image */}
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                  Product Image
                </label>
                <div className="space-y-3">
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${
                      errors.image ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.image && (
                    <p className="text-sm text-red-600">{errors.image}</p>
                  )}
                  
                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        className="w-full h-48 object-cover rounded-md border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        title="Remove image"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Adding Product...' : 'Add Product'}
              </button>
            </form>
          </div>

          {/* Products List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Products ({products.length})
            </h2>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="text-blue-500 mb-2">
                  <svg className="animate-spin mx-auto h-8 w-8" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <p className="text-gray-500">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <p className="text-gray-500">No products added yet</p>
                <p className="text-sm text-gray-400">Add your first product using the form</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {products.map((product) => (
                  <div key={product._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      {product.image && (
                        <div className="flex-shrink-0">
                           <img
                             src={product.image}
                             alt={product.prod_name}
                             className="w-20 h-20 object-cover rounded-md border border-gray-200"
                           />
                        </div>
                      )}
                      
                       {/* Product Details */}
                       <div className="flex-1 min-w-0">
                         <div className="flex justify-between items-start">
                           <div className="flex-1">
                             <h3 className="font-medium text-gray-900 mb-1">{product.prod_name}</h3>
                             <div className="text-sm text-gray-600 mb-2 space-y-1">
                               <p><span className="font-medium">Category:</span> {product.category}</p>
                               <p><span className="font-medium">Price:</span> ${product.prod_price.toFixed(2)}</p>
                               <p><span className="font-medium">Target:</span> {product.target_audience}</p>
                               <p className="line-clamp-2"><span className="font-medium">Description:</span> {product.prod_desc}</p>
                             </div>
                             <p className="text-xs text-gray-400">
                               Added: {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'Unknown'} at {product.createdAt ? new Date(product.createdAt).toLocaleTimeString() : 'Unknown'}
                             </p>
                           </div>
                          <button
                            onClick={() => handleDeleteProduct(product._id || product._id)}
                            className="ml-4 text-red-600 hover:text-red-800 transition-colors flex-shrink-0"
                            title="Delete product"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
