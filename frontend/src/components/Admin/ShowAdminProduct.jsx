import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../../redux/slices/authSlice";
import {
  fetchProducts,
  fetchCategories,
  addProduct,
  addCategory,
  fetchProductsByUserId,
} from "../../redux/slices/ProductSlice";
import { ShoppingCart, Edit, Trash2, Plus, Package, Tag } from "lucide-react";

const ShowAdminProduct = () => {
  const [categories, setCategories] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    const fetchCategoriesData = async () => {
      setIsLoading(true);
      try {
        const data = await dispatch(fetchCategories());
        setCategories(data.payload.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategoriesData();
  }, [dispatch]);

  useEffect(() => {
    const handlefetchProducts = async () => {
      setIsLoading(true);
      const results = {};
  
      try {
        for (const category of categories) {
          const res = await dispatch(fetchProducts({
            categoryId: category._id,
            userId: user._id,
          }));
    
          results[category._id] = res.payload.products || []; 
        }
    
        setProductsByCategory(results);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    if (categories.length > 0 && user?._id) {
      handlefetchProducts();
    }
  
  }, [categories, user, dispatch]);

  const toggleCategory = (categoryId) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryId);
    }
  };

  // Function to navigate to Add Product page with category pre-selected
  const navigateToAddProduct = (categoryId, categoryName) => {
    navigate('/admin/dashboard', { 
      state: { 
        view: 'addProduct',
        selectedCategory: {
          id: categoryId,
          name: categoryName
        }
      }
    });
  };

  // Function to handle product actions
  const handleEdit = (productId) => {
    console.log("Edit product:", productId);
    // Implement edit functionality here
  };

  const handleDelete = (productId) => {
    console.log("Delete product:", productId);
    // Implement delete functionality here
  };

  // Product Card Component
  const ProductCard = ({ product }) => {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition transform hover:scale-105 hover:shadow-lg duration-300">
        <div className="h-48 bg-gray-100 overflow-hidden relative">
          {product.productImage && product.productImage !== "not available" ? (
            <img 
              src={`http://localhost:8000/uploads/${product.productImage}`} 
              alt={product.productName} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-emerald-50 to-teal-50">
              <Package size={64} className="text-emerald-300" />
              <span className="absolute bottom-2 right-2 bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                No Image
              </span>
            </div>
          )}
          <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">
            Code: {product.productCode}
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-800 truncate">{product.productName}</h3>
          <p className="text-gray-500 text-sm mt-1 h-10 overflow-hidden">{product.productDescription}</p>
          
          <div className="mt-3 flex justify-between items-center">
            <span className="text-emerald-600 font-bold text-lg">₹{product.productPrice}</span>
            <div className="flex space-x-2">
              <button 
                onClick={() => handleEdit(product._id)}
                className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
              >
                <Edit size={16} />
              </button>
              <button 
                onClick={() => handleDelete(product._id)}
                className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Category Section Component
  const CategorySection = ({ category }) => {
    const isExpanded = expandedCategory === category._id;
    const products = productsByCategory[category._id] || [];
    
    return (
      <div className="mb-6 border border-gray-100 rounded-xl overflow-hidden shadow-sm">
        <div 
          className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${
            isExpanded ? "bg-emerald-100" : "bg-white hover:bg-gray-50"
          }`}
          onClick={() => toggleCategory(category._id)}
        >
          <div className="flex items-center">
            <Tag className="mr-3 text-emerald-500" />
            <h2 className="text-xl font-semibold text-gray-800">{category.categoryName}</h2>
            <span className="ml-3 bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full">
              {products.length} products
            </span>
          </div>
          <button className="text-gray-400 hover:text-emerald-600">
            {isExpanded ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
        
        {isExpanded && (
          <div className="p-4 bg-gray-50">
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
                <div 
                  className="bg-white rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center h-64 hover:border-emerald-300 transition-colors cursor-pointer hover:bg-emerald-50"
                  onClick={() => navigateToAddProduct(category._id, category.categoryName)}
                >
                  <div className="text-center">
                    <Plus size={32} className="mx-auto text-emerald-400" />
                    <p className="mt-2 text-emerald-600 font-medium">Add New Product</p>
                    <p className="text-xs text-gray-500 mt-1">in {category.categoryName}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Package size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-400 mb-4">No products found in this category</p>
                <button 
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md inline-flex items-center transition-colors"
                  onClick={() => navigateToAddProduct(category._id, category.categoryName)}
                >
                  <Plus size={16} className="mr-2" />
                  Add First Product
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Function to navigate to Add Product page from main button
  const handleAddProductClick = () => {
    navigate('/admin/dashboard', { 
      state: { 
        view: 'addProduct'
      }
    });
  };

  // Function to navigate to Add Category page
  const handleAddCategoryClick = () => {
    navigate('/admin/dashboard', { 
      state: { 
        view: 'manageCategories'
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">
          Product Management
          {user?._id && <span className="text-sm text-gray-500 ml-2 font-normal">Admin ID: {user._id}</span>}
        </h1>
        
        <div className="flex space-x-3">
          <button 
            className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-md hover:bg-emerald-200 transition-colors flex items-center"
            onClick={handleAddCategoryClick}
          >
            <Plus size={16} className="mr-2" />
            Add Category
          </button>
          <button 
            className="bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600 transition-colors flex items-center"
            onClick={handleAddProductClick}
          >
            <Plus size={16} className="mr-2" />
            Add Product
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      ) : categories.length > 0 ? (
        <div className="space-y-6">
          {categories.map(category => (
            <CategorySection key={category._id} category={category} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <Tag size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">No Categories Available</h3>
          <p className="text-gray-500 mb-6">Start by creating your first product category</p>
          <button 
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-md inline-flex items-center transition-colors"
            onClick={handleAddCategoryClick}
          >
            <Plus size={18} className="mr-2" />
            Create First Category
          </button>
        </div>
      )}
    </div>
  );
};

export default ShowAdminProduct;