import React, { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import axios from "axios";
import "./Report.scss"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Report = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [durationType, setDurationType] = useState("weekly"); // Default to "weekly"
  const [startDate, setStartDate] = useState(null); // For custom range
  const [endDate, setEndDate] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); // To display error messages
  const [chartType, setChartType] = useState("line"); // Default to "line"

    
  // Map moods to numerical values
  const moodScores = {
    happy: 3,
    neutral: 2,
    sad: 1,
    stressed: 0,
  };

  // Map numerical values back to mood strings
  const numberToMood = {
    0: "Stressed",
    1: "Sad",
    2: "Neutral",
    3: "Happy",
  };
  const onCancel = () => {
    navigate("/"); // Navigate to /moods or use "/" for homepage
  };

  const fetchReports = async (start, end) => {
    try {
      console.log("Fetching data with params:", {
        startDate: start,
        endDate: end,
        user_id: 1,
      });

      // Make GET request to fetch data with optional filters
      const response = await axios.get("http://localhost:8080/reports", {
        params: { startDate: start, endDate: end, user_id: 1 },
      });
      console.log("API Response:", response.data);

      const data = response.data;

      // If no data is returned, reset chartData and display a message
      if (
        data.length === 0 ||
        data.message === "No reports found for this user."
      ) {
        setChartData({ labels: [], datasets: [] });
        setErrorMessage("No reports found for the selected duration.");
        return;
      }

      // Transform data for chart
      const labels = data.map((report) => {
        const { start_date, end_date } = report.report_data.time_period;
        return `${new Date(start_date).toLocaleDateString()} - ${new Date(
          end_date
        ).toLocaleDateString()}`;
      });

      console.log("Labels Array:", labels);

      // Extract mood trends data and map to numerical values
      const moods = data.map((report) => {
        const mood = report.report_data.most_common_mood;
        return moodScores[mood] || 0; // Default to 0 if mood is unexpected
      });

      console.log("Numerical Moods Array:", moods);

      setChartData({
        labels,
        datasets: [
          {
            label: "Mood Over Time",
            data: moods,
            borderColor: "#8B4CFC", // Line color
            backgroundColor: "rgba(139, 76, 252, 0.2)", // Fill color for Line Chart
            fill: chartType === "line", // Fill area under the line only for Line Chart
            tension: 0.4, // Smooth the line
          },
        ],
      });
      setErrorMessage(""); // Clear any previous error messages
    } catch (error) {
      console.error(
        "Error fetching reports:",
        error.response?.data || error.message
      );
      setChartData({ labels: [], datasets: [] }); // Reset chart data on error
      setErrorMessage("Failed to fetch reports. Please try again later.");
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
    <div className="reports__container">
      <h3>Vibes Chart</h3>

      {/* Chart Type Selector */}
      <div className="reports__durationPicker">
        <label>Select Chart Type:</label>
        <select
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
        >
          <option value="line">Line Chart</option>
          <option value="bar">Bar Chart</option>
        </select>
      </div>

      {/* Duration Picker */}
      <div className="reports__durationPicker">
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
        <div className="reports__customDatePicker">
          <label className="reports__datePickerLabel">Start Date:</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            placeholderText="Select start date"
          />
          <label className="reports__datePickerLabel">End Date:</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            placeholderText="Select end date"
          />
          <button
            className="reports__applyButton"
            onClick={handleApplyCustomRange}
          >
            Apply
          </button>
        </div>
      )}

      {/* Chart */}
      <div className="reports__chartContainer">
        {chartData.labels && chartData.labels.length > 0 ? (
          chartType === "line" ? (
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: { title: { display: true, text: "Time Period" } },
                  y: {
                    title: { display: true, text: "Mood" },
                    min: 0,
                    max: 5,
                    ticks: {
                      callback: (value) => numberToMood[value],
                    },
                  },
                },
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const label = context.dataset.label || "";
                        const value = context.raw;
                        return `${label}: ${numberToMood[value]}`;
                      },
                    },
                  },
                },
              }}
            />
          ) : (
            <Bar
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: { title: { display: true, text: "Time Period" } },
                  y: {
                    title: { display: true, text: "Mood" },
                    min: 0,
                    max: 5,
                    ticks: {
                      callback: (value) => numberToMood[value],
                    },
                  },
                },
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const label = context.dataset.label || "";
                        const value = context.raw;
                        return `${label}: ${numberToMood[value]}`;
                      },
                    },
                  },
                },
              }}
            />
          )
        ) : (
          <p className="reports__errorMessage">
            {errorMessage || "No data available for the selected duration."}
          </p>
        )}
      </div>
    </div>
  );
};

export default Report;
