// Updated app.jsx (added nested routes for admin sections)
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
// import UserDashboard from "./pages/Customer/UserDashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard"; // Now acts as AdminLayout
// import DeliveryDashboard from "./pages/Delivery/DeliveryDashboard";
import AddProduct from "./components/Admin/AddProductPage"; // Renamed import to match component
import EditProductPage from "./components/Admin/EditProductPage";
import AddCategories from "./components/Admin/AddCategories"; // Assuming this is ManageCategories
import ShowAdminProduct from "./components/Admin/ShowAdminProduct"; // Assuming this is ProductList
import ViewInventory from "./components/Admin/ViewInventory"; // New component, import the new file (code provided below)
// import Payment from "./pages/Customer/Payment";
// import Order from "./pages/Customer/Order";
// import AddCategories from './pages/AddCategories';
import PrivateRoute from "./components/PrivateRoute";
import { toast, ToastContainer } from "react-toastify";
import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <ToastContainer position="top-right" autoClose={5000} />
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/admin"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            >
              <Route
                path="dashboard"
                element={
                  <div className="text-center py-4">
                    <h2 className="text-xl font-semibold">
                      Welcome to Admin Dashboard
                    </h2>
                  </div>
                }
              />{" "}
              {/* Simple home content, aligned center */}
              <Route path="product-list" element={<ShowAdminProduct />} />{" "}
              {/* Product List route */}
              <Route path="add-product" element={<AddProduct />} />{" "}
              {/* Add Product route (category selection inside component) */}
              <Route
                path="/admin/edit-product/:id"
                element={<EditProductPage />}
              />{" "}
              {/* Edit Product route */}
              <Route
                path="manage-categories"
                element={<AddCategories />}
              />{" "}
              {/* Manage Categories route */}
              <Route path="view-inventory" element={<ViewInventory />} />{" "}
              {/* View Inventory route */}
              <Route
                index
                element={<Navigate to="/admin/dashboard" replace />}
              />
            </Route>
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;