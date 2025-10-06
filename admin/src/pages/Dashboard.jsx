// Updated AdminDashboard.jsx (renamed conceptually to AdminLayout, but keeping file name as AdminDashboard for continuity; it now serves as the layout with Outlet)
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom"; // Added Outlet
import { logout, getProfile } from "../redux/slices/authSlice";
import { io } from "socket.io-client";
import { fetchCategories } from "../redux/slices/ProductSlice"; // Removed fetchProducts since not used globally
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import Layout from "../components/Layout";


const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [socket, setSocket] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orderPopupData, setOrderPopupData] = useState(null);
  const navbarRef = useRef(null);
  const footerRef = useRef(null);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);

  useEffect(() => {
    const updateHeights = () => {
      if (navbarRef.current) setNavbarHeight(navbarRef.current.clientHeight);
      if (footerRef.current) setFooterHeight(footerRef.current.clientHeight);
    };
    updateHeights();
    window.addEventListener("resize", updateHeights);
    return () => window.removeEventListener("resize", updateHeights);
  }, []);

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
    if (socket && user?._id) {
      socket.emit("join", user._id);
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
            shopkeeperId: [user._id],
          };
          handleShowOrderPopup(filteredData);
        }
      });

      return () => {
        socket.off("receiveOrderRequest");
      };
    }
  }, [socket, user]);

  useEffect(() => {
    dispatch(fetchCategories()); // Fetch categories on mount for global use (assumed in Redux)
  }, [dispatch]);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login");
  };

  const handleShowOrderPopup = (data) => {
    setOrderPopupData(data);
  };

  return (
    <Layout>
      <Navbar
        ref={navbarRef}
        user={user}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div
        className="flex overflow-hidden pt-15"
        style={{
          height: `calc(110vh - ${navbarHeight}px - ${footerHeight}px)`,
        }}
      >
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          handleLogout={handleLogout}
          navbarHeight={navbarHeight}
          footerHeight={footerHeight}
        />
        {sidebarOpen && (
          <div
            style={{
              top: `${navbarHeight}px`,
              height: `calc(100vh - ${navbarHeight}px - ${footerHeight}px)`,
            }}
            className="fixed inset-x-0 bg-black/30 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-emerald-50">
          <div className="bg-white rounded-lg shadow p-6 h-full overflow-auto">
            <Outlet />
          </div>
        </main>
      </div>
      <footer
        ref={footerRef}
        className="fixed bottom-0 left-0 w-full bg-green-100 shadow-md p-4 z-40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600 text-sm">
          &copy; {new Date().getFullYear()} GroFast. All rights reserved.
        </div>
      </footer>
    </Layout>
  );
};

export default AdminDashboard;
