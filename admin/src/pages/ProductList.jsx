import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../redux/slices/Listing";
import { Eye, Pencil, Trash2 } from "lucide-react"; // 👈 Importing Lucide icons

const ProductList = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(
    (state) => state.listing || {}
  );

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const ProductList = products?.data?.products || [];

  if (loading)
    return <div className="p-4 text-green-700">Loading products...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      <h1 className="text-2xl font-bold text-center text-green-800 mb-6">
        Product List
      </h1>

      <div className="overflow-x-auto shadow-md rounded-lg border border-green-200">
        <table className="min-w-full text-sm text-center text-green-900">
          <thead className="bg-green-200 text-green-800 uppercase text-sm font-semibold">
            <tr>
              <th className="px-4 py-3 border border-green-300">#</th>
              <th className="px-4 py-3 border border-green-300">
                Product Code
              </th>
              <th className="px-4 py-3 border border-green-300">Name</th>
              <th className="px-4 py-3 border border-green-300">Price (₹)</th>
              <th className="px-4 py-3 border border-green-300">Quantity</th>
              <th className="px-4 py-3 border border-green-300">Category ID</th>
              <th className="px-4 py-3 border border-green-300">Created By</th>
              <th className="px-4 py-3 border border-green-300">Actions</th>
            </tr>
          </thead>

          <tbody>
            {ProductList && ProductList.length > 0 ? (
              ProductList.map((p, i) => (
                <tr
                  key={p._id}
                  className={`${
                    i % 2 === 0 ? "bg-green-100" : "bg-green-50"
                  } hover:bg-green-200 transition`}
                >
                  <td className="px-4 py-2 border border-green-200">{i + 1}</td>
                  <td className="px-4 py-2 border border-green-200">
                    {p.productCode}
                  </td>
                  <td className="px-4 py-2 border border-green-200">
                    {p.productName}
                  </td>
                  <td className="px-4 py-2 border border-green-200">
                    {p.productPrice}
                  </td>
                  <td className="px-4 py-2 border border-green-200">
                    {p.productQuantity}
                  </td>
                  <td className="px-4 py-2 border border-green-200">
                    {p.productCategory}
                  </td>
                  <td className="px-4 py-2 border border-green-200">
                    {p.createdBy?.email || "N/A"}
                  </td>
                  <td className="px-4 py-2 border border-green-200 flex justify-center gap-2">
                    {/* ✅ View Button */}
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-md transition flex items-center justify-center"
                      title="View"
                    >
                      <Eye size={16} />
                    </button>

                    {/* ✅ Edit Button */}
                    <button
                      className="bg-yellow-400 hover:bg-yellow-500 text-black p-2 rounded-md transition flex items-center justify-center"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>

                    {/* ✅ Delete Button */}
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
                  colSpan="8"
                  className="px-4 py-4 text-gray-600 bg-green-50 border border-green-200"
                >
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
