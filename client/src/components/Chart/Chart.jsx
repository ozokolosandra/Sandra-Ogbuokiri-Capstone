import React, { forwardRef } from "react";
import { Bar, Line } from "react-chartjs-2";
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
  TimeScale,
} from "chart.js";
import "./Chart.scss";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  TimeScale // Add TimeScale for line chart
);

const Chart = forwardRef((props, ref) => {
  const { chartType, chartData, numberToMood } = props;

  // Ensure chartData.datasets is defined
  if (!chartData.datasets || chartData.datasets.length === 0) {
    return <p>No data available for the chart.</p>;
  }

  // Line chart specific styling
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "time", // Use time scale for x-axis
        time: {
          unit: "day", // Group by day
          tooltipFormat: "MMM dd", // Format for tooltips (e.g., "Oct 01")
          displayFormats: {
            day: "MMM dd", // Format for axis labels (e.g., "Oct 01")
          },
        },
        title: { display: true, text: "Date" },
      },
      y: {
        title: { display: true, text: "Mood Count" },
        min: 0,
        ticks: {
          stepSize: 1, // Show whole numbers on y-axis
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || "";
            const value = context.raw;
            return `${label}: ${value}`; // Show mood count in tooltip
          },
        },
      },
    },
  };

  // Update the dataset in chartData to use a black line
  const updatedChartData = {
    ...chartData,
    datasets: chartData.datasets.map((dataset) => ({
      ...dataset,
      borderColor: "#000000", // Set the line color to black
      backgroundColor: dataset.borderColor, // Use mood color for fill (optional)
      fill: false, // Do not fill under the line
    })),
  };

  // Bar chart specific styling
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: { display: true, text: "Vibes" },
        barThickness: 20,
        categoryPercentage: 0.3,
      },
      y: {
        title: { display: true, text: "Frequency of Vibes" },
        min: 0,
        max: 20,
        ticks: {
          callback: (value) => numberToMood[value] || value,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
        position: "top",
        labels: {
          generateLabels: (chart) => {
            const datasets = chart.data.datasets;
            return datasets.map((dataset) => ({
              text: dataset.label || "",
              fillStyle: dataset.backgroundColor,
              strokeStyle: dataset.borderColor,
              lineWidth: 0,
              hidden: !chart.isDatasetVisible(dataset.index),
              index: dataset.index,
            }));
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || "";
            const value = context.raw;
            return `${label}: ${numberToMood[value] || value}`;
          },
        },
      },
    },
  };

  return (
    <div className="report__chart">
      {/* Chart Rendering */}
      {chartType === "bar" ? (
        <Bar ref={ref} data={chartData} options={barChartOptions} />
      ) : (
        <Line ref={ref} data={updatedChartData} options={lineChartOptions} />
      )}
    </div>
  );
});

export default Chart;