import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);

// Hugging Face API configuration
const HF_API_URL =
  "https://api-inference.huggingface.co/models/distilbert/distilbert-base-uncased-finetuned-sst-2-english";
const HF_API_TOKEN = process.env.HF_API_TOKEN;

// Keyword mapping for mood categories
const moodKeywords = {
  Confident: ["confident", "valuable", "proud", "capable"],
  Excited: ["excited", "thrilled", "pumped", "eager"],
  Remorseful: ["remorseful", "regretful", "sorry", "guilty"],
  Lonely: ["lonely", "isolated", "alone", "abandoned"],
  Stressed: ["stressed", "overwhelmed", "anxious", "alarmed"],
  Hopeful: ["hopeful", "optimistic", "positive", "encouraged"],
  Neutral: ["neutral", "indifferent", "okay", "fine"],
  // Add more mood categories and keywords as needed
};

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
    return result;
  } catch (error) {
    console.error("Error fetching from Hugging Face:", error);
    return [{ label: "Neutral", score: 0.5 }]; // Fallback response
  }
}

/**
 * Infers mood from text using keyword matching.
 */
const inferMoodFromKeywords = (text) => {
  const lowerCaseText = text.toLowerCase();
  for (const [mood, keywords] of Object.entries(moodKeywords)) {
    if (keywords.some((keyword) => lowerCaseText.includes(keyword))) {
      return mood; // Return the first matching mood
    }
  }
  return null; // No keyword match found
};

/**
 * Categorizes the sentiment based on Hugging Face response and keyword matching.
 */
const categorizeSentiment = (hfResult, text) => {
  // First, try keyword matching
  const inferredMood = inferMoodFromKeywords(text);
  if (inferredMood) {
    return inferredMood;
  }

  // Fallback to Hugging Face sentiment analysis
  if (!Array.isArray(hfResult) || hfResult.length === 0) {
    return "Neutral"; // Fallback if no result
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
 * Default uplifting messages for each mood category.
 */
const defaultMessages = {
  "Very Happy": "You're on top of the world! Keep shining!",
  "Happy": "Keep smiling and spreading joy!",
  "Neutral": "Stay positive and take things one step at a time.",
  "Sad": "It's okay to feel down sometimes. Tomorrow is a new day.",
  "Very Sad": "Things will get better. You're stronger than you think.",
  "Confident": "You are unstoppable! Keep believing in yourself.",
  "Excited": "This is just the beginning of something amazing!",
  "Remorseful": "It’s okay to make mistakes. Learn and grow from them.",
  "Lonely": "You are never truly alone. Reach out to someone who cares.",
  "Stressed": "Take a deep breath. You’ve got this!",
  "Hopeful": "Great things are coming your way. Stay positive!",
  // Add more default messages as needed
};

/**
 * Creates a new mood entry in the database.
 */
const createMood = async (req, res) => {
  try {
    const { mood_text, user_id } = req.body;

    if (!mood_text || !user_id) {
      return res.status(400).json({ error: "mood_text and user_id are required!" });
    }

    // Analyze sentiment using Hugging Face API
    const hfResult = await analyzeSentimentHF(mood_text);
    console.log("Hugging Face API Response:", hfResult);

    // Categorize mood using combined sentiment analysis and keyword matching
    let mood_category = categorizeSentiment(hfResult, mood_text);

    // Fetch uplifting message from the database or use a default message
    const upliftingMessageRecord = await knex("uplifting_messages")
      .whereRaw("mood_category = ?", [mood_category])
      .orderByRaw("RAND()")
      .first();

    const uplifting_message =
      upliftingMessageRecord?.message?.trim() || defaultMessages[mood_category] || "Stay positive!";

    console.log(`Mood Category: ${mood_category}`);
    console.log("Uplifting Message Retrieved:", uplifting_message);
    console.log("Hugging Face API Response:", hfResult);

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
 * Gets all moods from the database.
 */
const getAllMoods = async (_req, res) => {
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

// Export functions
export { getAllMoods, createMood, getMoodById };