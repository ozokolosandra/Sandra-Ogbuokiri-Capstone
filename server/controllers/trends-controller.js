import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);

const getMoodTrends = async (req, res) => {
  try {
    const { start_date, end_date, user_id } = req.query;

    if (!start_date || !end_date || !user_id) {
      return res.status(400).json({ error: "Missing required parameters: start_date, end_date, or user_id." });
    }

    const isValidDate = (date) => {
      const regex = /^\d{4}-\d{2}-\d{2}$/;
      
      return regex.test(date) && !isNaN(new Date(date).getTime());
      
      
    };

    if (!isValidDate(start_date) || !isValidDate(end_date)) {
      return res.status(400).json({ error: "Invalid date format. Use YYYY-MM-DD." });
    }

    if (new Date(start_date) > new Date(end_date)) {
      return res.status(400).json({ error: "start_date cannot be later than end_date." });
    }


    // Query using SQL aggregation for efficiency
    const moodTrends = await knex("mood")
      .select(knex.raw("DATE(created_at) as date, mood_category, COUNT(*) as count"))
      .where("user_id", user_id)
      .whereBetween("created_at", [`${start_date} 00:00:00`, `${end_date} 23:59:59`])
      .groupBy("date", "mood_category")
      .orderBy("date", "asc");

    if (moodTrends.length === 0) {
      return "No moods found within the given time period.";
    }

    // Reformat data to match the desired response
    const formattedTrends = moodTrends.reduce((acc, { date, mood_category, count }) => {
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push({ mood_category, count });
      return acc;
    }, {});
    
    const flattenedTrends = Object.entries(formattedTrends).flatMap(([date, moods]) => {
      return moods.map(({ mood_category, count }) => ({
        date,
        mood_category,
        count,
      }));
    });
    
    
    res.status(200).json({ mood_trends: formattedTrends, time_period: { start_date, end_date } });

  } catch (error) {
    console.error("Error fetching mood trends:", error.message);
    res.status(500).json({ error: "An error occurred while fetching mood trends." });
  }
};

export { getMoodTrends };
