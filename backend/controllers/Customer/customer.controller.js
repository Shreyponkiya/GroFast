const customerServices = require("../../services/Customer/customer.services");

// ✅ Get all products
module.exports.getAllProducts = async (req, res) => {
  try {
    const { page, limit, search } = req.query;

    const result = await customerServices.getAllProducts(page, limit, search);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching products",
      error: error.message,
    });
  }
};

// ✅ Get product by ID
module.exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await customerServices.getProductById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
