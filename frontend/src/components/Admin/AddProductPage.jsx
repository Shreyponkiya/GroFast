import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchCategories,
  addProduct
} from "../../redux/slices/ProductSlice";
import { Upload, Plus, AlertTriangle, Check } from "lucide-react";

const AddProduct = ({ selectedCategory }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [formData, setFormData] = useState({
    productName: "",
    productDescription: "",
    productPrice: "",
    productQuantity: "",
    productImage: "",
    productCode: generateProductCode(),
    productCategory: selectedCategory ? selectedCategory.id : "",
    createdBy: user?._id || "",
  });

  // Generate a random product code
  function generateProductCode() {
    return "PRD" + Math.floor(100000 + Math.random() * 900000);
  }

  useEffect(() => {
    // Fetch categories on component mount
    const fetchCategoriesData = async () => {
      try {
        const data = await dispatch(fetchCategories());
        setCategories(data.payload.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategoriesData();
  }, [dispatch]);

  // Update formData when selectedCategory changes
  useEffect(() => {
    if (selectedCategory) {
      setFormData(prev => ({
        ...prev,
        productCategory: selectedCategory.id
      }));
    }
  }, [selectedCategory]);

  // Update createdBy when user changes
  useEffect(() => {
    if (user?._id) {
      setFormData(prev => ({
        ...prev,
        createdBy: user._id
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real implementation, you would upload this to your server/cloud storage
      // For now, we'll just use a local URL to preview the image
      console.log("File uploaded:", file);
       setFormData({
        ...formData,
        productImage: file, // In production, this would be a URL
      });
      setIsImageUploaded(true);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      productName: "",
      productDescription: "",
      productPrice: 0,
      productQuantity: "",
      productImage: "not available",
      productCode: generateProductCode(),
      productCategory: selectedCategory ? selectedCategory.id : "",
      createdBy: user?._id || "",
    });
    setIsImageUploaded(false);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
  
    try {
      // Validation
      if (!formData.productName || !formData.productPrice || !formData.productCategory || !formData.productImage) {
        setErrorMessage("Please fill in all required fields.");
        setIsLoading(false);
        return;
      }
  
      // Creating FormData object to send the file along with other form fields
      const formDataToSend = new FormData();
      formDataToSend.append("productName", formData.productName);
      formDataToSend.append("productDescription", formData.productDescription);
      formDataToSend.append("productPrice", formData.productPrice);
      formDataToSend.append("productQuantity", formData.productQuantity);
      formDataToSend.append("productCategory", formData.productCategory);
      formDataToSend.append("productCode", formData.productCode);
      formDataToSend.append("createdBy", formData.createdBy);
      formDataToSend.append("productImage", formData.productImage); // Append image file here
  
      const result = await dispatch(addProduct(formDataToSend)); // Send the FormData instead of plain JSON
      console.log("Add product result:", result);
  
      if (result.payload && result.payload.success) {
        setSuccessMessage("Product added successfully!");
        resetForm();
      } else {
        setErrorMessage("Failed to add product. Please try again.");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Add New Product</h1>
        <p className="text-gray-600">Create a new product for your inventory</p>
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

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Product Name */}
            <div>
              <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                id="productName"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter product name"
                required
              />
            </div>

            {/* Product Description */}
            <div>
              <label htmlFor="productDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="productDescription"
                name="productDescription"
                value={formData.productDescription}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Describe your product"
              ></textarea>
            </div>

            {/* Category Selection */}
            <div>
              <label htmlFor="productCategory" className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                id="productCategory"
                name="productCategory"
                value={formData.productCategory}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Code (Auto-Generated) */}
            <div>
              <label htmlFor="productCode" className="block text-sm font-medium text-gray-700 mb-1">
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
              <p className="text-xs text-gray-500 mt-1">Auto-generated unique product code</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Product Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Image
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md h-48">
                {imagePreview ? (
                  <div className="relative w-full h-full">
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="w-full h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({...formData, productImage: "not available"});
                        setIsImageUploaded(false);
                        setImagePreview(null);
                      }}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2 hover:bg-red-600 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
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
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Product Price */}
            <div>
              <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700 mb-1">
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="0.00"
                required
              />
            </div>

            {/* Product Quantity */}
            <div>
              <label htmlFor="productQuantity" className="block text-sm font-medium text-gray-700 mb-1">
                Quantity in Stock
              </label>
              <input
                type="number"
                id="productQuantity"
                name="productQuantity"
                value={formData.productQuantity}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="0"
              />
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
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </>
            ) : (
              <>
                <Plus size={18} className="mr-1" />
                Add Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;

// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { getProfile } from "../redux/slices/authSlice";
// import { toast } from "react-hot-toast";
// import { fetchCategories } from "../redux/slices/ProductSlice";
// import { DownOutlined } from "@ant-design/icons";
// import { Button, Dropdown, Space } from "antd";
// import axios from "axios";
// import { useFormik } from "formik";
// import Validations from "../SchmaValidations/Validations";

// const AddProductPage = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { user } = useSelector((state) => state.auth);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     dispatch(getProfile());
//   }, [dispatch]);

//   useEffect(() => {
//     handleCategoryFetch();
//   }, []);

//   const handleCategoryFetch = async () => {
//     const data = await dispatch(fetchCategories());
//     setCategories(data.payload.categories);
//   };

//   const formik = useFormik({
//     initialValues: {
//       createdBy: user?._id || "",
//       productCode: "",
//       productName: "",
//       productDescription: "",
//       productPrice: "",
//       productImage: "not available",
//       productCategory: "",
//     },
//     validationSchema: Validations.productSchema,
//     onSubmit: async (values, { resetForm }) => {
//       setLoading(true);
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.post(
//           "http://localhost:8000/api/admin/add-product",
//           values,
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         if (response.status === 201) {
//           toast.success("Product added successfully!");
//           resetForm();
//         } else {
//           toast.error("Failed to add product.");
//         }
//       } catch (error) {
//         toast.error("An error occurred. Please try again.");
//         console.error("Error:", error);
//       } finally {
//         setLoading(false);
//       }
//     },
//   });

//   const handleDropdownClick = ({ key }) => {
//     formik.setFieldValue("productCategory", key);
//   };

//   const menuProps = {
//     items: categories.map((cat) => ({
//       key: cat._id,
//       label: cat.categoryName,
//     })),
//     onClick: handleDropdownClick,
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
//         <div className="rounded-lg border-4 border-dashed border-gray-200 p-6 bg-white shadow-md">
//           <h2 className="text-2xl font-bold text-gray-800 mb-6">
//             Add New Product
//           </h2>
//           <form onSubmit={formik.handleSubmit}>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* Product Code */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Product Code
//                 </label>
//                 <input
//                   type="text"
//                   name="productCode"
//                   value={formik.values.productCode}
//                   onChange={formik.handleChange}
//                   className="w-full border p-2 rounded"
//                 />
//                 {formik.touched.productCode && formik.errors.productCode && (
//                   <p className="text-red-500 text-sm">
//                     {formik.errors.productCode}
//                   </p>
//                 )}
//               </div>

//               {/* Product Name */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Product Name
//                 </label>
//                 <input
//                   type="text"
//                   name="productName"
//                   value={formik.values.productName}
//                   onChange={formik.handleChange}
//                   className="w-full border p-2 rounded"
//                 />
//                 {formik.touched.productName && formik.errors.productName && (
//                   <p className="text-red-500 text-sm">
//                     {formik.errors.productName}
//                   </p>
//                 )}
//               </div>

//               {/* Description */}
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Description
//                 </label>
//                 <textarea
//                   name="productDescription"
//                   value={formik.values.productDescription}
//                   onChange={formik.handleChange}
//                   rows="3"
//                   className="w-full border p-2 rounded"
//                 />
//                 {formik.touched.productDescription &&
//                   formik.errors.productDescription && (
//                     <p className="text-red-500 text-sm">
//                       {formik.errors.productDescription}
//                     </p>
//                   )}
//               </div>

//               {/* Price */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Price (₹)
//                 </label>
//                 <input
//                   type="number"
//                   name="productPrice"
//                   value={formik.values.productPrice}
//                   onChange={formik.handleChange}
//                   className="w-full border p-2 rounded"
//                 />
//                 {formik.touched.productPrice && formik.errors.productPrice && (
//                   <p className="text-red-500 text-sm">
//                     {formik.errors.productPrice}
//                   </p>
//                 )}
//               </div>

//               {/* Category */}
//               <div className="pt-6">
//                 <Dropdown menu={menuProps}>
//                   <Button className="w-40">
//                     <Space>
//                       {categories.find(
//                         (cat) => cat._id === formik.values.productCategory
//                       )?.categoryName || "Select Category"}
//                       <DownOutlined />
//                     </Space>
//                   </Button>
//                 </Dropdown>
//                 {formik.touched.productCategory &&
//                   formik.errors.productCategory && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {formik.errors.productCategory}
//                     </p>
//                   )}
//               </div>

//               {/* Image */}
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Product Image (URL)
//                 </label>
//                 <input
//                   type="text"
//                   name="productImage"
//                   value={formik.values.productImage}
//                   onChange={formik.handleChange}
//                   className="w-full border p-2 rounded"
//                 />
//                 {formik.touched.productImage && formik.errors.productImage && (
//                   <p className="text-red-500 text-sm">
//                     {formik.errors.productImage}
//                   </p>
//                 )}
//               </div>
//             </div>

//             <div className="mt-6 flex justify-end">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//               >
//                 {loading ? "Adding..." : "Add Product"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddProductPage;
