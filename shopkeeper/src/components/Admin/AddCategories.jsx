import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "../../redux/slices/authSlice";
import { useFormik } from "formik";
import Validations from "../../SchmaValidations/Validations";
import { fetchCategories, addCategory } from "../../redux/slices/ProductSlice";
import { toast } from "react-hot-toast";

const AddCategories = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategoriesData = async () => {
      const data = await dispatch(fetchCategories());
      setCategories(data.payload.categories);
    };
    fetchCategoriesData();
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      categoryCode: "",
      categoryName: "",
      categoryDescription: "",
      isActive: true,
    },
    validationSchema: Validations.categorySchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {        
        const response = await dispatch(
          addCategory(values)
        );
        if (response.status === 201) {
          toast.success("Category added successfully!");
          resetForm();
        } else {
          toast.error("Failed to add category.");
        }
      } catch (error) {
        toast.error("An error occurred. Please try again.");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="rounded-lg border-gray-200 p-6 bg-white shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Add New Product
          </h2>
          <form onSubmit={formik.handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Code
                </label>
                <input
                  type="text"
                  name="categoryCode"
                  value={formik.values.categoryCode}
                  onChange={formik.handleChange}
                  className="w-full border p-2 rounded"
                />
                {formik.touched.categoryCode && formik.errors.categoryCode && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.categoryCode}
                  </p>
                )}
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  name="categoryName"
                  value={formik.values.categoryName}
                  onChange={formik.handleChange}
                  className="w-full border p-2 rounded"
                />
                {formik.touched.categoryName && formik.errors.categoryName && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.categoryName}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="categoryDescription"
                  value={formik.values.categoryDescription}
                  onChange={formik.handleChange}
                  rows="3"
                  className="w-full border p-2 rounded"
                />
                {formik.touched.categoryDescription &&
                  formik.errors.categoryDescription && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.categoryDescription}
                    </p>
                  )}
              </div>

              {/* Is Active */}
              <div className="md:col-span-2 flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formik.values.isActive}
                  onChange={formik.handleChange}
                  className="mr-2 h-5 w-5 accent-green-600 rounded"
                />
                <label className="text-xl font-medium text-gray-700">
                  Is Active
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                {loading ? "Adding..." : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCategories;
