const productCategoryModel = require("../../models/ProductCategory.model");
const productModel = require("../../models/Product.model");

module.exports.getAllCategories = async function () {
  const categories = await productCategoryModel.find({});
  return categories;
};

module.exports.getAllProducts = async function () {
  const products = await productModel.find({}).populate("productCategory").populate("createdBy");
  return products;
};