const userModel = require("../../models/user.model");
const {
  createUser,
  loginUser,
  updatelocation,
} = require("../../services/Auth/user.services");

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
    const returnuser = await loginUser(email, password);
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
    const user = await userModel.findById(req.user._id);
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
