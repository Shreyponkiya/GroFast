const mongoose = require("mongoose");


const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    OrderId: {
      type: String,
      required: true,
      unique: true,
    },
    products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
    },
  ],
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    totalGST: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

const CartModel = mongoose.model("Cart", cartSchema);
module.exports = CartModel;
