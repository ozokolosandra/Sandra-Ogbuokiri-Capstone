import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);

// Hugging Face API configuration
const HF_API_URL = process.env.HF_API_URL;
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
};

// Analyze sentiment using Hugging Face API
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
        await new Promise((resolve) => setTimeout(resolve, 5000));
        return analyzeSentimentHF(text, retries - 1);
      }

      const errorDetails = await response.text();
      console.error("Error response from Hugging Face!:", errorDetails);
      throw new Error("Failed sentiment analysis request");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching from Hugging Face:", error);
    return [{ label: "Neutral", score: 0.5 }];
  }
}

// Infer mood using keywords
const inferMoodFromKeywords = (text) => {
  const lowerCaseText = text.toLowerCase();
  for (const [mood, keywords] of Object.entries(moodKeywords)) {
    if (keywords.some((keyword) => lowerCaseText.includes(keyword))) {
      return mood;
    }
  }
  return null;
};

// Categorize sentiment using Hugging Face result
const categorizeSentiment = (hfResult, text) => {
  const inferredMood = inferMoodFromKeywords(text);
  if (inferredMood) return inferredMood;

  if (
    !Array.isArray(hfResult) ||
    hfResult.length === 0 ||
    !Array.isArray(hfResult[0])
  ) {
    return "Neutral";
  }

  const sentimentData = hfResult[0];
  const positive = sentimentData.find((item) => item.label === "POSITIVE");
  const negative = sentimentData.find((item) => item.label === "NEGATIVE");

  if (!positive || !negative) return "Neutral";

  if (positive.score >= 0.9) return "Very Happy";
  if (positive.score >= 0.75) return "Happy";
  if (negative.score >= 0.9) return "Very Sad";
  if (negative.score >= 0.75) return "Sad";

  return "Neutral";
};

// Default uplifting messages
const defaultMessages = {
  "Very Happy": "You're on top of the world! Keep shining!",
  Happy: "Keep smiling and spreading joy!",
  Neutral: "Stay positive and take things one step at a time.",
  Sad: "It's okay to feel down sometimes. Tomorrow is a new day.",
  "Very Sad": "Things will get better. You're stronger than you think.",
  Confident: "You are unstoppable! Keep believing in yourself.",
  Excited: "This is just the beginning of something amazing!",
  Remorseful: "It’s okay to make mistakes. Learn and grow from them.",
  Lonely: "You are never truly alone. Reach out to someone who cares.",
  Stressed: "Take a deep breath. You’ve got this!",
  Hopeful: "Great things are coming your way. Stay positive!",
};

// Create a new mood entry
const createMood = async (req, res) => {
  try {
    const { mood_text, user_id, date } = req.body; // Expect `date` from the frontend

    if (!mood_text || !user_id || !date) {
      return res
        .status(400)
        .json({ error: "mood_text, user_id, and date are required!" });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format." });
    }

    const hfResult = await analyzeSentimentHF(mood_text);
    const mood_category = categorizeSentiment(hfResult, mood_text);

    const upliftingMessageRecord = await knex("uplifting_messages")
      .where("mood_category", mood_category)
      .first();

    if (!upliftingMessageRecord) {
      const defaultMessage = defaultMessages[mood_category] || "Stay positive!";
      await knex("uplifting_messages").insert({
        mood_category,
        message: defaultMessage,
      });
    }

    const [newMoodId] = await knex("mood").insert({
      mood_text,
      mood_category,
      user_id,
      created_at: parsedDate,
      updated_at: knex.fn.now(),
    });

    const newMood = await knex("mood").where("id", newMoodId).first();
    const updatedUpliftingMessageRecord = await knex("uplifting_messages")
      .where("mood_category", mood_category)
      .first();

    const uplifting_message =
      updatedUpliftingMessageRecord?.message || defaultMessages[mood_category];

    res.status(201).json({ ...newMood, uplifting_message });
  } catch (error) {
    console.error("Error creating mood:", error);
    res.status(500).json({ error: `An error occurred: ${error.message}` });
  }
};
const getAllMoods = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: "User ID is missing or invalid." });
    }

    const userId = req.user.id;

    const moods = await knex("mood")
      .select(
        "mood.id",
        "mood.mood_text",
        "mood.mood_category",
        "mood.user_id",
        "uplifting_messages.message as uplifting_message"
      )
      .leftJoin(
        "uplifting_messages",
        "mood.mood_category",
        "uplifting_messages.mood_category"
      )
      .where("mood.user_id", userId);

    res.status(200).json(moods);
  } catch (error) {
    console.error("Error retrieving moods:", error);
    res.status(500).json({ error: `Error retrieving moods: ${error.message}` });
  }
};

export { getAllMoods, createMood };
