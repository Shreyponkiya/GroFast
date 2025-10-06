  import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import AddCategories from './AddCategories';
import { useNavigate, useLocation } from "react-router-dom";
import { logout, getProfile } from "../../redux/slices/authSlice";
import { io } from "socket.io-client";
import AddProduct from "../../components/Admin/AddProductPage";
import AddCategories from "../../components/Admin/AddCategories";
import ShowAdminProduct from "../../components/Admin/ShowAdminProduct";
import MessageComponent from "../../components/Admin/MessageComponent";
import { Card } from "antd";
import {
  fetchProducts,
  fetchCategories,
  addProduct,
  addCategory,
  fetchProductsByUserId,
} from "../../redux/slices/ProductSlice";

import logo from "../../assets/remove.png";
import { Menu, X, ArrowLeft } from "lucide-react"; // Using Lucide icons

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [socket, setSocket] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState(null);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [categoryies, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [orderProducts, setOrderProducts] = useState([]);
  const [orderPopupData, setOrderPopupData] = useState(null);
  useEffect(() => {
    const newSocket = io("http://localhost:8000");
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    // Check if there's state passed from navigation
    if (location.state) {
      if (location.state.view) {
        setCurrentView(location.state.view);
      }
      if (location.state.selectedCategory) {
        setSelectedCategory(location.state.selectedCategory);
      }
    }
  }, [location]);
  useEffect(() => {
    if (socket && user?._id) {
      console.log("User data:", user);
      socket.emit("join", user._id);
      console.log("Socket connected:", socket.id);

      socket.on("receiveOrderRequest", (data) => {
        const relevantProducts = data.products.filter((productObj) => {
          const createdById = productObj.productId?.createdBy?._id;
          return (
            data.shopkeeperId.includes(createdById) && createdById === user._id
          );
        });

        if (relevantProducts.length > 0) {
          const filteredData = {
            ...data,
            products: relevantProducts,
            shopkeeperId: [user._id], // ✅ Only this shopkeeper
          };
          console.log("Filtered data:", filteredData);

          // Now pass only relevant data to popup/component
          handleShowOrderPopup(filteredData);
        }
      });

      return () => {
        socket.off("receiveOrderRequest");
      };
    }
  }, [socket, user]);

  useEffect(() => {
    const fetchProducts = async () => {
      const results = {};

      for (const category of categoryies) {
        const products = await handleGetProducts({
          categoryId: category._id,
          userId: user._id,
        });
        results[category._id] = products;
      }
      console.log("Products fetched:", results);

      setProductsByCategory(results);
    };

    if (categoryies.length > 0 && user?.__id) {
      fetchProducts();
    }
  }, [categoryies, user]);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login");
  };

  useEffect(() => {
    handleCategorySubmit();
  }, []);

  const handleShowOrderPopup = (data) => {
  setOrderPopupData(data);
};

  const handleCategorySubmit = async (e) => {
    const data = await dispatch(fetchCategories());
    setCategories(data.payload.categories);
  };

  const handleGetProducts = async (categoryId, userId) => {
    const data = await dispatch(fetchProducts({ categoryId, userId }));
    return data.payload.products;
  };

  // Function to go back to main dashboard
  const goBackToDashboard = () => {
    setCurrentView(null);
    setSelectedCategory(null);
    navigate("/admin/dashboard", { replace: true });
  };

  return (
    <div className="min-h-screen bg-emerald-50">
      {/* Navbar */}
      <nav className="px-8 py-2 flex justify-between items-center bg-white shadow-sm">
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden"
          >
            {sidebarOpen ? (
              <X className="h-6 w-6 text-emerald-600" />
            ) : (
              <Menu className="h-6 w-6 text-emerald-600" />
            )}
          </button>
          <img src={logo} alt="Logo" className="h-12 ml-6" />
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <span className="text-gray-700 mr-2">
              Welcome, <span className="font-medium">{user.fullname}</span>
            </span>
          )}
          <span className="px-3 py-2 rounded-full text-sm bg-emerald-100 text-emerald-800 shadow-md">
            Shopkeeper
          </span>
        </div>
      </nav>

      {/* Dashboard Layout */}
      <div className="flex mt-3 ml-3">
        {/* Sidebar */}
        {sidebarOpen && (
          <div className="flex flex-col justify-between w-64 h-[calc(100vh-151px)] bg-gradient-to-tl from-green-200 to-green-400 p-5 shadow-md rounded-lg">
            {/* Top Section */}
            <div className="">
              <h2 className="text-2xl font-semibold text-emerald-900 mb-4 font-mono">
                Dashboard Menu
              </h2>
              <ul className="space-y-2 font-serif">
                {currentView !== null && (
                  <li
                    className="p-2 rounded-md bg-emerald-50 hover:bg-emerald-100 cursor-pointer pl-5"
                    onClick={goBackToDashboard}
                  >
                    <div className="flex items-center">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Go to Dashboard
                    </div>
                  </li>
                )}
                <li
                  className={`p-2 rounded-md ${
                    currentView === "showadminproduct"
                      ? "bg-emerald-200"
                      : "bg-emerald-50 hover:bg-emerald-100"
                  } cursor-pointer pl-5`}
                  onClick={() => setCurrentView("showadminproduct")}
                >
                  Show Products
                </li>
                <li
                  className={`p-2 rounded-md ${
                    currentView === "addProduct"
                      ? "bg-emerald-200"
                      : "bg-emerald-50 hover:bg-emerald-100"
                  } cursor-pointer pl-5`}
                  onClick={() => {
                    setCurrentView("addProduct");
                    setSelectedCategory(null);
                  }}
                >
                  Add New Product
                </li>
                <li
                  className={`p-2 rounded-md ${
                    currentView === "manageCategories"
                      ? "bg-emerald-200"
                      : "bg-emerald-50 hover:bg-emerald-100"
                  } cursor-pointer pl-5`}
                  onClick={() => setCurrentView("manageCategories")}
                >
                  Manage Categories
                </li>
                <li className="p-2 rounded-md bg-emerald-50 hover:bg-emerald-100 cursor-pointer pl-5">
                  View Inventory
                </li>
              </ul>
            </div>

            {/* Bottom Section */}
            <div>
              <ul className="space-y-2 font-serif">
                <li className="p-2 rounded-md bg-emerald-50 hover:bg-emerald-100 cursor-pointer pl-5">
                  Settings
                </li>
                <li
                  className="p-2 rounded-md bg-emerald-50 hover:bg-emerald-100 cursor-pointer pl-5"
                  onClick={handleLogout}
                >
                  Logout
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 pl-6">
          <div className="bg-white rounded-lg shadow p-6 h-[calc(100vh-140px)] overflow-auto">
            <div>
              <h2 className="text-2xl font-semibold text-emerald-900 mb-4 font-mono">
                Customer Request
              </h2>
              <div>
                {orderPopupData && <MessageComponent msg={orderPopupData} />}
              </div>
            </div>

            {/* Conditional views */} 
            {currentView === "manageCategories" && <AddCategories />}
            {currentView === "showadminproduct" && <ShowAdminProduct />}
            {currentView === "addProduct" && (
              <>
                {selectedCategory && (
                  <div className="mb-4 p-3 bg-emerald-50 border-l-4 border-emerald-500 rounded">
                    <div className="flex justify-between items-center">
                      <p className="text-emerald-800">
                        Adding product to{" "}
                        <span className="font-medium">
                          {selectedCategory.name}
                        </span>{" "}
                        category
                      </p>
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className="text-xs text-emerald-600 hover:text-emerald-800"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                )}
                <AddProduct selectedCategory={selectedCategory} />
              </>
            )}
          </div>
        </div>
      </div>
      {/* footer */}
      <div className="flex-1 mt-4">
        <footer className="bg-green-100 shadow-md mt-4 p-4 rounded-lg">
          <div className="text-center text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} GroFast. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminDashboard;