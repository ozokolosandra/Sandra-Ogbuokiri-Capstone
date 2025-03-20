import React, { useEffect, useState, useRef, forwardRef } from "react";
import axios from "axios";
import "./Report.scss";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Chart from "../Chart/Chart";
import downloadIcon from "../../assets/images/download.svg";

const Report = forwardRef((props, ref) => {
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
    console.log("Fetching reports for:", { start, end, user_id });

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

      // Ensure mood_trends is an object
      if (typeof mood_trends !== "object" || mood_trends === null) {
        throw new Error("Invalid mood_trends data");
      }

      // Transform mood_trends into an array of { mood_category, count }
      const moodData = Object.entries(mood_trends).map(([mood_category, count]) => ({
        mood_category,
        count,
      }));

      console.log("Mood Data:", moodData);

      if (moodData.length > 0) {
        const labels = moodData.map((mood) => mood.mood_category);
        const counts = moodData.map((mood) => mood.count);
        console.log("Mood Categories:", moodData.map((mood) => mood.mood_category));

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
        setErrorMessage(""); // Clear error message
      } else {
        setErrorMessage("No mood data available for the selected duration.");
        setChartData({ labels: [], datasets: [] }); // Clear chart data
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      setErrorMessage("Failed to fetch reports. Please try again.");
      setChartData({ labels: [], datasets: [] }); // Clear chart data on error
    }
  };

  const handleApplyCustomRange = () => {
    if (startDate && endDate) {
      const formattedStartDate = startDate.toISOString().split("T")[0];
      const formattedEndDate = endDate.toISOString().split("T")[0];
      fetchReports(formattedStartDate, formattedEndDate);
    }
  };

  useEffect(() => {
    console.log("useEffect triggered for:", { durationType, startDate, endDate });

    if (durationType === "weekly") {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 7);
      fetchReports(start.toISOString().split("T")[0], end.toISOString().split("T")[0]);
    } else if (durationType === "monthly") {
      const end = new Date();
      const start = new Date();
      start.setMonth(end.getMonth() - 1);
      fetchReports(start.toISOString().split("T")[0], end.toISOString().split("T")[0]);
    } else if (durationType === "custom" && startDate && endDate) {
      const formattedStartDate = startDate.toISOString().split("T")[0];
      const formattedEndDate = endDate.toISOString().split("T")[0];
      fetchReports(formattedStartDate, formattedEndDate);
    }
  }, [durationType, startDate, endDate]);

  return (
    <div className="report__container">
      <h4>Lets visualize your vibes!</h4>

      {/* Download Button */}
      <button onClick={props.downloadChart} className="download-button">
        <img src={downloadIcon} alt="Download" className="download-icon" />
      </button>

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
          <div className="report__start-date">
            <label className="report__datePickerLabel">Start Date:</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="yyyy-MM-dd"
            />
          </div>

          <div className="report__end-date">
            <label className="report__datePickerLabel">End Date:</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="yyyy-MM-dd"
            />
          </div>
          <button className="report__applyButton" onClick={handleApplyCustomRange}>
            Apply
          </button>
        </div>
      )}
        console.log(`chart length is ${chartData.length}`)
      <div className="report__chartContainer">
        {chartData.labels.length > 0 ? (
          
          
          <Chart ref={ref} chartType={chartType} chartData={chartData} numberToMood={moodColors} />
        ) : (
          <p className="report__errorMessage">{errorMessage || "No data available."}</p>
        
        )
        }
      </div>
    </div>
  );
});

export default Report;