const mongoose = require("mongoose");
const productCategorySchema = new mongoose.Schema({
  categoryCode: {
    type: String,
    unique: true,
    required: true,
  },
  categoryName: {
    type: String,
    required: true,
  },
  categoryDescription: {
    type: String,
    required: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const categoryModel = mongoose.models.ProductCategory || mongoose.model('ProductCategory', productCategorySchema);
module.exports = categoryModel;
