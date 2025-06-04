const DeliveryServices = require("../../services/DeliveryBoy/delivery.services");
const { client } = require("../../Redis/server");
const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // or your frontend URL
  },
});

module.exports.updateDeliveryBoyStatus = async (req, res) => {
  const { deliveryId } = req.params;
  const { status } = req.body;

  try {
    const updatedDelivery = await DeliveryServices.updateDeliveryBoyStatus(
      deliveryId,
      status
    );
    return res
      .status(200)
      .json({
        message: "Delivery status updated successfully",
        delivery: updatedDelivery,
      });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "Error updating delivery status",
        error: error.message,
      });
  }
};

// const updateDeliveryBoyLocation = async (req, res) => {
  
  
// }


