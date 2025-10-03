import React, { useState, useEffect } from "react";
import { GetCartProduct } from "../../redux/slices/CustomerSilce";
import {
  createPaymentIntent,
  getKey,
  verifyPayment,
} from "../../redux/slices/paymentSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import { createOrder } from "../../redux/slices/orderSlice";
import { fetchCart } from "../../redux/slices/cartSlice";

const BillComponent = ({ user, OrderId, dispatch }) => {
  // const [cartProducts, setCartProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [countdown, setCountdown] = useState(3);  
  const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchCartProducts = async () => {
  //     if (!OrderId) return;
  //     setIsLoading(true);
  //     try {
  //       const response = await dispatch(GetCartProduct({ OrderId })).unwrap();
  //       console.log("Fetched cart products:", response);
  //       setCartProducts([response]); // Store the actual cart data
  //     } catch (error) {
  //       console.error("Failed to fetch cart data:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchCartProducts();
  // }, [dispatch, OrderId]);

  // Countdown effect for redirection after successful payment
  useEffect(() => {
    if (user) {
      dispatch(fetchCart({ userId: user._id }));
    }
  }, [user, dispatch]);

  const handleOrderConfirmation = async (Products) => {
    console.log("Products:", Products);
    const paymentOrderResponse = await dispatch(
      createPaymentIntent({ amount: Products.totalPrice, currency: "INR" })
    );

    console.log("paymentOrderResponse:", paymentOrderResponse);

    if (!paymentOrderResponse || !paymentOrderResponse.payload.data) {
      console.error("Error: Invalid payment order response.");
      return;
    }

    const order = paymentOrderResponse.payload.data;
    console.log("Order data:", order);

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: order.amount, // 800000 (paise)
      currency: order.currency,
      name: "Acme Corp",
      description: "Test Transaction",
      order_id: order.id,
      handler: async function (response) {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
          response;
        console.log("Razorpay response:", response);

        const verifyResponse = await dispatch(
          verifyPayment({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
          })
        );
        console.log("Verify response:", verifyResponse);

        if (verifyResponse.payload.success) {
          const order = await dispatch(
            createOrder({
              userId: user._id,
              products: Products.products,
              amount: Products.totalPrice,
              razorpay_order_id,
              razorpay_payment_id,
            })
          );
          console.log("Order created:", order.payload.order._id);
          navigate(`/user/order/${order.payload.order._id}`);
          setIsPaymentSuccessful(true);
        } else {
          setIsPaymentSuccessful(false);
          console.error("Payment verification failed:", verifyResponse);
          alert("Payment verification failed.");
        }
      },
      prefill: {
        name: "Shrey Ponkiya",
        email: "shreyponiya@gmail.com",
        contact: "7486997382",
      },
      theme: {
        color: "#10B981", // Tailwind green-500
      },
      modal: {
        ondismiss: function () {
          console.log("Payment modal closed");
        },
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
    };

    const rzp = new Razorpay(options);
    rzp.open();
  };

  return (
    <>
      <div className="max-w-4xl mx-auto mt-8 shadow-lg rounded-lg overflow-hidden border border-gray-200">
        <div
          className="bg-gradient-to-r from-green-600 to-green-500 px-6 py-4 cursor-pointer flex justify-between items-center border-b border-gray-200 hover:bg-green-500 transition"
          onClick={() => setIsCartOpen(!isCartOpen)}
        >
          <div>
            <h2 className="text-2xl font-bold text-white">Order Summary</h2>
            <p className="text-green-100 mt-1">Thank you for your purchase</p>
          </div>
        </div>
      </div>
      <div className="transition-all duration-500 ease-in-out animate-slideDown bg-white shadow-lg  selection:shadow-lg rounded-lg overflow-hidden border border-gray-200">
        <div className="px-6 py-4 flex items-center justify-between border-b border-green-100">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-full mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-green-800">
              Order ID:{" "}
              <span className="font-mono text-green-700">{OrderId}</span>
            </h2>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-200 text-green-800">
            <span className="h-2 w-2 bg-green-600 rounded-full mr-2"></span>
            Confirmed
          </span>
        </div>

        {/* Content */}
        <div className="px-6 py-6 bg-white">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-500 mb-4"></div>
              <p className="text-gray-500 mt-2">
                Loading your order details...
              </p>
            </div>
          ) : cartProducts.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-gray-300 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <p className="text-gray-500 text-lg">
                No products found for this order.
              </p>
            </div>
          ) : (
            cartProducts.map((item) => (
              <div key={item._id}>
                {/* Products List */}
                <div className="divide-y divide-gray-200">
                  {item.products.map((product, index) => (
                    <div
                      key={product._id}
                      className={`py-5 flex flex-col sm:flex-row sm:items-start ${
                        index === 0 ? "" : "mt-4"
                      }`}
                    >
                      {/* Product Image Placeholder */}
                      <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center text-gray-400 overflow-hidden">
                        <img
                          src={`${import.meta.env.VITE_BASE_URL}/uploads/${
                            product.productId.productImage
                          }`}
                          alt={product.productId.productName}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 sm:ml-6 mt-4 sm:mt-0">
                        <h3 className="text-lg font-medium text-gray-900">
                          {product.productId.productName}
                        </h3>
                        <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                          <div className="text-gray-500">Unit Price:</div>
                          <div className="text-gray-900 font-medium">
                            ₹{product.productId.productPrice.toFixed(2)}
                          </div>

                          <div className="text-gray-500">Quantity:</div>
                          <div className="text-gray-900 font-medium">
                            {product.quantity}
                          </div>

                          <div className="text-gray-500">GST (18%):</div>
                          <div className="text-gray-900 font-medium">
                            ₹
                            {(
                              (product.productId.productPrice * 18) /
                              100
                            ).toFixed(2)}
                          </div>
                        </div>

                        {/* Product Total */}
                        <div className="mt-3 bg-green-50 px-4 py-2 rounded-md border border-green-100">
                          <div className="flex justify-between items-center">
                            <span className="text-green-800 font-medium">
                              Subtotal:
                            </span>
                            <span className="text-green-800 font-bold">
                              ₹
                              {(
                                product.productId.productPrice *
                                  product.quantity +
                                (product.productId.productPrice * 18) / 100
                              ).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex justify-between text-base">
                    <p className="text-gray-600">Subtotal</p>
                    <p className="font-medium">
                      ₹{(item.totalPrice - item.totalGST).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex justify-between text-base mt-2">
                    <p className="text-gray-600">GST</p>
                    <p className="font-medium">₹{item.totalGST.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t border-gray-200">
                    <p className="text-gray-900">Total</p>
                    <p className="text-green-700">
                      ₹{item.totalPrice.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Payment Status */}
                {isPaymentSuccessful ? (
                  <div className="mt-8 animate-slideDown">
                    <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 text-center">
                      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                        <svg
                          className="h-10 w-10 text-green-600"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-green-800 mb-2">
                        Payment Successful!
                      </h3>
                      <p className="text-green-700 mb-4">
                        Your payment has been processed successfully. Thank you
                        for your purchase!
                      </p>

                      {isRedirecting && (
                        <div className="mt-4 text-gray-600">
                          <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full">
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            <span>Redirecting in {countdown} seconds...</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 text-center">
                      <button
                        onClick={() => navigate(`/user/order/${OrderId}`)}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        View Order Details
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-8 text-center">
                    <button
                      onClick={() => {
                        handleOrderConfirmation(item);
                      }}
                      className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      Proceed to Payment
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Global CSS for animations */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default BillComponent;
