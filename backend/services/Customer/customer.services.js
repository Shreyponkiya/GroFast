const productModel = require("../../models/Product.model");
const userModel = require("../../models/user.model");
module.exports.getAllProducts = async () => {
  try {
    const products = await productModel
      .find({})
      .populate("productCategory")
      .populate("createdBy");
    return products;
  } catch (error) {
    throw new Error("Error fetching products: " + error.message);
  }
};
