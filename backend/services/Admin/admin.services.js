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

module.exports.updateProduct = async function (productId, updateData) {
  try {
    // Check for duplicate productCode only if it is being updated
    if (updateData.productCode) {
      const existingProduct = await productModel.findOne({
        productCode: updateData.productCode,
        _id: { $ne: productId }, // exclude current product
      });

      // if (existingProduct) {
      //   throw new Error(
      //     `Product code ${updateData.productCode} already exists`
      //   );
      // }
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      throw new Error("Product not found");
    }

    return {
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    };
  } catch (error) {
    throw new Error("Error updating product: " + error.message);
  }
};


module.exports.updateCategory = async function (categoryId, updateData) {
  try {
    const updatedCategory = await productCategoryModel.findByIdAndUpdate(
      categoryId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      throw new Error("Category not found");
    }

    return {
      success: true,
      message: "Category updated successfully",
      category: updatedCategory,
    };
  } catch (error) {
    throw new Error("Error updating category: " + error.message);
  }
};

module.exports.getProductsByUserId = async function (userId) {
  const products = await productModel.find({ createdBy: userId });
  console.log("products : ",products);
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

module.exports.deleteProduct = async function (productId) {
  try {
    const deletedProduct = await productModel.findByIdAndDelete(productId);
    if (!deletedProduct) {
      throw new Error("Product not found");
    }
    return {
      success: true,
      message: "Product deleted successfully",
      product: deletedProduct,
    };
  } catch (error) {
    throw new Error("Error deleting product: " + error.message);
  }
};
module.exports.deleteCategory = async function (categoryId) {
  try {
    const deletedCategory = await productCategoryModel.findByIdAndDelete(
      categoryId
    );
    if (!deletedCategory) {
      throw new Error("Category not found");
    }
    return {
      success: true,
      message: "Category deleted successfully",
      category: deletedCategory,
    };
  } catch (error) {
    throw new Error("Error deleting category: " + error.message);
  }
};