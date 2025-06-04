const express = require('express');
const router = express.Router();
const { placeOrder,getOrderById } = require('../../controllers/Customer/order.controller');


router.post('/placeOrder', placeOrder);
router.get('/getOrder/:placeOrderId', getOrderById);

module.exports = router;