import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/remove.png";
import { Menu, X, ArrowLeft } from "lucide-react";

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

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
          <span className="text-gray-700 mr-2">
            Welcome, <span className="font-medium">Super Admin</span>
          </span>
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
            <div>
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
                  onClick={() => navigate("/login")}
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
            <h2 className="text-2xl font-semibold text-emerald-900 mb-4 font-mono">
              Dashboard Content
            </h2>
            <div className="p-6 border border-dashed border-emerald-300 rounded text-center text-emerald-600">
              Select a menu option to view content.
            </div>
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

export default SuperAdminDashboard;
