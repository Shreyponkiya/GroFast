const customerServices = require("../../services/Customer/customer.services");
module.exports.getAllProducts = async (req, res) => {
    try {
        const products = await customerServices.getAllProducts();        
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}