import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Report.scss";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Chart from "../Chart/Chart";


const Report = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [durationType, setDurationType] = useState("weekly"); // Default to "weekly"
  const [startDate, setStartDate] = useState(null); // For custom range
  const [endDate, setEndDate] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); // To display error messages
  const [chartType, setChartType] = useState("bar"); // Default to "bar"

  // Map numerical values back to mood strings
  const numberToMood = {
    1: "Very Sad",
    2: "Sad",
    3: "Neutral",
    4: "Happy",
    5: "Very Happy",
    6: "Confident",
    7: "Triumphant",
    8: "Anxious",
    9: "Stressed",
  };

  // Define mood colors
  const moodColors = {
    "Very Sad": "#FF6384", // Red
    Sad: "#36A2EB", // Blue
    Neutral: "#FFCE56", // Yellow
    Happy: "#4BC0C0", // Teal
    "Very Happy": "#9966FF", // Purple
    Confident: "#FF9F40", // Orange
    Triumphant: "#C9CBCF", // Gray
    Anxious: "#FF6F61", // Coral
    Stressed: "#6B5B95", // Lavender
  };

  const fetchReports = async (start, end,user_id) => {
    try {
      const response = await axios.get("http://localhost:8080/reports", {
        params: { startDate: start, endDate: end, user_id: user_id},
      });
      console.log("API Response:", response.data);

      const { mood_trends, time_period } = response.data;

      // Transform mood_trends into an array of { mood_category, count }
      const moodData = Object.entries(mood_trends).map(([mood_category, count]) => ({
        mood_category,
        count,
      }));

      // Create labels and data for the chart
      const labels = moodData.map((mood) => mood.mood_category);
      const counts = moodData.map((mood) => mood.count);

      // Map mood categories to colors
      const backgroundColors = moodData.map((mood) => {
        const moodStr = mood.mood_category;
        return moodColors[moodStr] || "#CCCCCC"; // Default to gray if mood category is undefined
      });

      // Update chart data
      setChartData({
        labels,
        datasets: [
          {
            label: "Mood Over Time",
            data: counts, // Use counts instead of moods for the bar chart
            backgroundColor: backgroundColors,
            borderColor: "#FFFFFF",
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching reports:", error);
      setErrorMessage("Failed to fetch reports. Please try again.");
    }
  };

  const handleApplyCustomRange = () => {
    if (startDate && endDate) {
      fetchReports(startDate.toISOString(), endDate.toISOString());
    }
  };

  useEffect(() => {
    console.log("Fetching data for duration:", durationType);

    if (durationType === "weekly") {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 7); // Last 7 days
      fetchReports(start.toISOString(), end.toISOString());
    } else if (durationType === "monthly") {
      const end = new Date();
      const start = new Date();
      start.setMonth(end.getMonth() - 1); // Last 1 month
      fetchReports(start.toISOString(), end.toISOString());
    } else if (durationType === "custom" && startDate && endDate) {
      fetchReports(startDate.toISOString(), endDate.toISOString());
    }
  }, [durationType, startDate, endDate]);

  return (
    <div className="report__container">
      <h3>Vibes Chart</h3>

      {/* Chart Type Selector */}
      <div className="report__durationPicker">
        <label>Select Chart Type:</label>
        <select
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
        >
          <option value="bar">Bar Chart</option>
          <option value="line">Line Chart</option>
        </select>
      </div>

      {/* Duration Picker */}
      <div className="report__durationPicker">
        <label>Select Duration:</label>
        <select
          value={durationType}
          onChange={(e) => setDurationType(e.target.value)}
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      {/* Custom Date Picker */}
      {durationType === "custom" && (
        <div className="report__customDatePicker">
          <label className="report__datePickerLabel">Start Date:</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            placeholderText="Select start date"
          />
          <label className="report__datePickerLabel">End Date:</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            placeholderText="Select end date"
          />
          <button
            className="report__applyButton"
            onClick={handleApplyCustomRange}
          >
            Apply
          </button>
        </div>
      )}

      {/* Chart */}
      <div className="report__chartContainer">
        {chartData.labels && chartData.labels.length > 0 ? (
          <Chart
            chartType={chartType}
            chartData={chartData}
            numberToMood={numberToMood}
          />
        ) : (
          <p className="report__errorMessage">
            {errorMessage || "No data available for the selected duration."}
          </p>
        )}
      </div>
    </div>
  );
};

export default Report;
