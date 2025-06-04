// src/components/DeliveryBoy/Navbar.jsx
import React from "react";
import { CheckCircle, XCircle, Menu, X } from "lucide-react";
import logo from "../../assets/remove.png";
import { useDispatch } from "react-redux";
import { UpdateDeliveryBoyStatus } from "../../redux/slices/deliverySlice";

const Navbar = ({
  user,
  activeStatus,
  toggleActiveStatus,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const dispatch = useDispatch();
  const handleStatus = async (status) => {
    console.log("user._id", user._id);
    console.log("status", status);
    const result = await dispatch(
      UpdateDeliveryBoyStatus({ deliveryId: user._id, status })
    );

    console.log("Status changed to:", status);
    // Dispatch the action to update the status
  };
  return (
    <nav className="px-8 py-2 flex justify-between items-center bg-white shadow-sm">
      <div className="flex items-center">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden"
        >
          {sidebarOpen ? (
            <X className="h-6 w-6 text-green-600" />
          ) : (
            <Menu className="h-6 w-6 text-green-600" />
          )}
        </button>
        <img src={logo} alt="Logo" className="h-12 ml-6" />
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <span className="text-gray-700 mr-2">
            Welcome,{" "}
            <span className="font-medium">
              {user?.fullname || "Delivery Partner"}
            </span>
          </span>
        )}
        <span className="px-3 py-2 rounded-full text-sm bg-green-100 text-green-800 shadow-md">
          Delivery Partner
        </span>
        <div
          className={`px-3 py-2 rounded-full text-sm flex items-center gap-2 ${
            activeStatus
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          } cursor-pointer`}
          onClick={() => {
            const newStatus = activeStatus ? "inactive" : "active";
            handleStatus(newStatus); // send to backend
            toggleActiveStatus(); // toggle local state
          }}
        >
          {activeStatus ? (
            <>
              <CheckCircle className="h-4 w-4" />
              <span>Active</span>
            </>
          ) : (
            <>
              <XCircle className="h-4 w-4" />
              <span>Inactive</span>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
