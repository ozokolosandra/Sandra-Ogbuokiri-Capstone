import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);

// Hugging Face API configuration
const HF_API_URL =
  "https://api-inference.huggingface.co/models/distilbert/distilbert-base-uncased-finetuned-sst-2-english";
const HF_API_TOKEN = "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";

/**
 * Calls Hugging Face API for sentiment analysis.
 * Retries up to 3 times if the API is down (503 error).
 */
async function analyzeSentimentHF(text, retries = 3) {
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
      if (response.status === 503 && retries > 0) {
        console.log("Hugging Face API unavailable. Retrying in 5 seconds...");
        await new Promise((resolve) => setTimeout(resolve, 5000));
        return analyzeSentimentHF(text, retries - 1);
      }

      const errorDetails = await response.text();
      console.error("Error response from Hugging Face:", errorDetails);
      throw new Error("Failed sentiment analysis request");
    }

    const result = await response.json();
    return result; // Expected format: [[{"label":"POSITIVE","score":0.99},{"label":"NEGATIVE","score":0.01}]]
  } catch (error) {
    console.error("Error fetching from Hugging Face:", error);
    return [{ label: "Neutral", score: 0.5 }]; // Fallback response
  }
}

/**
 * Categorizes the sentiment based on Hugging Face response.
 */
const categorizeSentiment = (hfResult) => {
  if (!Array.isArray(hfResult) || hfResult.length === 0) {
    return "Neutral"; 
  }

  const sentimentData = hfResult[0]; // Extract first array element
  const positive = sentimentData.find((item) => item.label === "POSITIVE");
  const negative = sentimentData.find((item) => item.label === "NEGATIVE");

  if (!positive || !negative) return "Neutral";

  if (positive.score >= 0.9) return "Very Happy";
  if (positive.score >= 0.75) return "Happy";
  if (negative.score >= 0.9) return "Very Sad";
  if (negative.score >= 0.75) return "Sad";
  
  return "Neutral";
};

/**
 * Gets all moods from the database.
 */
const getAllMoods = async (req, res) => {
  try {
    const data = await knex("mood")
      .select(
        "mood.id",
        "mood.mood_text",
        "mood.mood_category",
        "mood.user_id",
        "uplifting_messages.message AS uplifting_message"
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


const defaultMessages = {
  "very happy": "You're on top of the world! Keep shining!",
  "happy": "Keep smiling and spreading joy!",
  "neutral": "Stay positive and take things one step at a time.",
  "sad": "It's okay to feel down sometimes. Tomorrow is a new day.",
  "very sad": "Things will get better. You're stronger than you think.",
};

const createMood = async (req, res) => {
  try {
      const { mood_text, user_id } = req.body;

      if (!mood_text || !user_id) {
          return res.status(400).json({ error: "mood_text and user_id are required!" });
      }

      
      const hfResult = await analyzeSentimentHF(mood_text);
      console.log("Hugging Face API Response:", hfResult);

      // Categorize mood
      let mood_category = categorizeSentiment(hfResult);
      mood_category = mood_category.toLowerCase(); 

      
      const categoryExists = await knex("uplifting_messages")
          .whereRaw("LOWER(mood_category) = LOWER(?)", [mood_category])
          .first();

      if (!categoryExists) {
          console.warn(`Mood category '${mood_category}' does not exist in uplifting_messages. Using fallback.`);
          mood_category = "neutral"; // Fallback to a default lowercase category that exists
      }


      const upliftingMessageRecord = await knex("uplifting_messages")
          .whereRaw("LOWER(mood_category) = LOWER(?)", [mood_category])
          .orderByRaw("RAND()")
          .first();

      const uplifting_message =
          upliftingMessageRecord && upliftingMessageRecord.message && upliftingMessageRecord.message.trim() !== ""
              ? upliftingMessageRecord.message
              : defaultMessages[mood_category] || "Stay positive!"; 

      console.log(`Mood Category: ${mood_category}`);
      console.log("Uplifting Message Retrieved:", uplifting_message);

      // Insert into database
      const [newMoodId] = await knex("mood").insert({
          mood_text,
          mood_category,
          user_id,
      });

      const newMood = await knex("mood").where("id", newMoodId).first();

      res.status(201).json({ ...newMood, uplifting_message });
  } catch (error) {
      console.error("Error creating mood:", error);
      res.status(500).json({ error: `An error occurred: ${error.message}` });
  }
};
/**
 * Gets a single mood entry by ID.
 */
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
