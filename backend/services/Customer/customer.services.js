const productModel = require("../../models/Product.model");
const userModel = require("../../models/user.model");

// ✅ Get all products
module.exports.getAllProducts = async (page = 1, limit = 10, search = "") => {
  try {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    // Search query (case-insensitive) on productName
    const query = search
      ? { productName: { $regex: search, $options: "i" } }
      : {};

    const totalDocs = await productModel.countDocuments(query);
    const totalPages = Math.ceil(totalDocs / limit);

    const products = await productModel
      .find(query)
      .populate("productCategory")
      .populate({
        path: "createdBy",
        select: "fullname email role",
      })
      .skip(skip)
      .limit(limit);

    return {
      pagination: {
        page,
        limit,
        totalDocs,
        totalPages,
      },
      data: products,
    };
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
