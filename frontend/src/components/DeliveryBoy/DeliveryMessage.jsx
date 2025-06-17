import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const DeliveryMessage = ({ deliveryBoyId, deliveryBoyName }) => {
  const [socket, setSocket] = useState(null);
  const [deliveryAssignments, setDeliveryAssignments] = useState([]);
  const [activeDeliveries, setActiveDeliveries] = useState([]);

  useEffect(() => {
    const newSocket = io("http://localhost:8000");
    setSocket(newSocket);

    // Join as delivery boy
    newSocket.emit("joinAsDeliveryBoy", deliveryBoyId);

    // Listen for new delivery assignments
    newSocket.on("newDeliveryAssignment", (data) => {
      console.log("New delivery assignment received:", data);
      setDeliveryAssignments(prev => [...prev, {
        id: Date.now(),
        ...data,
        status: "pending"
      }]);
    });

    // Listen for delivery notifications
    newSocket.on("deliveryNotification", (data) => {
      console.log("Delivery notification received:", data);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [deliveryBoyId]);

  const acceptDelivery = (assignment) => {
    if (socket) {
      socket.emit("acceptDelivery", {
        orderId: assignment.orderId,
        customerId: assignment.customerId,
        shopkeeperId: assignment.shopkeeperId,
        deliveryBoyId: deliveryBoyId,
        deliveryBoyName: deliveryBoyName,
        deliveryBoyPhone: "9876543210", // Replace with actual phone
        timestamp: new Date().toISOString()
      });

      // Move to active deliveries
      setActiveDeliveries(prev => [...prev, { ...assignment, status: "accepted" }]);
      
      // Remove from pending assignments
      setDeliveryAssignments(prev => 
        prev.filter(item => item.orderId !== assignment.orderId)
      );
    }
  };

  const rejectDelivery = (assignment, reason = "Not available") => {
    if (socket) {
      socket.emit("rejectDelivery", {
        orderId: assignment.orderId,
        shopkeeperId: assignment.shopkeeperId,
        deliveryBoyId: deliveryBoyId,
        reason: reason,
        timestamp: new Date().toISOString()
      });

      // Remove from pending assignments
      setDeliveryAssignments(prev => 
        prev.filter(item => item.orderId !== assignment.orderId)
      );
    }
  };

  const updateLocation = (orderId, location) => {
    if (socket) {
      socket.emit("location", {
        orderId: orderId,
        customerId: activeDeliveries.find(d => d.orderId === orderId)?.customerId,
        location: location,
        deliveryBoyId: deliveryBoyId,
        timestamp: new Date().toISOString()
      });
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800">
            Delivery Dashboard - {deliveryBoyName}
          </h1>
          <p className="text-sm text-gray-600">ID: {deliveryBoyId}</p>
        </div>
      </div>

      {/* Pending Delivery Assignments */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            New Delivery Assignments ({deliveryAssignments.length})
          </h2>
        </div>
        
        <div className="p-4">
          {deliveryAssignments.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No new assignments</p>
          ) : (
            deliveryAssignments.map((assignment) => (
              <div key={assignment.id} className="border border-orange-200 rounded-lg p-4 mb-4 bg-orange-50">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Order #{assignment.orderId}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Customer: {assignment.customerId}
                    </p>
                    <p className="text-sm text-gray-600">
                      Time: {formatDate(assignment.timestamp)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                      NEW
                    </span>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-sm text-gray-700 mb-1">
                    <strong>Address:</strong> {assignment.customerAddress}
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    <strong>Phone:</strong> {assignment.customerPhone}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Estimated Time:</strong> {assignment.estimatedTime}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => acceptDelivery(assignment)}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 font-medium transition-colors"
                  >
                    Accept Delivery
                  </button>
                  <button
                    onClick={() => rejectDelivery(assignment)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 font-medium transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Active Deliveries */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Active Deliveries ({activeDeliveries.length})
          </h2>
        </div>
        
        <div className="p-4">
          {activeDeliveries.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No active deliveries</p>
          ) : (
            activeDeliveries.map((delivery) => (
              <div key={delivery.orderId} className="border border-blue-200 rounded-lg p-4 mb-4 bg-blue-50">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Order #{delivery.orderId}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Customer: {delivery.customerId}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      IN PROGRESS
                    </span>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-sm text-gray-700 mb-1">
                    <strong>Address:</strong> {delivery.customerAddress}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Phone:</strong> {delivery.customerPhone}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => updateLocation(delivery.orderId, { lat: 23.0225, lng: 72.5714 })}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium transition-colors"
                  >
                    Update Location
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 font-medium transition-colors"
                  >
                    Mark Delivered
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryMessage;