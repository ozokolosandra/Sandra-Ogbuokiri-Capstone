import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);

const getMoodTrends = async (req, res) => {
  try {
    const { start_date, end_date, user_id } = req.query;

    // Validate required parameters
    if (!start_date || !end_date || !user_id) {
      return res.status(400).json({ error: "Missing required parameters: start_date, end_date, or user_id." });
    }

    // Validate date format (YYYY-MM-DD) and ensure it's a valid date
    const isValidDate = (date) => {
      const regex = /^\d{4}-\d{2}-\d{2}$/;
      if (!regex.test(date)) return false;

      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime()); // Check if the date is valid
    };

    // Call isValidDate to validate start_date and end_date
    if (!isValidDate(start_date) || !isValidDate(end_date)) {
      return res.status(400).json({ error: "Invalid date format. Use YYYY-MM-DD." });
    }

    console.log("Start Date:", start_date, "End Date:", end_date); // Log the query params

    // Format dates for SQL query
    const startDate = new Date(start_date).toISOString();
    const endDate = new Date(`${end_date}T23:59:59.999Z`).toISOString();

    // Query the database to get moods within the specified time range
    const moodsInTimePeriod = await knex("mood")
      .select("mood_category", "created_at")
      .where("user_id", user_id) // Filter by user_id
      .where("created_at", ">=", startDate) // Start of the day
      .where("created_at", "<=", endDate) // End of the day
      .orderBy("created_at", "asc");

    console.log("SQL Query Result:", moodsInTimePeriod); // Log the result from the query

    // If no results returned
    if (moodsInTimePeriod.length === 0) {
      console.log("No moods found within the given time period.");
    }

    // Group moods by date and category
    const moodTrends = moodsInTimePeriod.reduce((acc, { mood_category, created_at }) => {
      const date = new Date(created_at).toISOString().split("T")[0]; // Use YYYY-MM-DD format
      if (!acc[date]) {
        acc[date] = {};
      }
      if (!acc[date][mood_category]) {
        acc[date][mood_category] = 0;
      }
      acc[date][mood_category] += 1;
      return acc;
    }, {});

    // Send the response with mood trends and time period
    res.status(200).json({ mood_trends: moodTrends, time_period: { start_date, end_date } });

  } catch (error) {
    console.error("Error fetching mood trends:", error.message, error.stack);
    res.status(500).json({ error: "An error occurred while fetching mood trends." });
  }
};

export { getMoodTrends };