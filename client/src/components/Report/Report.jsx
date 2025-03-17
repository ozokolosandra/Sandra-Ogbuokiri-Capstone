import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Report.scss";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Chart from "../Chart/Chart";

const Report = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [durationType, setDurationType] = useState("weekly");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [chartType, setChartType] = useState("bar");

  // Retrieve user details from localStorage
  const user_id = localStorage.getItem("user_id");
  const user_name = localStorage.getItem("user_name");

  // Mood colors mapping
  const moodColors = {
    "Very Sad": "#FF6384",
    Sad: "#36A2EB",
    Neutral: "#FFCE56",
    Happy: "#4BC0C0",
    "Very Happy": "#9966FF",
    Confident: "#FF9F40",
    Triumphant: "#C9CBCF",
    Anxious: "#FF6F61",
    Stressed: "#6B5B95",
  };

  const fetchReports = async (start, end) => {
    console.log(user_id);
    
    if (!user_id) {
      console.error("User ID is missing!");
      setErrorMessage("User ID is missing. Please log in again.");
      return;
    }

    try {
      const response = await axios.get("http://localhost:8080/reports", {
        params: { startDate: start, endDate: end, user_id },
      });

      console.log("API Response:", response.data);

      const { mood_trends } = response.data;
      const moodData = Object.entries(mood_trends).map(([mood_category, count]) => ({
        mood_category,
        count,
      }));

      const labels = moodData.map((mood) => mood.mood_category);
      const counts = moodData.map((mood) => mood.count);
      const backgroundColors = labels.map((mood) => moodColors[mood] || "#CCCCCC");

      setChartData({
        labels,
        datasets: [
          {
            label: "Mood Over Time",
            data: counts,
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
      // Format dates as 'YYYY-MM-DD'
      const formattedStartDate = startDate.toISOString().split('T')[0];
      const formattedEndDate = endDate.toISOString().split('T')[0];
      
      fetchReports(formattedStartDate, formattedEndDate);
    }
  };

  useEffect(() => {
    if (durationType === "weekly") {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 7);
      
      fetchReports(start.toISOString().split('T')[0], end.toISOString().split('T')[0]);
    } else if (durationType === "monthly") {
      const end = new Date();
      const start = new Date();
      start.setMonth(end.getMonth() - 1);
      
      fetchReports(start.toISOString().split('T')[0], end.toISOString().split('T')[0]);
    } else if (durationType === "custom" && startDate && endDate) {
      const formattedStartDate = startDate.toISOString().split('T')[0];
      const formattedEndDate = endDate.toISOString().split('T')[0];
      
      fetchReports(formattedStartDate, formattedEndDate);
    }
  }, [durationType, startDate, endDate]);

  return (
    <div className="report__container">
      <h3>Vibes Chart for {user_name}</h3>

      <div className="report__durationPicker">
        <label>Select Chart Type:</label>
        <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
          <option value="bar">Bar Chart</option>
          <option value="line">Line Chart</option>
        </select>
      </div>

      <div className="report__durationPicker">
        <label>Select Duration:</label>
        <select value={durationType} onChange={(e) => setDurationType(e.target.value)}>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      {durationType === "custom" && (
        <div className="report__customDatePicker">
          <label className="report__datePickerLabel">Start Date:</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="yyyy-MM-dd"  // Ensures the correct format
          />
          <label className="report__datePickerLabel">End Date:</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="yyyy-MM-dd"  // Ensures the correct format
          />
          <button className="report__applyButton" onClick={handleApplyCustomRange}>
            Apply
          </button>
        </div>
      )}

      <div className="report__chartContainer">
        {chartData.labels.length > 0 ? (
          <Chart chartType={chartType} chartData={chartData} />
        ) : (
          <p className="report__errorMessage">{errorMessage || "No data available."}</p>
        )}
      </div>
    </div>
  );
};

export default Report;
