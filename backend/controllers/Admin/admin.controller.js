const {
  createProduct,
  createCategory,
  getProductsByUserId,
  getProductByCategoryIdAndUserId,
  getAllCategories,
  updateProduct,
  updateCategory,
  deleteProduct,
  deleteCategory
} = require("../../services/Admin/admin.services");
const Product = require("../../models/Product.model");
const Category = require("../../models/ProductCategory.model");

const paginate = require("../../utils/paginate");

module.exports.addProduct = async (req, res) => {
  try {
    const {
      productCode,
      productName,
      productDescription,
      productPrice,
      productCategory,
      productQuantity,
      createdBy,
    } = req.body;


    console.log("req.file:", req.body);

    // Multer adds req.file — this will contain uploaded image info
    const productImage = req.file ? req.file.filename : null;
    console.log("productImage:", productImage);
    if (
      !productCode ||
      !productName ||
      !productDescription ||
      !productPrice ||
      !productCategory ||
      !productQuantity ||
      !productImage ||
      !createdBy
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const product = await createProduct({
      productCode,
      productName,
      productPrice: Number(productPrice),
      productDescription,
      productCategory,
      productImage, // filename from multer
      productQuantity,
      createdBy,
    });

    if (!product) {
      return res.status(500).json({ message: "Product creation failed" });
    }

    res.status(201).json({
      message: "Product created successfully",
      product: product.product,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
module.exports.addCategory = async (req, res) => {
  try {
    const { categoryCode, categoryName, categoryDescription, isActive } =
      req.body;

    if (!categoryName) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const category = await createCategory({
      categoryCode,
      categoryName,
      categoryDescription,
      isActive,
    });

    res.status(201).json({
      message: "Category created successfully",
      category: category.category,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports.getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await paginate(Product, {}, page, limit, { createdAt: -1 });
    res
      .status(200)
      .json({ message: "Products retrieved successfully", ...result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports.updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const updateData = req.body;

    console.log("req.body :", req.body);

    // If image upload is enabled
    if (req.file) {
      updateData.productImage = req.file.filename;
    }

    const updatedProduct = await updateProduct(productId, updateData);

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports.updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const updateData = req.body;

    const updatedCategory = await updateCategory(categoryId, updateData);

    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports.getProductsByUserId = async (req, res) => {
  try {
    const { createdBy } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const result = await paginate(Product, { createdBy }, page, limit, {
      createdAt: -1,
    });
    res
      .status(200)
      .json({ message: "Products retrieved successfully", ...result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports.getCategories = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await paginate(Category, {}, page, limit, { createdAt: -1 });
    res
      .status(200)
      .json({ message: "Categories retrieved successfully", ...result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};
module.exports.getProductByCategoryIdAndUserId = async (req, res) => {
  try {
    const { categoryId, userId } = req.params;
    
    const products = await getProductByCategoryIdAndUserId(categoryId, userId);

    res
      .status(200)
      .json({ message: "Products retrieved successfully", products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const deleted = await deleteProduct(productId);
    res.status(200).json(deleted);
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
module.exports.deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const deleted = await deleteCategory(categoryId);
    res.status(200).json(deleted);
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Server error", error });
  }
};