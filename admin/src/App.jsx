import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Auth/Login";
import PrivateRoute from "./components/PrivateRoute";

// ✅ Layout (Admin Dashboard acts as Layout)
import Dashboard from "./pages/Dashboard";

// ✅ Admin pages (inside layout)
import SuperAdmin from "./pages/SuperAdmin";
import ProductList from "./pages/ProductList";
import CategoryList from "./pages/CategoryList";
import Shopkeeper from "./pages/Shopkeeper";
import DeliveryBoy from "./pages/DeliveryBoy";
import Message from "./pages/Message";

function App() {
  return (
    <Provider store={store}>
      <ToastContainer position="top-right" autoClose={5000} />
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes - Admin */}
            <Route
              path="/admin"
              element={
                <PrivateRoute allowedRoles={["superadmin"]}>
                  <Dashboard />
                </PrivateRoute>
              }
            >
              {/* Child Routes inside the Dashboard Layout */}
              <Route
                path="dashboard"
                element={
                  <PrivateRoute allowedRoles={["superadmin"]}>
                    <SuperAdmin />
                  </PrivateRoute>
                }
              />
              <Route path="products" element={<ProductList />} />
              <Route path="categories" element={<CategoryList />} />
              <Route path="shopkeepers" element={<Shopkeeper />} />
              <Route path="delivery-boys" element={<DeliveryBoy />} />
              <Route path="message" element={<Message />} />

              {/* Default redirect */}
              <Route
                index
                element={<Navigate to="/admin/dashboard" replace />}
              />
            </Route>

            {/* Default redirect to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
