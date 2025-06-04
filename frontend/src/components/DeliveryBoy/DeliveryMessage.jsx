import React, { useEffect, useState } from "react";

const DeliveryMessage = ({ msg }) => {
  const [status, setStatus] = useState(null);

  const handlePicked = () => {
    setStatus("picked");
  };

  const handleRejected = () => {
    setStatus("rejected");
  };

  useEffect(() => {
    if (status === "picked") {
      console.log("Order picked by delivery boy");
    } else if (status === "rejected") {
      console.log("Delivery rejected");
    }
  }, [status]);

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
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 border-l-4 border-yellow-500">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Delivery Request</h2>
        <span className="text-sm text-gray-500">{formatDate(msg.timestamp)}</span>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-1">
          Order ID: <span className="font-medium">{msg.orderDetailsId}</span>
        </p>
        <p className="text-sm text-gray-600">
          Customer ID: <span className="font-medium">{msg.senderId}</span>
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-2">Products</h3>
        <div className="bg-gray-50 rounded p-3">
          {msg.products.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center mr-3">
                  {item.productId.productImage ? (
                    <img
                      src={`${import.meta.env.VITE_BASE_URL}/uploads/${item.productId.productImage}`}
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
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        {status === null ? (
          <>
            <button
              onClick={handleRejected}
              className="px-4 py-2 bg-white border border-red-500 text-red-500 rounded hover:bg-red-50 font-medium transition-colors"
            >
              Reject
            </button>
            <button
              onClick={handlePicked}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium transition-colors"
            >
              Picked
            </button>
          </>
        ) : (
          <div
            className={`px-4 py-2 rounded font-medium ${
              status === "picked"
                ? "bg-blue-100 text-blue-800 border border-blue-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            {status === "picked" ? "Order Picked" : "Delivery Rejected"}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryMessage;
