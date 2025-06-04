import React from "react";
import { PostCartProduct } from "../../redux/slices/CustomerSilce";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

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
  }

  const handleCart = async () => {
    const OrderId = generateProductCode();
    const cartItems = Object.values(cart).map((item) => ({
      productId: item._id,
      quantity: item.quantity,
      OrderId: OrderId,
    }));

    try {
      await dispatch(PostCartProduct({ userId: user._id, cartItems, OrderId }));
      console.log("Cart submitted!");      
      navigate(`/user/payment/${OrderId}`);
      // Optionally navigate or clear cart here
    } catch (error) {
      console.error("Cart error:", error);
    }
  };

  const calculateGST = () => {
    return calculateSubtotal() * 0.18;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateGST();
  };

  return (
    <>
      {isCartOpen && (
        <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-lg z-20 p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Shopping Cart</h2>
            <button
              onClick={toggleCart}
              className="text-gray-500 hover:text-gray-700"
            >
              × Close
            </button>
          </div>

          {Object.keys(cart).length === 0 ? (
            <p className="text-center py-8 text-gray-500">Your cart is empty</p>
          ) : (
            <div className="space-y-4">
              {Object.values(cart).map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <h3 className="font-medium">{item.productName}</h3>
                    <p className="text-sm text-gray-500">
                      {formatPrice(item.productPrice)} × {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      {formatPrice(item.productPrice * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}

              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between font-bold">
                  <div className="space-y-2 w-full">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatPrice(calculateSubtotal())}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST (18%):</span>
                      <span>{formatPrice(calculateGST())}</span>
                    </div>
                    <div className="flex justify-between text-lg text-green-700">
                      <span>Total:</span>
                      <span>{formatPrice(calculateTotal())}</span>
                    </div>
                  </div>
                </div>

                <button
                  className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  onClick={async () => {
                    await handleCart();
                  }}
                >
                  Buy Now
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default CartSidebar;
