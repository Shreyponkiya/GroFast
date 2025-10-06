const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");

const MongoConnection = require("./db/db");

const userRouter = require("./router/Auth/user.router.js");
const adminRouter = require("./router/Admin/admin.router.js");
const customerRouter = require("./router/Customer/customer.router.js");
const cartRouter = require("./router/Customer/cart.router.js");
const paymentRouter = require("./router/Customer/payment.router.js");
const orderRouter = require("./router/Customer/order.router.js");
const deliveryRouter = require("./router/Delivery/delivery.router.js");
const superadminRouter = require("./router/SuperAdmin/superadmin.router.js");
const orderSocket = require("./socket/orderSocket.js"); // ✅ you’ll create this
const locationSocket = require("./socket/locationSocket.js"); // ✅ you’ll create this
const app = express();
const server = http.createServer(app); // 👈 for socket.io support

const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use("/uploads", express.static("uploads"));

// DB connection
try {
  MongoConnection();
} catch (error) {
  console.error("MongoDB connection error:", error);
}

// Routes
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/customer", customerRouter);
app.use("/api/cart", cartRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/order", orderRouter);
app.use("/api/delivery", deliveryRouter);
app.use("/api/superadmin", superadminRouter);

// Socket.IO handling
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  orderSocket(io, socket); // 👈 socket logic
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
