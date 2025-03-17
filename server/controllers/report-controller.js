import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

const getReport = async (req, res) => {
  try {
    const { user_id, startDate, endDate } = req.query;

    // Validate user_id
    if (!user_id) {
      return res.status(400).json({ error: "User ID is required." });
    }

    // Validate date formats
    const isValidDate = (dateString) => /^\d{4}-\d{2}-\d{2}$/.test(dateString);
    if (startDate && !isValidDate(startDate)) {
      return res.status(400).json({ error: "Invalid start date format. DD-MM-YYYY." });
    }
    if (endDate && !isValidDate(endDate)) {
      return res.status(400).json({ error: "Invalid end date format. Use DD-MM-YYYY." });
    }
    
    let query = knex("mood")
      .select("mood_category", "created_at")
      .where("user_id", user_id);
      console.log(`Received user_id: ${user_id}`);

    if (startDate) query = query.where("created_at", ">=", new Date(startDate));
    if (endDate) query = query.where("created_at", "<=", new Date(endDate));

    const moods = await query;

    // Log the moods array for debugging
    console.log(`Moods: ${JSON.stringify(moods)}`);
    console.log("Final SQL Query:", query.toString());

    // Handle empty mood data
    if (moods.length === 0) {
      return res.status(404).json({ 
        message: `No mood data found for user ID: ${user_id}.`,
      });
    }

    // Aggregate mood data by counting occurrences of each mood_category
    const moodCounts = {};
    moods.forEach(({ mood_category }) => {
      moodCounts[mood_category] = (moodCounts[mood_category] || 0) + 1;
    });

    // Determine the most common mood (handle ties)
    const maxCount = Math.max(...Object.values(moodCounts));
    const mostCommonMoods = Object.keys(moodCounts).filter(
      (mood) => moodCounts[mood] === maxCount
    );
    const mostCommonMood = mostCommonMoods.join(", "); // Join ties with a comma

    
    const reportData = {
      mood_trends: moodCounts,
      most_common_mood: mostCommonMood,
      time_period: {
        start_date: startDate || "No start date provided",
        end_date: endDate || "No end date provided",
      },
    };

    // Log additional info for debugging
    console.log(`User ID: ${user_id}`);
    console.log(`Start Date: ${startDate}`);
    console.log(`End Date: ${endDate}`);
    console.log(`Report Data: ${JSON.stringify(reportData)}`);

    
    
    res.status(200).json(reportData);
  } catch (error) {
    console.error("Error retrieving reports:", { 
      message: error.message, 
      stack: error.stack, 
      query: req.query,
    });
    res.status(500).json({ error: `Error retrieving reports: ${error.message}` });
  }
};
  

const createReport = async (req, res) => {
  try {
    // Extract user_id and report_data from req.body
    const { user_id, report_data } = req.body;

    // Validate required fields
    if (!user_id || !report_data) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Insert the new report
    const [insertedId] = await knex("reports").insert({
      user_id,
      report_data,
    });

    // Fetch the newly inserted report using the inserted ID
    const newReport = await knex("reports").where("id", insertedId).first();

    console.log("Inserted report:", newReport); // Debugging: log the inserted report
    res.status(201).json(newReport); // Send the new report as the response
  } catch (error) {
    console.error("Error inserting report:", error); // Debugging: log the error
    res.status(500).json({ error: `An error occurred: ${error.message}` });
  }
};
const getReportById = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await knex("reports").where("id", id).first();

    if (!report) {
      return res.status(404).json({ error: "Report not found." });
    }

    res.status(200).json(report);
  } catch (error) {
    console.error("Error fetching report:", error);
    res.status(500).json({ error: `An error occurred: ${error.message}` });
  }
};

export { getReportById, getReport, createReport };

// import initKnex from "knex";
// import configuration from "../knexfile.js";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const knex = initKnex(configuration);

// // Initialize Gemini API
// const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // Store this in .env
// const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// // Function to generate insights using Gemini
// const getAIInsights = async (moodCounts, mostCommonMood) => {
//     const moodSummary = JSON.stringify(moodCounts);
//     const prompt = `A user has recorded their mood trends over time: ${moodSummary}.
//     The most common mood is '${mostCommonMood}'. Generate thoughtful, empathetic, and insightful observations on their emotional patterns and suggest strategies to maintain well-being.`;

//     try {
//         const model = genAI.getGenerativeModel({ model: "gemini-pro" });
//         const result = await model.generateContent(prompt);
//         return result.response.text() || "No AI insights available.";
//     } catch (error) {
//         console.error("Error generating AI insights:", error);
//         return "Unable to generate AI insights at this time.";
//     }
// };

// // Get user mood report with AI-generated insights
// const getReport = async (req, res) => {
//     try {
//         const { user_id, startDate, endDate } = req.query;

//         if (!user_id) {
//             return res.status(400).json({ error: "User ID is required." });
//         }

//         // Fetch mood entries within the date range
//         let query = knex("mood")
//             .select("mood_category", "created_at")
//             .where("user_id", user_id);

//         if (startDate) query = query.where("created_at", ">=", new Date(startDate));
//         if (endDate) query = query.where("created_at", "<=", new Date(endDate));

//         const moods = await query;

//         if (moods.length === 0) {
//             return res.status(404).json({ message: "No mood data found for this user." });
//         }

//         // Aggregate mood data
//         const moodCounts = {};
//         moods.forEach(({ mood_category }) => {
//             moodCounts[mood_category] = (moodCounts[mood_category] || 0) + 1;
//         });

//         // Determine most common mood
//         const mostCommonMood = Object.keys(moodCounts).reduce((a, b) =>
//             (moodCounts[a] > moodCounts[b] ? a : b), null);

//         // Generate AI-powered insights
//         const aiInsights = await getAIInsights(moodCounts, mostCommonMood);

//         // Construct report data
//         const reportData = {
//             mood_trends: moodCounts,
//             most_common_mood: mostCommonMood,
//             ai_insights: aiInsights,
//             time_period: {
//                 start_date: startDate || "No start date provided",
//                 end_date: endDate || "No end date provided",
//             }
//         };

//         // Insert report data into the reports table
//         await knex("reports").insert({
//             user_id: user_id,
//             report_data: JSON.stringify(reportData),
//         });

//         res.status(200).json(reportData);
//     } catch (error) {
//         console.error("Error retrieving reports:", error);
//         res.status(500).json({ error: `Error retrieving reports: ${error.message}` });
//     }
// };
