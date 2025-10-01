const productCategoryModel = require("../../models/ProductCategory.model");
const productModel = require("../../models/Product.model");
module.exports.createProduct = async function (productData) {
  if (!productData.productCode) {
    throw new Error("Product Code is required.");
  }
  if (!productData.createdBy || productData.createdBy.trim() === "") {
    throw new Error("Created By is required.");
  }

  if (!productData.productName || !productData.productPrice) {
    throw new Error("Product name and price are required.");
  }
  if (
    typeof productData.productPrice !== "number" ||
    productData.productPrice <= 0
  ) {
    throw new Error("Invalid price.");
  }
  if (!productData.productCategory) {
    throw new Error("Product category is required.");
  }
  if (!productData.productImage) {
    throw new Error("Product image is required.");
  }
  if (!productData.productDescription) {
    throw new Error("Product description is required.");
  }
  if (!productData.productQuantity || productData.productQuantity <= 0) {
    throw new Error("Product quantity is required.");
  }

  const product = new productModel({
    productCode: productData.productCode,
    productName: productData.productName,
    productPrice: productData.productPrice,
    productCategory: productData.productCategory,
    productImage: productData.productImage,
    productDescription: productData.productDescription,
    productQuantity: productData.productQuantity,
    createdBy: productData.createdBy,
  });
  await product.save();

  return { success: true, message: "Product created successfully.", product };
};

module.exports.createCategory = async function (categoryData) {
  if (!categoryData.categoryName || categoryData.categoryName.trim() === "") {
    throw new Error("Category name is required.");
  }
  if (!categoryData.categoryCode || categoryData.categoryCode.trim() === "") {
    throw new Error("Category code is required.");
  }

  const category = new productCategoryModel({
    categoryCode: categoryData.categoryCode,
    categoryName: categoryData.categoryName,
    categoryDescription: categoryData.categoryDescription || "",
    isActive: categoryData.isActive || true,
  });
  await category.save();

  return { success: true, message: "Category created successfully.", category };
};

module.exports.getProductsByUserId = async function (userId) {
  const products = await productModel.find({ createdBy: userId });
  return products;
};

module.exports.getProductByCategoryIdAndUserId = async function (
  categoryId,
  userId
){
  const products = await productModel.find({
    productCategory: categoryId,
    createdBy: userId,
  });
  return products;
};

module.exports.getAllCategories = async function () {
  const categories = await productCategoryModel.find({});
  return categories;
};
