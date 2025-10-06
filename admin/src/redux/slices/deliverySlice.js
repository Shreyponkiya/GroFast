import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GET, POST, PUT, DELETE } from "../../../helper/api_helper";

export const UpdateDeliveryBoyStatus = createAsyncThunk(
  "delivery/UpdateDeliveryBoyStatus",
  async ({ deliveryId, status }) => {
    console.log("Delivery ID", deliveryId);
    console.log("Status", status);
    console.log("Fatching data from API update delivery Status");
    const response = await PUT(`/delivery/updateStatus/${deliveryId}`, {
      status,
    });
    await updateDeliveryBoyLocation({ deliveryId });
    console.log("Silce response", response);
    return response;
  }
);

// export const updateDeliveryBoyLocation = createAsyncThunk(
//   "delivery/updateDeliveryBoyLocation",
//   async ({ deliveryId }) => {
//     console.log("Updating location for deliveryId:", deliveryId);
//     const location = await getCurrentLocation(); // You'd define this helper
//     const response = await PUT(`/delivery/updateLocation/${deliveryId}`, {
//       location,
//     });
//     return response;
//   }
// );

// // Helper function to get browser location
// const getCurrentLocation = () =>
//   new Promise((resolve, reject) => {
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         const coords = {
//           lat: pos.coords.latitude,
//           lon: pos.coords.longitude,
//         };
//         resolve(coords);
//       },
//       (err) => reject(err),
//       { enableHighAccuracy: true, timeout: 5000 }
//     );
//   });

