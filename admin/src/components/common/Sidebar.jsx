import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Box,
  PlusCircle,
  List,
  Truck,
  MessageSquare,
  Settings,
  LogOut,
} from "lucide-react";

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  handleLogout,
  navbarHeight,
  footerHeight,
}) => {
  const navigate = useNavigate();

  const goBackToDashboard = () => {
    navigate("/admin/dashboard");
    setSidebarOpen(false);
  };

  const menuItems = [
    {
      to: "/admin/dashboard",
      icon: ArrowLeft,
      label: "Dashboard",
      action: goBackToDashboard,
    },
    { to: "/admin/products", icon: Box, label: "Product List" },
    { to: "/admin/categories", icon: Box, label: "Category List" },
    { to: "/admin/shopkeepers", icon: PlusCircle, label: "Shopkeeper List" },
    { to: "/admin/delivery-boys", icon: Truck, label: "Delivery Boys" },
    { to: "/admin/message", icon: MessageSquare, label: "Customer Requests" },
  ];

  return (
    <div
      style={{ top: `${navbarHeight}px`, bottom: `${footerHeight}px` }}
      className={`fixed left-0 z-30 w-65 bg-gradient-to-tl from-green-200 to-green-400 p-5 lg:pb-7 xl:pb-10 shadow-md rounded-lg transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 lg:static flex flex-col justify-between overflow-y-auto`}
    >
      {/* Top Section */}
      <div>
        <h2 className="text-2xl font-semibold text-emerald-900 mb-4 font-mono">
          Admin Panel
        </h2>
        <ul className="space-y-2 font-serif">
          {menuItems.map(({ to, icon: Icon, label, action }) => (
            <li key={to}>
              {action ? (
                <div
                  onClick={action}
                  className="p-2 rounded-md bg-emerald-50 hover:bg-emerald-100 cursor-pointer flex items-center pl-3"
                >
                  <Icon className="h-5 w-5 text-emerald-800 mr-2" />
                  {label}
                </div>
              ) : (
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `p-2 rounded-md flex items-center pl-3 ${
                      isActive
                        ? "bg-emerald-200"
                        : "bg-emerald-50 hover:bg-emerald-100"
                    }`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="h-5 w-5 text-emerald-800 mr-2" />
                  {label}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom Section */}
      <div>
        <ul className="space-y-2 font-serif">
          <li className="p-2 rounded-md bg-emerald-50 hover:bg-emerald-100 cursor-pointer flex items-center pl-3">
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
