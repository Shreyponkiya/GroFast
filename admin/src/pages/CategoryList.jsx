import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCategories } from "../redux/slices/Listing";
import { Eye, Pencil, Trash2 } from "lucide-react";

const CategoryList = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector(
    (state) => state.listing || {}
  );

  const CategoryList = categories?.data?.categories || [];

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  if (loading)
    return <div className="p-4 text-green-700">Loading categories...</div>;
  if (error)
    return <div className="p-4 text-red-500">Failed to load categories.</div>;

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      <h1 className="text-2xl font-bold text-center text-green-800 mb-6">
        Category List
      </h1>

      <div className="overflow-x-auto shadow-md rounded-lg border border-green-200">
        <table className="min-w-full text-sm text-center text-green-900">
          <thead className="bg-green-200 text-green-800 uppercase text-sm font-semibold">
            <tr>
              <th className="px-4 py-3 border border-green-300">#</th>
              <th className="px-4 py-3 border border-green-300">
                Category Code
              </th>
              <th className="px-4 py-3 border border-green-300">
                Category Name
              </th>
              <th className="px-4 py-3 border border-green-300">
                Description
              </th>
              <th className="px-4 py-3 border border-green-300">Status</th>
              <th className="px-4 py-3 border border-green-300">Actions</th>
            </tr>
          </thead>

          <tbody>
            {CategoryList && CategoryList.length > 0 ? (
              CategoryList.map((cat, i) => (
                <tr
                  key={cat._id}
                  className={`${
                    i % 2 === 0 ? "bg-green-100" : "bg-green-50"
                  } hover:bg-green-200 transition`}
                >
                  <td className="px-4 py-2 border border-green-200">
                    {i + 1}
                  </td>
                  <td className="px-4 py-2 border border-green-200">
                    {cat.categoryCode}
                  </td>
                  <td className="px-4 py-2 border border-green-200">
                    {cat.categoryName}
                  </td>
                  <td className="px-4 py-2 border border-green-200">
                    {cat.categoryDescription}
                  </td>
                  <td className="px-4 py-2 border border-green-200">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        cat.isActive
                          ? "bg-green-100 text-green-700 border border-green-400"
                          : "bg-red-100 text-red-700 border border-red-400"
                      }`}
                    >
                      {cat.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-4 py-2 border border-green-200 flex justify-center gap-2">
                    {/* 👁 View */}
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-md transition flex items-center justify-center"
                      title="View"
                    >
                      <Eye size={16} />
                    </button>

                    {/* ✏️ Edit */}
                    <button
                      className="bg-yellow-400 hover:bg-yellow-500 text-black p-2 rounded-md transition flex items-center justify-center"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>

                    {/* 🗑 Delete */}
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition flex items-center justify-center"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-4 py-4 text-gray-600 bg-green-50 border border-green-200"
                >
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryList;
