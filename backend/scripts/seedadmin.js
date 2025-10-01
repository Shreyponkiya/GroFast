const mongoose = require("mongoose");
const userModel = require("../models/user.model"); // adjust path if needed
require("dotenv").config();
const MongoConnection = require("../db/db");

async function seedSuperAdmin() {
  try {
    await MongoConnection();

    const existingAdmin = await userModel.findOne({
      email: "superadmin@gmail.com",
    });
    if (existingAdmin) {
      console.log("✅ Super Admin already exists:", existingAdmin.email);
      process.exit();
    }
    const hashedPassword = await userModel.hashPassword(process.env.SEED_SUPERADMIN_PASSWORD);
    const superAdmin = new userModel({
      fullname: "Super Admin", // ✅ required field
      email: process.env.SEED_SUPERADMIN_EMAIL,
      password: hashedPassword,
      role: "superadmin",
    });

    await superAdmin.save();
    console.log("🎉 Super Admin seeded successfully:", superAdmin.email);
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding Super Admin:", error);
    process.exit(1);
  }
}

seedSuperAdmin();
