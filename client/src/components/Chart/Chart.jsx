import React from "react";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";

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

const Chart = ({ chartType, chartData, numberToMood }) => {
  // Log the chartData and numberToMood props
  console.log("Chart Data:", chartData);
  console.log("Number to Mood Mapping:", numberToMood);

  // Ensure chartData.datasets is defined
  if (!chartData.datasets || chartData.datasets.length === 0) {
    return <p>No data available for the chart.</p>;
  }

  // Line chart specific styling
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { title: { display: true, text: "Time Period" } },
      y: {
        title: { display: true, text: "Mood" },
        min: 0,
        max: 9,
        ticks: {
          callback: (value) => numberToMood[value] || value,
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          family:"Outfit",
          size:14,
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

  // Bar chart specific styling
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: { display: true, text: "Time Period" },
        barThickness: 20,
        categoryPercentage: 0.3,
      },
      y: {
        title: { display: true, text: "Mood" },
        min: 0,
        max: 9,
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
      {chartType === "bar" ? (
        <Bar data={chartData} options={barChartOptions} />
      ) : (
        <Line data={chartData} options={lineChartOptions} />
      )}
    </div>
  );
};

export default Chart;
