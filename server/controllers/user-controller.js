import initKnex from "knex";
import validator from "email-validator";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

const getAllUsers = async (req,res)=>{
    try { 
        
        const data = await knex("users").select(
            "id",
            "user_name",
            "email",
            "password",
            
        );
        res.status(200).json(data)
 
        
    } catch (error) {
        res.status(400).send(`Error retrieving moods : ${error}`)
    }
}

const createUsers = async (req, res) => {
    try {
        // Extract user data from the request body
        const { user_name, email, password } = req.body;

        // Validate required fields
        if (!user_name || !email || !password) {
            return res.status(400).json({ error: "All fields are required: user_name, email, password" });
        }

        // Validate email format
        if (!validator.validate(email)) {
            return res.status(400).json({ error: "Invalid email address format." });
        }

        // Insert the new user into the database
        const [newUserId] = await knex("users").insert({
            user_name,
            email,
            password,
        });

        // Fetch the newly created user
        const newUser = await knex("users")
            .where("id", newUserId)
            .first();

        // Return the new user in the response
        res.status(201).json(newUser);
    } catch (error) {
        console.error("Error creating user:", error); // Debugging: log the error
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
};

const getUserById = async (req, res) => {
    try {
        // Extract the user ID from the request parameters
        const { id } = req.params;

        // Fetch the user from the database
        const user = await knex("users")
            .where("id", id)
            .first();

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // Return the user data
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error); // Debugging: log the error
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
};

export {getAllUsers,createUsers,getUserById}