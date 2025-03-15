
import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);

// Hugging Face API configuration
// Note: The endpoint includes the organization/model-name structure.
const HF_API_URL =
  "https://api-inference.huggingface.co/models/distilbert/distilbert-base-uncased-finetuned-sst-2-english";
const HF_API_TOKEN ="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";

// Helper function to call the Hugging Face Inference API for sentiment analysis.
async function analyzeSentimentHF(text) {
  try {
    const response = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${HF_API_TOKEN}`,
      },
      body: JSON.stringify({ inputs: text }),
    });

    if (!response.ok) {
      // Log any error message returned by the API.
      const errorDetails = await response.text();
      console.error("Error response from Hugging Face:", errorDetails);
      throw new Error("Failed sentiment analysis request");
    }

    const result = await response.json();
    return result; // Expected format: [{ label: "POSITIVE", score: 0.98 }, ...]
  } catch (error) {
    console.error("Error fetching from Hugging Face:", error);
    throw error;
  }
}

// Helper to convert the Hugging Face prediction into a mood category.
const categorizeSentiment = (hfResult) => {
    // Ensure the response is in the expected format
    if (!Array.isArray(hfResult) || hfResult.length === 0 || !Array.isArray(hfResult[0])) {
      return "Neutral"; // Default to Neutral if the response is invalid
    }
  
    // Extract the first result (POSITIVE/NEGATIVE with scores)
    const [positive, negative] = hfResult[0];
  
    // Determine the dominant sentiment
    if (positive.label === "POSITIVE" && positive.score >= 0.9) {
      return "Very Happy";
    } else if (positive.label === "POSITIVE" && positive.score >= 0.75) {
      return "Happy";
    } else if (negative.label === "NEGATIVE" && negative.score >= 0.9) {
      return "Very Sad";
    } else if (negative.label === "NEGATIVE" && negative.score >= 0.75) {
      return "Sad";
    } else {
      return "Neutral";
    }
  };

// Get all moods from the database.
const getAllMoods = async (req, res) => {
    try {
      const data = await knex("mood")
        .select(
          "mood.id",
          "mood.mood_text",
          "mood.mood_category",
          "mood.user_id",
          "uplifting_messages.message AS uplifting_message" // Include the message dynamically
        )
        .leftJoin(
          "uplifting_messages",
          "mood.mood_category",
          "uplifting_messages.mood_category"
        );
  
      res.status(200).json(data);
    } catch (error) {
      console.error("Error retrieving moods:", error);
      res.status(400).send(`Error retrieving moods: ${error}`);
    }
  };
  
// Create a new mood entry using sentiment analysis from the Hugging Face API.
const createMood = async (req, res) => {
    try {
      const { mood_text, user_id } = req.body;
  
      // Validate required fields
      if (!mood_text || !user_id) {
        return res.status(400).json({ error: "mood_text and user_id are required!" });
      }
  
      // Analyze sentiment using the Hugging Face API
      const hfResult = await analyzeSentimentHF(mood_text);
      console.log("Hugging Face API Response:", hfResult);
  
      // Categorize the sentiment based on the Hugging Face response
      const mood_category = categorizeSentiment(hfResult);
  
      // Fetch a random uplifting message for the determined mood category
      const upliftingMessage = await knex("uplifting_messages")
        .whereRaw("LOWER(mood_category) = LOWER(?)", [mood_category])
        .orderByRaw("RAND()")
        .first();
  
      const uplifting_message = upliftingMessage
        ? upliftingMessage.message
        : "Stay positive!";
  
      console.log(`Mood Category: ${mood_category}`);
      console.log("Uplifting Message Retrieved:", upliftingMessage);
  
      // Insert the new mood entry into the database
      const [newMoodId] = await knex("mood").insert({
        mood_text,
        mood_category,
        user_id,
      });
  
      // Retrieve the newly inserted mood and include the uplifting message in the response
      const newMood = await knex("mood").where("id", newMoodId).first();
  
      // Add the uplifting_message to the response
      const response = {
        ...newMood,
        uplifting_message, // Attach the uplifting message to the response dynamically
      };
  
      res.status(201).json(response);
    } catch (error) {
      console.error("Error creating mood:", error);
      res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
  };
  
// Get a certain mood entry by its id.
const getMoodById = async (req, res) => {
  try {
    const { id } = req.params;
    const mood = await knex("mood").where("id", id).first();
    if (!mood) {
      return res.status(404).json({ error: "Mood not found." });
    }
    res.status(200).json(mood);
  } catch (error) {
    console.error("Error fetching mood:", error);
    res.status(500).json({ error: `An error occurred: ${error.message}` });
  }
};

export { getAllMoods, createMood, getMoodById };
