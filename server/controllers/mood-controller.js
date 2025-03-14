import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

const getAllMoods = async (req,res)=>{
    try { 
        
        const data = await knex("mood").select(
            "id",
            "mood_text",
            "mood_category",
            "uplifting_message",
            "user_id"
        );
        res.status(200).json(data)
 
        
    } catch (error) {
        res.status(400).send(`Error retrieving moods : ${error}`)
    }
}

const createMood = async (req, res) => {
    try {
        console.log("Received data:", req.body); // Debugging: log request body

        const { mood_text, mood_category, uplifting_message, user_id } = req.body;

        if (!mood_text || !mood_category || !uplifting_message || !user_id) {
            return res.status(400).json({ error: "All fields are required!" });
        }

        const [insertedId] = await knex("mood")
            .insert({
                mood_text,
                mood_category,
                uplifting_message,
                user_id,
            })
            const newMood = await knex("mood")
            .where("id", insertedId)
            .first();

        console.log("Inserted mood:", newMood); 
        res.status(201).json(newMood);
    } catch (error) {
        console.error("Error inserting mood:", error); 
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
};

const getMoodById = async (req, res) => {
    try {
        const { id } = req.params;

        const mood = await knex("mood")
            .where("id", id)
            .first();

        if (!mood) {
            return res.status(404).json({ error: "Mood not found." });
        }

        res.status(200).json(mood);
    } catch (error) {
        console.error("Error fetching mood:", error);
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
};

export {getAllMoods,createMood,getMoodById}