const useModel = require("../../models/user.model");

module.exports.updateDeliveryBoyStatus = async (deliveryId, status) => {
  try {
    const updatedDelivery = await useModel.findByIdAndUpdate(
      deliveryId,
      { "roleDetails.deliveryBoy.deliveryBoyStatus": status },
      { new: true }
    );
    return updatedDelivery;
  } catch (error) {
    throw new Error("Error updating delivery status: " + error.message);
  }
};
