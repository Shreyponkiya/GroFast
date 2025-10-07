import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  updateProduct, // Assuming this is imported; add if not present in slice
  fetchProductById,
} from "../../redux/slices/ProductSlice";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Upload, Plus, AlertTriangle, Check, X } from "lucide-react";

// Toast Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";
  const Icon = type === "success" ? Check : AlertTriangle;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 max-w-sm`}
      >
        <Icon size={20} />
        <span className="flex-1">{message}</span>
        <button onClick={onClose} className="text-white hover:text-gray-200">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

const EditProductPage = ({ selectedCategory }) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);

  const [formData, setFormData] = useState({
    productName: "",
    productDescription: "",
    productPrice: "",
    productQuantity: "",
    productImage: "",
    productCode: "",
    productCategory: selectedCategory ? selectedCategory.id : "",
    createdBy: user?._id || "",
  });

  // Generate a random product code (only if needed)
  function generateProductCode() {
    return "PRD" + Math.floor(100000 + Math.random() * 900000);
  }

  useEffect(() => {
    // Fetch product details by ID and populate form
    const fetchProductDetails = async () => {
      try {
        const data = await dispatch(fetchProductById(id));
        if (data.payload) {
          const product = data.payload;
          setFormData({
            productName: product.productName || "",
            productDescription: product.productDescription || "",
            productPrice: product.productPrice || "",
            productQuantity: product.productQuantity || "",
            productImage: "", // Image will be handled separately
            productCode: product.productCode || generateProductCode(),
            productCategory: product.productCategory?._id || "",
            createdBy: product.createdBy?._id || user?._id || "",
          });
          if (product.productImage) {
            setImagePreview(product.productImage);
            setIsImageUploaded(true);
          }
          validateImage(); // Validate after loading
        } else {
          showToast("Failed to load product details", "error");
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        showToast("An error occurred while fetching product details", "error");
      }
    };
    fetchProductDetails();
  }, [dispatch, id, user]);

  // Show toast message
  const showToast = (message, type) => {
    setToast({ message, type });
  };

  // Validation function
  const validateForm = () => {
    const errors = {};

    // Product Name validation
    if (!formData.productName.trim()) {
      errors.productName = "Product name is required";
    } else if (formData.productName.trim().length < 3) {
      errors.productName = "Product name must be at least 3 characters";
    } else if (formData.productName.trim().length > 100) {
      errors.productName = "Product name must not exceed 100 characters";
    }

    // Product Description validation
    if (
      formData.productDescription.trim() &&
      formData.productDescription.trim().length > 500
    ) {
      errors.productDescription = "Description must not exceed 500 characters";
    }

    // Product Price validation
    if (!formData.productPrice) {
      errors.productPrice = "Price is required";
    } else {
      const price = parseFloat(formData.productPrice);
      if (isNaN(price)) {
        errors.productPrice = "Price must be a valid number";
      } else if (price < 0) {
        errors.productPrice = "Price cannot be negative";
      } else if (price > 1000000) {
        errors.productPrice = "Price cannot exceed ₹10,00,000";
      } else if (price === 0) {
        errors.productPrice = "Price must be greater than 0";
      }
    }

    // Product Quantity validation
    if (formData.productQuantity !== "") {
      const quantity = parseInt(formData.productQuantity);
      if (isNaN(quantity)) {
        errors.productQuantity = "Quantity must be a valid number";
      } else if (quantity < 0) {
        errors.productQuantity = "Quantity cannot be negative";
      } else if (quantity > 100000) {
        errors.productQuantity = "Quantity cannot exceed 1,00,000";
      }
    }

    // Product Category validation
    if (!formData.productCategory) {
      errors.productCategory = "Category is required";
    }

    // Product Image validation
    if (!imagePreview) {
      errors.productImage = "Product image is required";
    }

    // Created By validation
    if (!formData.createdBy) {
      errors.createdBy = "User authentication required";
    }

    return errors;
  };

  // Validate individual field on change
  const validateField = (name, value) => {
    const errors = { ...validationErrors };

    switch (name) {
      case "productName":
        if (!value.trim()) {
          errors.productName = "Product name is required";
        } else if (value.trim().length < 3) {
          errors.productName = "Product name must be at least 3 characters";
        } else if (value.trim().length > 100) {
          errors.productName = "Product name must not exceed 100 characters";
        } else {
          delete errors.productName;
        }
        break;

      case "productDescription":
        if (value.trim() && value.trim().length > 500) {
          errors.productDescription =
            "Description must not exceed 500 characters";
        } else {
          delete errors.productDescription;
        }
        break;

      case "productPrice":
        if (!value) {
          errors.productPrice = "Price is required";
        } else {
          const price = parseFloat(value);
          if (isNaN(price)) {
            errors.productPrice = "Price must be a valid number";
          } else if (price < 0) {
            errors.productPrice = "Price cannot be negative";
          } else if (price > 1000000) {
            errors.productPrice = "Price cannot exceed ₹10,00,000";
          } else if (price === 0) {
            errors.productPrice = "Price must be greater than 0";
          } else {
            delete errors.productPrice;
          }
        }
        break;

      case "productQuantity":
        if (value !== "") {
          const quantity = parseInt(value);
          if (isNaN(quantity)) {
            errors.productQuantity = "Quantity must be a valid number";
          } else if (quantity < 0) {
            errors.productQuantity = "Quantity cannot be negative";
          } else if (quantity > 100000) {
            errors.productQuantity = "Quantity cannot exceed 1,00,000";
          } else {
            delete errors.productQuantity;
          }
        } else {
          delete errors.productQuantity;
        }
        break;

      case "productCategory":
        if (!value) {
          errors.productCategory = "Category is required";
        } else {
          delete errors.productCategory;
        }
        break;

      default:
        break;
    }

    setValidationErrors(errors);
  };

  // Validate image separately
  const validateImage = () => {
    const errors = { ...validationErrors };
    if (!imagePreview) {
      errors.productImage = "Product image is required";
    } else {
      delete errors.productImage;
    }
    setValidationErrors(errors);
  };

  useEffect(() => {
    // Fetch categories on component mount
    const fetchCategoriesData = async () => {
      try {
        const data = await dispatch(fetchCategories());
        setCategories(data.payload.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        showToast("Failed to load categories", "error");
      }
    };
    fetchCategoriesData();
  }, [dispatch]);

  // Update formData when selectedCategory changes
  useEffect(() => {
    if (selectedCategory) {
      setFormData((prev) => ({
        ...prev,
        productCategory: selectedCategory.id,
      }));
      // Clear category validation error if exists
      if (validationErrors.productCategory) {
        validateField("productCategory", selectedCategory.id);
      }
    }
  }, [selectedCategory]);

  // Update createdBy when user changes
  useEffect(() => {
    if (user?._id) {
      setFormData((prev) => ({
        ...prev,
        createdBy: user._id,
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Validate field on change
    validateField(name, value);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        showToast("File size must not exceed 5MB", "error");
        return;
      }

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
      ];
      if (!allowedTypes.includes(file.type)) {
        showToast("Only JPG, PNG, and GIF files are allowed", "error");
        return;
      }

      console.log("File uploaded:", file);
      setFormData({
        ...formData,
        productImage: file,
      });
      setIsImageUploaded(true);
      setRemoveImage(false);

      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        validateImage();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData({
      ...formData,
      productImage: "",
    });
    setImagePreview(null);
    setIsImageUploaded(false);
    setRemoveImage(true);
    validateImage();
  };

  const resetForm = () => {
    setFormData({
      productName: "",
      productDescription: "",
      productPrice: "",
      productQuantity: "",
      productImage: "",
      productCode: generateProductCode(),
      productCategory: selectedCategory ? selectedCategory.id : "",
      createdBy: user?._id || "",
    });
    setIsImageUploaded(false);
    setImagePreview(null);
    setValidationErrors({});
    setSuccessMessage("");
    setErrorMessage("");
    setRemoveImage(false);
    showToast("Form reset successfully", "success");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    // Validate form
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setIsLoading(false);
      showToast("Please fix all validation errors", "error");
      return;
    }

    try {
      // Creating FormData object to send the file along with other form fields
      const formDataToSend = new FormData();
      formDataToSend.append("productName", formData.productName.trim());
      formDataToSend.append(
        "productDescription",
        formData.productDescription.trim()
      );
      formDataToSend.append("productPrice", formData.productPrice);
      formDataToSend.append("productQuantity", formData.productQuantity || "0");
      formDataToSend.append("productCategory", formData.productCategory);
      formDataToSend.append("productCode", formData.productCode);
      formDataToSend.append("createdBy", formData.createdBy);

      if (formData.productImage) {
        formDataToSend.append("productImage", formData.productImage);
      }
      if (removeImage) {
        formDataToSend.append("removeImage", "true");
      }

      const result = await dispatch(
        updateProduct({ id, data: formDataToSend })
      );
      console.log("Update product result:", result);

      if (result.payload && result.payload.success) {
        setSuccessMessage("Product updated successfully!");
        showToast("Product updated successfully!", "success");
        navigate("/admin/product-list");
        // Optionally reset or refetch
        resetForm();
      } else {
        const errorMsg =
          result.payload?.message ||
          "Failed to update product. Please try again.";
        setErrorMessage(errorMsg);
        showToast(errorMsg, "error");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      const errorMsg =
        error.response?.data?.message || "An error occurred. Please try again.";
      setErrorMessage(errorMsg);
      showToast(errorMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Toast Messages */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Edit Product
        </h1>
        <p className="text-gray-600">Update your product details</p>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded flex items-start">
          <Check className="text-green-500 mr-3 mt-0.5" size={18} />
          <p className="text-green-700">{successMessage}</p>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded flex items-start">
          <AlertTriangle className="text-red-500 mr-3 mt-0.5" size={18} />
          <p className="text-red-700">{errorMessage}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-sm p-6 border border-gray-100"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Product Name */}
            <div>
              <label
                htmlFor="productName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Product Name *
              </label>
              <input
                type="text"
                id="productName"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  validationErrors.productName
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Enter product name"
                required
              />
              {validationErrors.productName && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.productName}
                </p>
              )}
            </div>

            {/* Product Description */}
            <div>
              <label
                htmlFor="productDescription"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="productDescription"
                name="productDescription"
                value={formData.productDescription}
                onChange={handleChange}
                rows="4"
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  validationErrors.productDescription
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Describe your product"
              ></textarea>
              {validationErrors.productDescription && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.productDescription}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {formData.productDescription.length}/500 characters
              </p>
            </div>

            {/* Category Selection */}
            <div>
              <label
                htmlFor="productCategory"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category *
              </label>
              <select
                id="productCategory"
                name="productCategory"
                value={formData.productCategory}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  validationErrors.productCategory
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
              {validationErrors.productCategory && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.productCategory}
                </p>
              )}
            </div>

            {/* Product Code (Auto-Generated) */}
            <div>
              <label
                htmlFor="productCode"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Product Code
              </label>
              <input
                type="text"
                id="productCode"
                name="productCode"
                value={formData.productCode}
                className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-md cursor-not-allowed"
                readOnly
              />
              <p className="text-xs text-gray-500 mt-1">
                Auto-generated unique product code
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Product Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Image *
              </label>
              <div
                className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md h-48 ${
                  validationErrors.productImage
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              >
                {imagePreview ? (
                  <div className="relative w-full h-full">
                    <img
                      src={`http://localhost:8000/uploads/${imagePreview}`}
                      alt="Product preview"
                      className="w-full h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2 hover:bg-red-600 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1 text-center">
                    <Upload
                      className="mx-auto h-12 w-12 text-gray-400"
                      strokeWidth={1}
                    />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="productImage"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none"
                      >
                        <span>Upload an image</span>
                        <input
                          id="productImage"
                          name="productImage"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                )}
              </div>
              {validationErrors.productImage && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.productImage}
                </p>
              )}
            </div>

            {/* Product Price */}
            <div>
              <label
                htmlFor="productPrice"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Price (₹) *
              </label>
              <input
                type="number"
                id="productPrice"
                name="productPrice"
                value={formData.productPrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  validationErrors.productPrice
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="0.00"
                required
              />
              {validationErrors.productPrice && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.productPrice}
                </p>
              )}
            </div>

            {/* Product Quantity */}
            <div>
              <label
                htmlFor="productQuantity"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Quantity in Stock
              </label>
              <input
                type="number"
                id="productQuantity"
                name="productQuantity"
                value={formData.productQuantity}
                onChange={handleChange}
                min="0"
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  validationErrors.productQuantity
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="0"
              />
              {validationErrors.productQuantity && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.productQuantity}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 mr-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors flex items-center disabled:bg-emerald-300"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Updating...
              </>
            ) : (
              <>
                <Plus size={18} className="mr-1" />
                Update Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProductPage;
