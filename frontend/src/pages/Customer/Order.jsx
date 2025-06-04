import React, { useState, useEffect, use } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProfile, logout } from "../../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { getOrderById } from "../../redux/slices/orderSlice";
import { io } from "socket.io-client";

const Order = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [socket,setSocket] = useState(null);
  const { placeOrderId } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [buyFromShopName, setBuyFromShopName] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

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
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const response = await dispatch(getOrderById(placeOrderId));
        console.log("response",response)
        console.log("response.payload",response.payload)
        setOrderDetails(response.payload);
        handleFindShopName(response.payload.order.products);

        console.log("Order details:", response);
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [dispatch, placeOrderId]);

useEffect(() => {
  console.log("orderDetails?.order?._id", orderDetails?.order?._id);
  console.log("socket", socket );
  console.log("user", user );
  if (user && socket && orderDetails?.order?._id) {
    console.log("location is send to socket.io")
    socket.emit("join", user._id);
    sendRequest();
  }
}, [socket,user, orderDetails]);

const sendRequest = () => {
  if (!user?._id || !orderDetails?.order?._id) {
    alert("Please log in and select a user to send order request");
    return;
  }

  const msgData = {
    senderId: user._id,
    orderDetailsId: orderDetails.order._id,
    products: orderDetails.order.products.map((product) => ({
      productId: product.productId,
      quantity: product.quantity,
    })),    
    shopkeeperId: buyFromShopName.map((shop) => shop.createdById),
    timestamp: new Date().toISOString(),
  };

  if (socket) {
    socket.emit("sendOrderRequest", msgData);
  } else {
    alert("Socket connection not established");
  }
};

  // GetShopName
const handleFindShopName = (products) => {
  console.log("Products:", products);

  // Extract relevant admin shop data including createdBy._id
const shopList = products
  .filter((product) => product.productId.createdBy.roleDetails?.admin)
  .map((product) => {
    const createdBy = product.productId.createdBy;
    const createdById = createdBy._id;
    const admin = createdBy.roleDetails.admin;

    return {
      createdById,
      ...admin,
    };
  });


  // Remove duplicates based on shopGST
  const uniqueShops = Array.from(
    new Map(shopList.map((shop) => [shop.shopGST, shop])).values()
  );

  console.log("Unique Shops with createdById:", uniqueShops);
  setBuyFromShopName(uniqueShops);
};


  // Format order date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 py-8 px-4">
      <div className="w-full max-w-4xl">
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-green-800 border-b pb-4 mb-4">
            Order Details
          </h1>

          {orderDetails && (
            <div className="space-y-4">
              <div className="flex justify-between flex-wrap">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-semibold">{placeOrderId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="font-semibold">
                    {orderDetails.order?.createdAt &&
                      formatDate(orderDetails.order.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {orderDetails.order?.status || "Processing"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Shop Information Cards */}
        {buyFromShopName.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Seller Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {buyFromShopName.map((shopDetails, index) => (
                <div
                  key={index}
                  className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="bg-green-600 p-3">
                    <h3 className="text-xl font-semibold text-white">
                      {shopDetails.shopName}
                    </h3>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-start">
                      <svg
                        className="w-5 h-5 text-gray-500 mt-1 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        ></path>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        ></path>
                      </svg>
                      <p className="text-gray-700">{shopDetails.shopAddress}</p>
                    </div>
                    {shopDetails.shopGST && (
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 text-gray-500 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          ></path>
                        </svg>
                        <p className="text-gray-700">
                          GST: {shopDetails.shopGST}
                        </p>
                      </div>
                    )}
                    {shopDetails.shopPhone && (
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 text-gray-500 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          ></path>
                        </svg>
                        <p className="text-gray-700">{shopDetails.shopPhone}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Order Items Section (placeholder) */}
        {orderDetails && orderDetails.order?.products && (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Order Items
            </h2>
            <div className="space-y-4">
              {orderDetails.order.products.map((product, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row border-b pb-4 items-center md:items-start"
                >
                  <div className="md:w-1/6 flex-shrink-0 mb-3 md:mb-0">
                    {product.productId.productImage &&
                    product.productId.productImage ? (
                      <img
                        src={`${import.meta.env.VITE_BASE_URL}/uploads/${
                          product.productId.productImage
                        }`}
                        alt={`${import.meta.env.VITE_BASE_URL}/uploads/${
                          product.productId.productImage
                        }`}
                        className="w-24 h-24 object-cover rounded"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-500">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="md:w-5/6 md:pl-4">
                    <h3 className="text-lg font-medium">
                      {product.productId.productName}
                    </h3>
                    <div className="flex flex-wrap gap-4 mt-2">
                      <div>
                        <p className="text-sm text-gray-500">Price</p>
                        <p className="font-semibold">
                          ₹{product.productId.productPrice}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Quantity</p>
                        <p className="font-semibold">{product.quantity}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="font-semibold">
                          ₹{product.productId.productPrice * product.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-6 border-t pt-4">
              <div className="flex justify-between">
                <span className="font-medium">Subtotal:</span>
                <span className="font-semibold">
                  ₹
                  {orderDetails.order.amount
                    ? orderDetails.order.amount
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="font-medium">Shipping:</span>
                <span className="font-semibold">
                  ₹{orderDetails.order.shippingPrice || "0"}
                </span>
              </div>
              <div className="flex justify-between mt-2 text-lg">
                <span className="font-bold">Total:</span>
                <span className="font-bold text-green-700">
                  ₹
                  {orderDetails.order.amount
                    ? orderDetails.order.amount +
                      (orderDetails.order.shippingPrice || 0)
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Back
          </button>
          <button className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
            Track Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Order;
