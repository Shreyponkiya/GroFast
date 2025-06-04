// src/pages/DeliveryBoy/DeliveryBoyDashboard.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { logout, getProfile } from "../../redux/slices/authSlice";
import { io } from "socket.io-client";

// Import components
import Navbar from "../../components/DeliveryBoy/Navbar";
import Sidebar from "../../components/DeliveryBoy/Sidebar";
import MainContent from "../../components/DeliveryBoy/MainContent";

const DeliveryBoyDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [socket, setSocket] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState(null);
  const [deliveryRequests, setDeliveryRequests] = useState([]);
  const [msg, setMsg] = useState(null);
  const [activeStatus, setActiveStatus] = useState(true);
  const [pendingDeliveries, setPendingDeliveries] = useState([
    {
      id: "DEL-001",
      customerName: "Amit Sharma",
      address: "123 Green Road, Mumbai",
      items: 3,
      status: "Ready for pickup"
    },
    {
      id: "DEL-002",
      customerName: "Priya Patel",
      address: "45 green Street, Delhi",
      items: 1,
      status: "In transit"
    }
  ]);
  
  const [completedDeliveries, setCompletedDeliveries] = useState([
    {
      id: "DEL-000",
      customerName: "Rahul Kumar",
      address: "789 Yellow Lane, Bangalore",
      items: 2,
      status: "Delivered",
      deliveredAt: "2025-05-19T15:30:00"
    }
  ]);

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
    }
  }, [location]);
  
  useEffect(() => {
    if (socket && user?._id) {
      console.log("User data:", user);
      socket.emit("join", user._id);
      console.log("Socket connected:", socket.id);

      socket.on("receiveDeliveryRequest", (data) => {
        console.log("New delivery request received:", data);
        setDeliveryRequests(prev => [...prev, data]);
      });

      return () => {
        socket.off("receiveDeliveryRequest");
      };
    }
  }, [socket, user]);

  // Function to toggle active status
  const toggleActiveStatus = () => {
    setActiveStatus(!activeStatus);
    
    // Emit status change to server
    if (socket && user?._id) {
      socket.emit("deliveryBoyStatusChange", {
        deliveryBoyId: user._id,
        status: !activeStatus ? "active" : "inactive"
      });
    }
  };

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login");
  };

  // Function to go back to main dashboard
  const goBackToDashboard = () => {
    setCurrentView(null);
    navigate("/delivery/dashboard", { replace: true });
  };

  const acceptDelivery = (requestId) => {
    // Logic to accept delivery
    console.log("Accepting delivery:", requestId);
    
    // Update UI and notify server
    if (socket) {
      socket.emit("acceptDelivery", {
        deliveryBoyId: user._id,
        requestId: requestId
      });
    }
  };

  const completeDelivery = (deliveryId) => {
    // Move delivery from pending to completed
    const delivery = pendingDeliveries.find(d => d.id === deliveryId);
    if (delivery) {
      const updatedDelivery = {
        ...delivery,
        status: "Delivered",
        deliveredAt: new Date().toISOString()
      };
      
      setPendingDeliveries(pendingDeliveries.filter(d => d.id !== deliveryId));
      setCompletedDeliveries([updatedDelivery, ...completedDeliveries]);
      
      // Notify server
      if (socket) {
        socket.emit("deliveryCompleted", {
          deliveryBoyId: user._id,
          deliveryId: deliveryId
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-green-50">
      {/* Navbar Component */}
      <Navbar 
        user={user}
        activeStatus={activeStatus}
        toggleActiveStatus={toggleActiveStatus}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Dashboard Layout */}
      <div className="flex mt-3 ml-3">
        {/* Sidebar Component */}
        {sidebarOpen && (
          <Sidebar 
            currentView={currentView}
            setCurrentView={setCurrentView}
            goBackToDashboard={goBackToDashboard}
            handleLogout={handleLogout}
          />
        )}

        {/* Main Content Component */}
        <MainContent 
          currentView={currentView}
          pendingDeliveries={pendingDeliveries}
          completedDeliveries={completedDeliveries}
          deliveryRequests={deliveryRequests}
          user={user}
          msg={msg}
          acceptDelivery={acceptDelivery}
          completeDelivery={completeDelivery}
          activeStatus={activeStatus}
          toggleActiveStatus={toggleActiveStatus}
        />
      </div>

      {/* Footer */}
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

export default DeliveryBoyDashboard;