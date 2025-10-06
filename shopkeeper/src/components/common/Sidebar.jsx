import React from "react";
import { NavLink, useNavigate } from "react-router-dom"; // Added NavLink and useNavigate
import { ArrowLeft, Box, PlusCircle, List, Settings, LogOut } from "lucide-react";

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  handleLogout,
  navbarHeight,
  footerHeight,
}) => {
  const navigate = useNavigate(); // For programmatic navigation, e.g., back to dashboard

  const goBackToDashboard = () => {
    navigate("/admin/dashboard");
    setSidebarOpen(false); // Close sidebar on mobile after navigation
  };

  return (
    <div
      style={{ top: `${navbarHeight}px`, bottom: `${footerHeight}px` }}
      className={`fixed left-0 z-30 w-64 bg-gradient-to-tl from-green-200 to-green-400 p-5 shadow-md rounded-lg transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 lg:static lg:inset-auto lg:rounded-lg flex flex-col justify-between overflow-y-auto`}
    >
      {/* Top Section */}
      <div>
        <h2 className="text-2xl font-semibold text-emerald-900 mb-4 font-mono">
          Dashboard Menu
        </h2>
        <ul className="space-y-2 font-serif">
          <li
            className="p-2 rounded-md bg-emerald-50 hover:bg-emerald-100 cursor-pointer flex items-center pl-3"
            onClick={goBackToDashboard}
          >
            <ArrowLeft className="h-5 w-5 text-emerald-800 mr-2" />
            Go to Dashboard
          </li>
          <li>
            <NavLink
              to="/admin/product-list"
              className={({ isActive }) =>
                `p-2 rounded-md flex items-center pl-3 ${
                  isActive ? "bg-emerald-200" : "bg-emerald-50 hover:bg-emerald-100"
                }`
              }
              onClick={() => setSidebarOpen(false)} // Close sidebar on mobile
            >
              <Box className="h-5 w-5 text-emerald-800 mr-2" />
              Product List
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/add-product"
              className={({ isActive }) =>
                `p-2 rounded-md flex items-center pl-3 ${
                  isActive ? "bg-emerald-200" : "bg-emerald-50 hover:bg-emerald-100"
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <PlusCircle className="h-5 w-5 text-emerald-800 mr-2" />
              Add New Product
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/manage-categories"
              className={({ isActive }) =>
                `p-2 rounded-md flex items-center pl-3 ${
                  isActive ? "bg-emerald-200" : "bg-emerald-50 hover:bg-emerald-100"
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <List className="h-5 w-5 text-emerald-800 mr-2" />
              Manage Categories
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/view-inventory"
              className={({ isActive }) =>
                `p-2 rounded-md flex items-center pl-3 ${
                  isActive ? "bg-emerald-200" : "bg-emerald-50 hover:bg-emerald-100"
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <Box className="h-5 w-5 text-emerald-800 mr-2" />
              View Inventory
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Bottom Section */}
      <div>
        <ul className="space-y-2 font-serif">
          <li
            className="p-2 rounded-md bg-emerald-50 hover:bg-emerald-100 cursor-pointer flex items-center pl-3"
          >
            <Settings className="h-5 w-5 text-emerald-800 mr-2" />
            Settings
          </li>
          <li
            className="p-2 rounded-md bg-emerald-50 hover:bg-emerald-100 cursor-pointer flex items-center pl-3"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 text-emerald-800 mr-2" />
            Logout
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;