// src/components/DeliveryBoy/Sidebar.jsx
import React from "react";
import { ArrowLeft, Package, CheckCircle, Map } from "lucide-react";

const Sidebar = ({ 
  currentView, 
  setCurrentView, 
  goBackToDashboard, 
  handleLogout 
}) => {
  return (
    <div className="flex flex-col justify-between w-64 h-[calc(100vh-151px)] bg-gradient-to-tl from-green-200 to-green-400 p-5 shadow-md rounded-lg">
      {/* Top Section */}
      <div className="">
        <h2 className="text-2xl font-semibold text-green-900 mb-4 font-mono">
          Delivery Dashboard
        </h2>
        <ul className="space-y-2 font-serif">
          {currentView !== null && (
            <li
              className="p-2 rounded-md bg-green-50 hover:bg-green-100 cursor-pointer pl-5"
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
              currentView === "pendingDeliveries"
                ? "bg-green-200"
                : "bg-green-50 hover:bg-green-100"
            } cursor-pointer pl-5 flex items-center`}
            onClick={() => setCurrentView("pendingDeliveries")}
          >
            <Package className="h-4 w-4 mr-2" />
            Pending Deliveries
          </li>
          <li
            className={`p-2 rounded-md ${
              currentView === "completedDeliveries"
                ? "bg-green-200"
                : "bg-green-50 hover:bg-green-100"
            } cursor-pointer pl-5 flex items-center`}
            onClick={() => setCurrentView("completedDeliveries")}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Completed Deliveries
          </li>
          <li
            className={`p-2 rounded-md ${
              currentView === "routeMap"
                ? "bg-green-200"
                : "bg-green-50 hover:bg-green-100"
            } cursor-pointer pl-5 flex items-center`}
            onClick={() => setCurrentView("routeMap")}
          >
            <Map className="h-4 w-4 mr-2" />
            Route Map
          </li>
        </ul>
      </div>

      {/* Bottom Section */}
      <div>
        <ul className="space-y-2 font-serif">
          <li className="p-2 rounded-md bg-green-50 hover:bg-green-100 cursor-pointer pl-5">
            Settings
          </li>
          <li
            className="p-2 rounded-md bg-green-50 hover:bg-green-100 cursor-pointer pl-5"
            onClick={handleLogout}
          >
            Logout
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;