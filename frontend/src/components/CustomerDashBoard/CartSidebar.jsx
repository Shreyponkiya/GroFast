import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createCart } from "../../redux/slices/cartSlice";
import { PostCartProduct } from "../../redux/slices/CustomerSilce";
import { X, ShoppingBag } from "lucide-react";

const CartSidebar = ({ isCartOpen, toggleCart, cart, formatPrice, user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const calculateSubtotal = () => {
    return Object.values(cart).reduce(
      (total, item) => total + item.productPrice * item.quantity,
      0
    );
  };

  const generateProductCode = () => {
    return "ORD" + Math.floor(100000 + Math.random() * 900000);
  };

  const handleCart = async () => {
    const OrderId = "ORD" + Math.floor(100000 + Math.random() * 900000);
    const cartItems = Object.values(cart).map((item) => ({
      productId: item._id,
      quantity: item.quantity,
    }));

    try {
      await dispatch(createCart({ userId: user._id, cartItems, OrderId }));
      navigate(`/user/payment/${OrderId}`);
    } catch (error) {
      console.error("Cart error:", error);
    }
  };

  const calculateGST = () => calculateSubtotal() * 0.18;
  const calculateTotal = () => calculateSubtotal() + calculateGST();

  return (
    <>
      {/* Backdrop */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={toggleCart}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-green-700" />
              <h2 className="text-xl font-bold text-gray-800">Shopping Cart</h2>
            </div>
            {/* Close Button */}
            <button
              onClick={toggleCart}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Cart Content */}
          {Object.keys(cart).length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <ShoppingBag className="h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">Your cart is empty</p>
              <p className="text-sm text-gray-400 mt-2">
                Add items to get started
              </p>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {Object.values(cart).map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-3 p-3 rounded-lg border border-gray-200 hover:border-green-400 transition-colors"
                  >
                    {/* Item Image */}
                    <div className="w-20 h-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                      {item.productImage ? (
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 line-clamp-2 text-sm">
                        {item.productName}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatPrice(item.productPrice)} × {item.quantity}
                      </p>
                      <p className="font-bold text-green-700 mt-1">
                        {formatPrice(item.productPrice * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer with Totals */}
              <div className="border-t border-gray-200 p-4 space-y-4 bg-gray-50">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal:</span>
                    <span className="font-medium text-gray-800">
                      {formatPrice(calculateSubtotal())}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">GST (18%):</span>
                    <span className="font-medium text-gray-800">
                      {formatPrice(calculateGST())}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-800">Total:</span>
                    <span className="text-green-700">
                      {formatPrice(calculateTotal())}
                    </span>
                  </div>
                </div>

                {/* Proceed Button */}
                <button
                  onClick={handleCart}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-700 text-white font-semibold rounded-lg shadow-lg hover:bg-green-600 transition-transform transform hover:scale-105"
                >
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
