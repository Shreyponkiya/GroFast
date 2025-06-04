const userModel = require("../../models/user.model");
module.exports.createUser = async (userData) => {
  try {
    const newUser = await userModel.create(userData);
    if (!newUser) {
      throw new Error("User creation failed");
    }
    await newUser.save();
    return newUser;
  } catch (error) {
    throw new Error("Error creating user: " + error.message);
  }
};

module.exports.loginUser = async (email, password) => {
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return { success: false, message: "User not found" };
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return { success: false, message: "Invalid credentials" };
    }

    const token = await user.generateAuthToken();
    if (!token) {
      return { success: false, message: "Token generation failed" };
    }

    return { success: true, user, token };
  } catch (error) {
    console.log("Error logging in user:", error);
    return { success: false, message: "Something went wrong" };
  }
};

exports.updatelocation = async (userId, location) => {
  try {
    const { address } = location;
    const user = await userModel.findByIdAndUpdate(
      userId,
      { address: address },
      { new: true }
    );
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error("Error updating user location: " + error.message);
  }
};
