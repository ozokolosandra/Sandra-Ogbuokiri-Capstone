import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

export const getAllUsers = async (req, res) => {
    try {
        const users = await knex("users").select("id", "user_name", "email", "created_at");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: `Error fetching users: ${error.message}` });
    }
};

export const getUserProfile = async (req, res) => {
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

export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;  
        const { user_name, email } = req.body;

        await knex("users").where("id", userId).update({ user_name, email });

        res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
        res.status(500).json({ error: `Error updating profile: ${error.message}` });
    }
};
