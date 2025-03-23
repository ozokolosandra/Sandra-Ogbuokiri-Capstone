import initKnex from "knex";
import configuration from "../knexfile.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
const knex = initKnex(configuration);
dotenv.config();

// Password validation function
function isValidPassword(password) {
    const minLength = /.{8,}/;
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/;
    const number = /[0-9]/;

    return minLength.test(password) && specialChar.test(password) && number.test(password);
}

const registerUser = async (req, res) => {
    try {
        const { user_name, email, password } = req.body;

        if (!user_name || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        if (!isValidPassword(password)) {
            return res.status(400).json({ error: "Password must be at least 8 characters long, include a number, and a special character." });
        }

        // Check if user exists
        const existingUser = await knex("users").where({ email }).first();
        if (existingUser) {
            return res.status(400).json({ error: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const [newUserId] = await knex("users").insert({ user_name, email, password: hashedPassword });

        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        res.status(500).json({ error: `Error registering user: ${error.message}` });
    }
};
 const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await knex("users").where({ email }).first();
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ message: "Login successful", token , user_name: user.user_name, user_id: user.id });

    } catch (error) {
        res.status(500).json({ error: `Error logging in: ${error.message}` });
    }
};

export {loginUser,registerUser}