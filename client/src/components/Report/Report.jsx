import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2"; // Import both Bar and Line
import axios from "axios";
import "./Report.scss";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
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

  const fetchReports = async (start, end) => {
    try {
      const response = await axios.get("http://localhost:8080/reports", {
        params: { startDate: start, endDate: end, user_id: 2 },
      });
      console.log("API Response:", response.data);

      // Ensure we have an array (wrap in array if it's an object)
      let reports = response.data;
      if (!Array.isArray(reports)) {
        reports = [reports];
      }

      // Define mood mapping for all possible mood categories
      const moodMapping = {
        "very sad": 1,
        sad: 2,
        neutral: 3,
        happy: 4,
        "very happy": 5,
        confident: 6,
        triumphant: 7,
        anxious: 8,
        stressed: 9,
      };

      // Transform data for the chart
      const labels = reports.map((report) => {
        const { start_date, end_date } = report.time_period;
        return `${new Date(start_date).toLocaleDateString()} - ${new Date(
          end_date
        ).toLocaleDateString()}`;
      });

      const moods = reports.map((report) => {
        const moodStr = report.most_common_mood.toLowerCase();
        return moodMapping[moodStr] || 0; // Fallback to 0 if undefined
      });

      // Map mood categories to colors
      const backgroundColors = reports.map((report) => {
        const moodStr = report.most_common_mood; // Use the case from the API response
        return moodColors[moodStr] || "#CCCCCC"; // Fallback to gray if undefined
      });

      console.log("Labels Array:", labels);
      console.log("Numerical Moods Array:", moods);
      console.log("Background Colors:", backgroundColors);

      // Update chart data
      setChartData({
        labels,
        datasets: [
          {
            label: "Mood Over Time",
            data: moods,
            backgroundColor: backgroundColors, // Assign colors to each bar
            borderColor: "#FFFFFF", // White border for bars
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
          <div className="report__chart">
            {chartType === "bar" ? (
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
                      max: 9,
                      ticks: {
                        callback: (value) => numberToMood[value],
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      display: true,
                      position: "top",
                      labels: {
                        generateLabels: (chart) => {
                          const datasets = chart.data.datasets;
                          return datasets[0].data.map((value, index) => ({
                            text: numberToMood[value],
                            fillStyle: datasets[0].backgroundColor[index],
                            strokeStyle: datasets[0].borderColor[index],
                            lineWidth: 1,
                            hidden: false,
                            index: index,
                          }));
                        },
                      },
                    },
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
                      max: 9,
                      ticks: {
                        callback: (value) => numberToMood[value],
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      display: true,
                      position: "top",
                      labels: {
                        generateLabels: (chart) => {
                          const datasets = chart.data.datasets;
                          return datasets[0].data.map((value, index) => ({
                            text: numberToMood[value],
                            fillStyle: datasets[0].backgroundColor[index],
                            strokeStyle: datasets[0].borderColor[index],
                            lineWidth: 1,
                            hidden: false,
                            index: index,
                          }));
                        },
                      },
                    },
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
            )}
          </div>
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