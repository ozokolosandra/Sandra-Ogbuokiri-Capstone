import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);

const getMoodTrends = async (req, res) => {
    try {
      const { start_date, end_date } = req.query;
  
      // Validate date format (YYYY-MM-DD)
      const isValidDate = (date) => /^\d{4}-\d{2}-\d{2}$/.test(date);
      if (!start_date || !end_date || !isValidDate(start_date) || !isValidDate(end_date)) {
        return res.status(400).json({ error: "Invalid date format. Use YYYY-MM-DD." });
      }
  
      console.log("Start Date:", start_date, "End Date:", end_date); // Log the query params
  
      // Query the database to get moods within the specified time range
      const moodsInTimePeriod = await knex("mood")
    .select("mood_category")
    .whereBetween("created_at", ['2025-03-01', '2025-03-20'])
    .groupBy("mood_category")
    .count("id AS count");
  
  
      console.log("SQL Query Result:", moodsInTimePeriod); // Log the result from the query
  
      // If no results returned
      if (moodsInTimePeriod.length === 0) {
        console.log("No moods found within the given time period.");
      }
  
      const moodTrends = moodsInTimePeriod.reduce((acc, { mood_category, count }) => {
        acc[mood_category] = count;
        return acc;
      }, {});
  
      // Send the response with mood trends and time period
      res.status(200).json({ mood_trends: moodTrends, time_period: { start_date, end_date } });
  
    } catch (error) {
      console.error("Error fetching mood trends:", error);
      res.status(500).json({ error: "An error occurred while fetching mood trends." });
    }
  };
  export  { getMoodTrends };
  