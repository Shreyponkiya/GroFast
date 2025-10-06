import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchDashboardStats } from "../redux/slices/Listing";

const SuperAdmin = () => {
  const dispatch = useDispatch();
  const { dashboardStats, loading, error } = useSelector(
    (state) => state.listing || {}
  );

  console.log("Dashboard Stats:", dashboardStats);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (loading) return <div className="p-4">Loading dashboard data...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  // Extract stats safely
  const stats = dashboardStats?.data?.stats || {};

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-green-100 p-4 rounded shadow text-center">
        <h2 className="text-lg font-bold">Total Shopkeepers</h2>
        <p className="text-2xl">{stats.shopkeepers || 0}</p>
      </div>
      <div className="bg-blue-100 p-4 rounded shadow text-center">
        <h2 className="text-lg font-bold">Total Delivery Boys</h2>
        <p className="text-2xl">{stats.deliveryBoys || 0}</p>
      </div>
      <div className="bg-yellow-100 p-4 rounded shadow text-center">
        <h2 className="text-lg font-bold">Total Products</h2>
        <p className="text-2xl">{stats.products || 0}</p>
      </div>
      <div className="bg-red-100 p-4 rounded shadow text-center">
        <h2 className="text-lg font-bold">Total Categories</h2>
        <p className="text-2xl">{stats.categories || 0}</p>
      </div>
    </div>
  );
};

export default SuperAdmin;
