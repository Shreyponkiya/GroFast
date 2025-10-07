const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model"); // Adjust path as needed

module.exports.userMiddlewere = async (req, res, next) => {
  try {
    // Get token from header (Authorization: Bearer <token>) or cookie
    const token =
      req.header("Authorization")?.replace("Bearer ", "") || req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const decoded = await userModel.verifyAuthToken(token);
    const user = await userModel.findById(decoded._id).select("-password"); // Exclude password for security
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.log("Auth error:", error);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
