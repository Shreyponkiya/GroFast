const productModel = require("../../models/Product.model");
const userModel = require("../../models/user.model");

// ✅ Get all products
module.exports.getAllProducts = async () => {
  try {
    const products = await productModel
      .find({})
      .populate("productCategory")
      .populate({
        path: "createdBy",
        select: "fullname email role", // hide password
      });
    return products;
  } catch (error) {
    throw new Error("Error fetching products: " + error.message);
  }
};

// ✅ Get product by ID
module.exports.getProductById = async (id) => {
  try {
    const product = await productModel
      .findById(id)
      .populate("productCategory")
      .populate({
        path: "createdBy",
        select: "fullname email role", // hide password
      });

    return product;
  } catch (error) {
    throw new Error("Error fetching product by ID: " + error.message);
  }
};
