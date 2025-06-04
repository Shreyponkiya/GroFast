// socket/orderSocket.js

module.exports = (io, socket) => {
  console.log("Socket connected:", socket.id);
  console.log("Socket connected to orderSocket");
  // Customer sends order request to shopkeeper
  socket.on("sendOrderRequest", (orderData) => {
    console.log("Order request received:", orderData);

    // Optional: save to DB here
    // Emit to specific shopkeeper room/socket
    orderData.shopkeeperId.forEach((element) => {
      console.log("Emitting to shopkeeper:", element);
      const result = io.to(element).emit("receiveOrderRequest", orderData);
      console.log("Emit result:", result);
    });
  });

  socket.on("rejectOrder", (data) => {
    console.log("Order rejected:", data);

    // Notify customer
    io.to(data.customerId).emit("orderStatus", {
      status: "rejected",
      orderId: data.orderId,
    });
  });

  socket.on("approveOrder", (data) => {
    console.log("Order approved:", data);

    // Notify customer
    io.to(data.customerId).emit("orderStatus", {
      status: "approved",
      orderId: data.orderId,
    });
  });
  

  // Join personal room for shopkeeper or customer
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User with ID ${userId} joined room ${userId}`);
  });

  socket.on("location", (data) => {
    console.log("Location data received:", data);
  });

  // Notify the customer about the delivery location
  io.to(data.customerId).emit("locationUpdate", {
    status: "in-progress",
    location: data.location,
    orderId: data.orderId,
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
};

// module.exports = (io, socket) => {
//   console.log("Socket connected:", socket.id);

//   // Each user joins their unique room based on userId
//   socket.on("join", (userId) => {
//     socket.join(userId);
//     console.log(`User with ID ${userId} joined room ${userId}`);
//   });

//   // === CUSTOMER SENDS ORDER ===
//   socket.on("sendOrderRequest", (orderData) => {
//     console.log("Order request received from customer:", orderData);

//     // Send to all targeted shopkeepers
//     orderData.shopkeeperIds.forEach((shopkeeperId) => {
//       console.log(`Sending order to Shopkeeper: ${shopkeeperId}`);
//       io.to(shopkeeperId).emit("receiveOrderRequest", orderData);
//     });
//   });

//   // === SHOPKEEPER APPROVES ORDER ===

//   // === SHOPKEEPER REJECTS ORDER ===

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });
// };
