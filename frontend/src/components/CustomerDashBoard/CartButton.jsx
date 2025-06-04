import React from 'react';
import { ShoppingCart } from 'lucide-react';

const CartButton = ({ cartItemsCount, toggleCart }) => {
  if (cartItemsCount === 0) return null;

  return (
    <div
      className="flex justify-center items-center fixed bottom-10 left-1/2 transform -translate-x-5 z-10 bg-green-600 text-white rounded-full w-40 shadow-lg px-4 py-1 hover:bg-green-700 transition-all duration-700 cursor-pointer hover:shadow-xl"
      onClick={toggleCart}
    >
      <button className="relative flex items-center space-x-2 px-3 py-2 rounded-md transition-colors">
        <div className="relative">
          <ShoppingCart size={24} className="cursor-pointer" />
          {cartItemsCount > 0 && (
            <span className="absolute -top-1 -right-1 cursor-pointer bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
              {cartItemsCount}
            </span>
          )}
        </div>
        <span className="text-lg font-medium cursor-pointer">Cart</span>
      </button>
    </div>
  );
};

export default CartButton;