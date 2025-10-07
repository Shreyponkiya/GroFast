const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "deliveryBoy", "superadmin"],
      default: "user",
    },
    roleDetails: {
      user: {
        userAddress: String,
      },
      admin: {
        shopName: String,
        shopGST: String,
        shopAddress: String,
      },
      deliveryBoy: {
        vehicleNumber: String,
        drivingLicense: String,
        deliveryBoyAddress: String,
        deliveryBoyPhone: String,
        Coordinates: {
          lat: Number,
          lng: Number,
        },
        deliveryBoyStatus: {
          type: String,
          enum: ["active", "inactive"],
          default: "inactive",
        },
      },
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    address: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return token;
};

userSchema.methods.comparePassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

userSchema.statics.hashPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

userSchema.statics.verifyAuthToken = async function (token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
};

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
