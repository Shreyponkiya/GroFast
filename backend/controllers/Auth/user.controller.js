const userModel = require("../../models/user.model");
const {
  createUser,
  loginUser,
  updatelocation,
  forgotPasswordService,
} = require("../../services/Auth/user.services");

const crypto = require("crypto");
const nodemailer = require("nodemailer");

module.exports.register = async (req, res) => {
  try {
    const { fullname, email, password, role, roleDetails } = req.body;
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    if (!fullname || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const hashedPassword = await userModel.hashPassword(password);

    const newUser = await createUser({
      fullname,
      email,
      password: hashedPassword,
      role,
      roleDetails,
    });
    if (!newUser) {
      return res.status(400).json({ message: "User registration failed" });
    }

    const token = await newUser.generateAuthToken();
    if (!token) {
      return res.status(400).json({ message: "Token generation failed" });
    }
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    
    res
      .status(201)
      .json({ message: "User registered successfully", newUser, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate token
    const resetToken = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 mins
    await user.save();

    // Reset link
    const resetUrl = `${process.env.Frontend_URL}/reset-password/${resetToken}`;

    // Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.useremail,
        pass: process.env.passswordemail,
      },
    });

    await transporter.sendMail({
      from: process.env.useremail,
      to: user.email,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset</p>
             <p><a href="${resetUrl}">Click here to reset password</a></p>`,
    });

    res.json({ message: "Password reset link sent to email" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error in forgot password", error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    user.password = password; // 👉 hash with bcrypt before saving
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error in resetting password", error: error.message });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    console.log("email, password", email, password);
    const returnuser = await loginUser(email, password);
    console.log("returnuser", returnuser);
    if (!returnuser.user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    if (!returnuser.token) {
      return res.status(400).json({ message: "Token generation failed" });
    }    
    res.status(200).json({ message: "Login successful", user: returnuser.user, token: returnuser.token,message: returnuser.message });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports.profile = async (req, res) => {
  try {
    const user = await userModel.findById(
      req.user._id,
      "-password -__v -tokens"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports.logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports.updateAddress = async (req, res) => {
  try {
    const { address } = req.body;
    if (!address) {
      return res.status(400).json({ message: "Address is required" });
    }
    const user = await updatelocation(req.user._id, { address: address });
    console.log("user", user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Location updated successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};
