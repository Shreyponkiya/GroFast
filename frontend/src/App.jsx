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
import UserDashboard from "./pages/Customer/UserDashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import DeliveryDashboard from "./pages/Delivery/DeliveryDashboard";
import AddProductPage from "./components/Admin/AddProductPage";
import Payment from "./pages/Customer/Payment";
import Order from "./pages/Customer/Order";
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
              path="/user/dashboard"
              element={
                <PrivateRoute allowedRoles={["user"]}>
                  <UserDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/user/payment/:OrderId"
              element={
                <PrivateRoute allowedRoles={["user"]}>
                  <Payment />
                </PrivateRoute>
              }
            />
            <Route
              path="/user/order/:placeOrderId"
              element={
                <PrivateRoute allowedRoles={["user"]}>
                  <Order />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/add-product"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <AddProductPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/delivery/dashboard"
              element={
                <PrivateRoute allowedRoles={["deliveryBoy"]}>
                  <DeliveryDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/superadmin/dashboard"
              element={
                <PrivateRoute allowedRoles={["superadmin"]}>
                  <DeliveryDashboard />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
