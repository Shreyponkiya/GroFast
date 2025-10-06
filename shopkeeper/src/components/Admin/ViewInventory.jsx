// New file: src/components/Admin/ViewInventory.jsx (simple implementation to display inventory by category)
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories, fetchProducts } from "../../redux/slices/ProductSlice";

const ViewInventory = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const categories = useSelector((state) => state.product?.categories || []); // Assuming categories in Redux
  const [productsByCategory, setProductsByCategory] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      const results = {};
      for (const category of categories) {
        const { payload } = await dispatch(fetchProducts({ categoryId: category._id, userId: user?._id }));
        results[category._id] = payload?.products || [];
      }
      setProductsByCategory(results);
      setLoading(false);
    };

    if (categories.length > 0 && user?._id) {
      fetchInventory();
    }
  }, [categories, user, dispatch]);

  if (loading) {
    return <div className="text-center py-4">Loading inventory...</div>;
  }

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold text-emerald-900 mb-4 font-mono">View Inventory</h2>
      {Object.entries(productsByCategory).map(([catId, products]) => {
        const category = categories.find((cat) => cat._id === catId);
        return (
          <div key={catId} className="mb-6">
            <h3 className="text-xl font-medium text-emerald-800 mb-2">{category?.name || "Unknown Category"}</h3>
            {products.length === 0 ? (
              <p className="text-gray-600">No products in this category.</p>
            ) : (
              <ul className="list-disc pl-6">
                {products.map((product) => (
                  <li key={product._id} className="text-gray-800">
                    {product.name} - Quantity: {product.quantity || "N/A"} - Price: ${product.price || "N/A"}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ViewInventory;