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
    Remorseful:"#ffffff"
  };

  // Function to transform data for bar chart
  const transformDataForBarChart = (mood_trends) => {
    const moodCounts = {};
  
    // Aggregate mood counts across all dates
    Object.values(mood_trends).forEach((moods) => {
      Object.entries(moods).forEach(([mood_category, count]) => {
        moodCounts[mood_category] = (moodCounts[mood_category] || 0) + count;
      });
    });
  
    // Extract mood categories and their counts
    const labels = Object.keys(moodCounts);
    const counts = Object.values(moodCounts);
    const backgroundColors = labels.map((mood) => moodColors[mood] || "#CCCCCC");
  
    return {
      labels,
      datasets: [
        {
          label: "Mood Frequency",
          data: counts,
          backgroundColor: backgroundColors,
          borderColor: "#FFFFFF",
          borderWidth: 1,
        },
      ],
    };
  };

  // Function to transform data for line chart
  const transformDataForLineChart = (mood_trends) => {
    const moodByDate = {};
  
    Object.entries(mood_trends).forEach(([date, moods]) => {
      const formattedDate = new Date(date).toISOString().split("T")[0];
      if (!moodByDate[formattedDate]) {
        moodByDate[formattedDate] = {};
      }
      moods.forEach(({ mood_category, count }) => {
        moodByDate[formattedDate][mood_category] = count;
      });
    });
  
    const labels = Object.keys(moodByDate).sort();
  
    const datasets = Object.keys(moodColors)
      .map((mood) => {
        const data = labels.map((date) => moodByDate[date]?.[mood] || 0);
        const hasData = data.some((count) => count > 0);
        if (!hasData) return null; 
        return {
          label: mood,
          data,
          borderColor: moodColors[mood],
          fill: false,
        };
      })
      .filter(Boolean); 
  
    return {
      labels,
      datasets,
    };
  };
  

  // Function to fetch data for the bar chart
  const fetchBarChartData = async (start, end, user_id) => {
    try {
      // Format dates as YYYY-MM-DD
      const formattedStartDate = new Date(start).toISOString().split("T")[0];
      const formattedEndDate = new Date(end).toISOString().split("T")[0];
  
      console.log("Fetching bar chart data for:", { formattedStartDate, formattedEndDate, user_id });
  
      // Fetch data for bar chart from /reports endpoint
      const response = await axios.get("http://localhost:8080/reports", {
        params: { start_date: formattedStartDate, end_date: formattedEndDate, user_id },
      });
  
      console.log("Bar Chart API Response:", response.data);
  
      const { mood_trends } = response.data;
  
      // Ensure mood_trends is an object
      if (typeof mood_trends !== "object" || mood_trends === null) {
        throw new Error("Invalid mood_trends data");
      }
  
      // Transform data for bar chart
      const transformedData = transformDataForBarChart(mood_trends);
  
      if (transformedData.labels.length > 0) {
        setChartData(transformedData);
        setErrorMessage("");
      } else {
        setErrorMessage("No mood data available for the selected duration.");
        setChartData({ labels: [], datasets: [] });
      }
    } catch (error) {
      console.error("Error fetching bar chart data:", error);
      setErrorMessage("Failed to fetch bar chart data. Please try again.");
      setChartData({ labels: [], datasets: [] });
    }
  };
  // Function to fetch data for the line chart
  const fetchLineChartData = async (start, end, user_id) => {
    try {
      
      if (!user_id) {
        throw new Error("User ID is missing!");
      }
  
     
      if (!start || !end) {
        throw new Error("Start date or end date is missing!");
      }
  
      if (new Date(start) > new Date(end)) {
        throw new Error("Start date must be before end date!");
      }
  
      // Format dates as YYYY-MM-DD
      const formattedStartDate = start; 
      const formattedEndDate = end; 
  
      console.log("Fetching line chart data for:", {
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        user_id,
      });
  
     
      const response = await axios.get("http://localhost:8080/trends", {
        params: { start_date: formattedStartDate, end_date: formattedEndDate, user_id },
      });
  
      console.log("Line Chart API Response:", response.data);
  
      const { mood_trends } = response.data;
  
      // Ensure mood_trends is an object
      if (typeof mood_trends !== "object" || mood_trends === null) {
        throw new Error("Invalid mood_trends data");
      }
  
      // Transform data for line chart
      const transformedData = transformDataForLineChart(mood_trends);
  
      console.log("Transformed Line Chart Data:", transformedData);
  
      if (transformedData.labels.length > 0) {
        setChartData(transformedData);
        setErrorMessage(""); 
      } else {
        setErrorMessage("No mood data available for the selected duration.");
        setChartData({ labels: [], datasets: [] }); 
      }
    } catch (error) {
      console.error("Error fetching line chart data:", error.response?.data || error.message);
      setErrorMessage(`Failed to fetch line chart data: ${error.response?.data?.message || error.message}`);
      setChartData({ labels: [], datasets: [] }); 
    }
  };
  
  const fetchReports = async (start, end) => {
   

    const user_id = localStorage.getItem("user_id");

    if (!user_id) {
      console.error("User ID is missing!");
      setErrorMessage("User ID is missing. Please log in again.");
      return;
    }

    
    if (!start || !end) {
      console.error("Start date or end date is missing!");
      setErrorMessage("Please select a valid date range.");
      return;
    }

    
    if (chartType === "bar") {
      await fetchBarChartData(start, end, user_id);
    } else if (chartType === "line") {
      await fetchLineChartData(start, end, user_id);
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
  }, [durationType, startDate, endDate, chartType]); 

  return (
    <div className="report__container">
      <h4>Lets visualize your vibes!</h4>

     

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

      <div className="report__chartContainer">
        {chartData.labels.length > 0 ? (
          <Chart ref={ref} chartType={chartType} chartData={chartData} numberToMood={moodColors} />
        ) : (
          <p className="report__errorMessage">{errorMessage || "No data available."}</p>
        )}
      </div>
    </div>
  );
});

export default Report;