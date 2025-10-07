import React, { useState, useEffect } from "react";
import axios from "axios"; // Using axios to call backend
import { useDispatch } from "react-redux";
import { fetchCategories } from "../../redux/slices/ProductSlice";
import CommonTable from "../common/CommonTable";
import Pagination from "../common/Pagination";
import { X } from "lucide-react";

const CategoriesList = () => {
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(2); // match your payload
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    categoryCode: "",
    categoryName: "",
    categoryDescription: "",
    isActive: true,
  });

  // ----- Fetch categories from backend -----
  const fetchCategoriesData = async (page = 1, limit = itemsPerPage) => {
    setLoading(true);
    try {
      const res = await dispatch(fetchCategories({ page, limit }));
      const payload = res.data;
      console.log("Fetched categories:", payload);
      setCategories(payload.data || []);
      setCurrentPage(payload.currentPage);
      setItemsPerPage(payload.itemsPerPage);
      setTotalPages(payload.totalPages);
      setTotalItems(payload.totalItems);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoriesData(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]);

  // ----- Table columns -----
  const columns = [
    { header: "Code", accessor: "categoryCode" },
    { header: "Name", accessor: "categoryName" },
    { header: "Description", accessor: "categoryDescription" },
    {
      header: "Active",
      render: (item) => (item.isActive ? "Yes" : "No"),
    },
  ];

  // ----- Modal handlers -----
  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({
      categoryCode: "",
      categoryName: "",
      categoryDescription: "",
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setFormData({
      categoryCode: category.categoryCode,
      categoryName: category.categoryName,
      categoryDescription: category.categoryDescription,
      isActive: category.isActive,
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => setModalOpen(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await axios.put(`/api/categories/${editingCategory._id}`, formData);
      } else {
        await axios.post(`/api/categories`, formData);
      }
      fetchCategoriesData(currentPage, itemsPerPage);
      setModalOpen(false);
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleDelete = async (category) => {
    try {
      await axios.delete(`/api/categories/${category._id}`);
      fetchCategoriesData(currentPage, itemsPerPage);
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="rounded-lg border-gray-200 p-6 bg-white shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Categories List
            </h2>
            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Add Category
            </button>
          </div>

          <CommonTable
            columns={columns}
            data={categories}
            loading={loading}
            showActions={true}
            onView={(cat) => console.log("View:", cat)}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        </div>
      </div>

      {/* ----- Modal ----- */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              onClick={handleCloseModal}
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-semibold mb-4">
              {editingCategory ? "Edit Category" : "Add Category"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700">Category Code</label>
                <input
                  type="text"
                  name="categoryCode"
                  value={formData.categoryCode}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Category Name</label>
                <input
                  type="text"
                  name="categoryName"
                  value={formData.categoryName}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Description</label>
                <textarea
                  name="categoryDescription"
                  value={formData.categoryDescription}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                <span>Active</span>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {editingCategory ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesList;
