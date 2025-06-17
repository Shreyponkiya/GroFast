import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const MessageComponent = ({ msg }) => {
  const [socket, setSocket] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:8000");
    setSocket(newSocket);

    // Join the shopkeeper's room
    newSocket.emit("join", "current_shopkeeper_id"); // Replace with actual shopkeeper ID

    // Listen for admin action confirmations
    newSocket.on("adminActionUpdate", (data) => {
      console.log("Admin action update:", data);
    });

    newSocket.on("messageSent", (data) => {
      console.log("Message sent confirmation:", data);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleApprove = (orderData) => {
    // When approving, send message to delivery boy
    socket.emit("approveOrder", {
      orderId: msg.orderDetailsId,
      customerId: msg.senderId,
      shopkeeperId: "current_shopkeeper_id", // Replace with actual shopkeeper ID
      deliveryBoyId: "delivery_boy_123", // Replace with actual delivery boy ID or leave null for broadcast
      customerAddress: msg.customerAddress || "Customer Address",
      customerPhone: msg.customerPhone || "Customer Phone",
      orderDetails: orderData,
      estimatedTime: "30 minutes",
      timestamp: new Date().toISOString()
    });
    
    setStatus("approved");
  };

  const handleReject = (orderData) => {
    // When rejecting, send message to customer
    socket.emit("rejectOrder", {
      orderId: msg.orderDetailsId,
      customerId: msg.senderId,
      shopkeeperId: "current_shopkeeper_id", // Replace with actual shopkeeper ID
      rejectionReason: "Sorry, item is out of stock", // You can make this dynamic
      timestamp: new Date().toISOString()
    });
    
    setStatus("rejected");
  };

  // Send custom message to customer
  const sendCustomMessage = (message) => {
    if (socket) {
      socket.emit("sendAdminMessage", {
        customerId: msg.senderId,
        orderId: msg.orderDetailsId,
        message: message,
        adminId: "current_shopkeeper_id" // Replace with actual shopkeeper ID
      });
    }
  };

  useEffect(() => {
    if (status === "approved") {
      console.log("Order approved");
      sendCustomMessage(`Your order ${msg.orderDetailsId} has been approved and is being processed.`);
    } else if (status === "rejected") {
      console.log("Order rejected");
      sendCustomMessage(`Your order ${msg.orderDetailsId} has been rejected. Please contact us for more details.`);
    }
  }, [status]);

  // Format timestamp to a readable date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 border-l-4 border-blue-500">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Order Request</h2>
        <span className="text-sm text-gray-500">
          {formatDate(msg.timestamp)}
        </span>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-1">
          Order ID: <span className="font-medium">{msg.orderDetailsId}</span>
        </p>
        <p className="text-sm text-gray-600">
          Customer ID: <span className="font-medium">{msg.senderId}</span>
        </p>
      </div>

      {msg.products.map((item, index) => (
        <div className="mb-6" key={index}>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Products</h3>
          <div className="bg-gray-50 rounded p-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center mr-3">
                  {item.productId.productImage ? (
                    <img
                      src={`${import.meta.env.VITE_BASE_URL}/uploads/${
                        item.productId.productImage
                      }`}
                      alt={item.productId.productName}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-400 text-xs">No img</span>
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    {item.productId.productName}
                  </p>
                  <p className="text-xs text-gray-500">
                    Code: {item.productId.productCode}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-800">
                  ₹{item.productId.productPrice}
                </p>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            {status === null ? (
              <>
                <button
                  onClick={() => { handleReject(item) }}
                  className="px-4 py-2 bg-white border border-red-500 text-red-500 rounded hover:bg-red-50 font-medium transition-colors"
                >
                  Reject
                </button>
                <button
                  onClick={() => { handleApprove(item) }}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 font-medium transition-colors"
                >
                  Approve
                </button>
              </>
            ) : (
              <div
                className={`px-4 py-2 rounded font-medium ${
                  status === "approved"
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : "bg-red-100 text-red-800 border border-red-200"
                }`}
              >
                {status === "approved" ? "Order Approved" : "Order Rejected"}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageComponent;