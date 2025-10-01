const userModel = require("../../models/user.model");
const crypto = require("crypto");

module.exports.createUser = async (userData) => {
  try {
    const newUser = await userModel.create(userData);
    if (!newUser) {
      return { success: false, message: "User creation failed" };
    }
    await newUser.save();
    return { success: true, user: newUser };
  } catch (error) {
    return { success: false, message: "Error creating user: " + error.message };
  }
};

module.exports.createSuperAdmin = async (userData) => {
  try {
    const newUser = await userModel.create(userData);
    if (!newUser) {
      throw new Error("Super Admin creation failed");
    }
    await newUser.save();
    return newUser;
  } catch (error) {
    throw new Error("Error creating Super Admin: " + error.message);
  }
};

module.exports.loginUser = async (email, password) => {
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return { success: false, message: "User not found" };
    }
    console.log("user found:", password, user.password);
    const isMatch = await user.comparePassword(password);
    console.log("isMatch", isMatch);
    if (!isMatch) {
      return { success: false, message: "Invalid credentials" };
    }

    const token = await user.generateAuthToken();
    if (!token) {
      return { success: false, message: "Token generation failed" };
    }

    return { success: true, user, token, message: "Login successful" };
  } catch (error) {
    console.log("Error logging in user:", error);
    return { success: false, message: "Something went wrong" };
  }
};

module.exports.updatelocation = async (userId, location) => {
  try {
    const { address } = location;
    const user = await userModel.findByIdAndUpdate(
      userId,
      { address: address },
      { new: true }
    );
    if (!user) {
      return { success: false, message: "User not found" };
    }
    return { success: true, user, message: "Location updated successfully" };
  } catch (error) {
    return {
      success: false,
      message: "Error updating user location: " + error.message,
    };
  }
};

module.exports.forgotPasswordService = async (email) => {
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return { success: false, message: "User not found" };
    }

    // generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // hash it before saving (security)
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // save token + expiry in user model
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

    await user.save();

    return {
      success: true,
      message: "Password reset token generated successfully",
      resetToken,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error generating reset token: " + error.message,
    };
  }
};
