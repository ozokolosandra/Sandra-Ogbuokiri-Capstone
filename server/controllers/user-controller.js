import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);
import bcrypt from "bcryptjs";
//const bcrypt = require("bcrypt");

 const getAllUsers = async (req, res) => {
    try {
        const users = await knex("users").select("id", "user_name", "email", "created_at");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: `Error fetching users: ${error.message}` });
    }
};

 const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Extracted from JWT in middleware

        const user = await knex("users").where("id", userId).first();
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: `Error fetching profile: ${error.message}` });
    }
};



 const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Extracted from JWT in middleware
    const { user_name, email, password } = req.body;

    // Initialize update object
    const updateData = { user_name, email };

    // If password is provided, hash it and add to update object
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateData.password = hashedPassword;
    }

    // Update the user profile
    await knex("users").where("id", userId).update(updateData);

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ error: `Error updating profile: ${error.message}` });
  }
};

export {getAllUsers,getUserProfile,updateUserProfile}