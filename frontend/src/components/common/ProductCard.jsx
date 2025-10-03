import React from "react";
import { Plus, Minus } from "lucide-react";

const ProductCard = ({
  product,
  cart,
  addToCart,
  removeFromCart,
  formatPrice,
}) => {
  const quantity = cart[product._id]?.quantity || 0;

  return (
    <div className="group relative border border-gray-200 rounded-lg overflow-hidden h-full hover:shadow-lg transition-all duration-300 flex flex-col">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {product.productImage ? (
          <img
            src={product.productImage}
            alt={product.productName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300">
            <span className="text-gray-500 text-sm">No image</span>
          </div>
        )}

        {/* Quick Add Overlay */}
        {quantity === 0 && (
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
            <button
              onClick={() => addToCart(product)}
              className="inline-flex items-center gap-1 px-3 py-1 bg-green-700 text-white font-semibold rounded shadow hover:bg-green-600 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add to Cart
            </button>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-gray-800 line-clamp-2 text-sm md:text-base">
            {product.productName}
          </h3>
          {product.productDescription && (
            <p className="text-xs text-gray-500 line-clamp-1 mt-1">
              {product.productDescription}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 mt-4">
          <span className="text-lg font-bold text-green-700">
            {formatPrice(product.productPrice)}
          </span>

          {/* Add/Remove Controls */}
          {quantity > 0 ? (
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => removeFromCart(product)}
                className="h-7 w-7 flex items-center justify-center rounded hover:bg-green-700 hover:text-white transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="font-semibold min-w-[1.5rem] text-center text-gray-800">
                {quantity}
              </span>
              <button
                onClick={() => addToCart(product)}
                className="h-7 w-7 flex items-center justify-center rounded hover:bg-green-700 hover:text-white transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(product)}
              className="inline-flex items-center gap-1 px-3 py-1 border border-gray-300 text-gray-800 rounded hover:bg-green-700 hover:text-white transition-colors"
            >
              <Plus className="h-3 w-3" />
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
