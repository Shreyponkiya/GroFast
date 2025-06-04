import React from "react";
import { Package, Plus, Minus } from "lucide-react";

const ProductCard = ({
  product,
  cart,
  addToCart,
  removeFromCart,
  formatPrice,
}) => {
  return (
    <div className="min-w-[250px] bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105 flex-shrink-0">
      <div className="h-48 w-75 bg-gray-100 relative">
        {product.productImage && product.productImage !== "not available" ? (
          <img
            src={`${import.meta.env.VITE_BASE_URL}/uploads/${
              product.productImage
            }`}
            alt={product.productName}
            className="w-full h-full object-cover rounded-t-lg"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-lg relative">
            <Package size={64} className="text-emerald-300" />
            <span className="absolute bottom-2 right-2 bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
              No Image
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate">
          {product.productName}
        </h3>
        <p className="text-gray-500 text-sm mt-1 h-10 overflow-hidden">
          {product.productDescription}
        </p>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-emerald-600 font-bold text-lg">
            {formatPrice(product.productPrice)}
          </span>
          {cart[product._id] ? (
            <div className="flex justify-between items-center bg-green-600 text-white rounded-md h-10 w-25 py-1 transition-colors">
              <button
                className="px-2 py-2 text-white rounded-md transition-colors"
                onClick={() => removeFromCart(product)}
              >
                <Minus
                  style={{
                    color: "white",
                    width: 18,
                  }}
                />
              </button>
              <p>{cart[product._id].quantity}</p>
              <button
                className="px-2 py-2  text-white rounded-md transition-colors"
                onClick={() => addToCart(product)}
              >
                <Plus
                  style={{
                    color: "white",
                    width: 18,
                  }}
                />
              </button>
            </div>
          ) : (
            <div className="flex justify-between items-center bg-green-600 hover:bg-green-700 text-white rounded-md h-10 w-25 transition-colors">
              <button
                className="px-2 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
