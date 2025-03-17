// ChartComponent.jsx
import React from "react";
import { Bar, Line } from "react-chartjs-2"; // Import both Bar and Line
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
  };

  return (
    <div className="report__chart">
      {chartType === "bar" ? (
        <Bar data={chartData} options={barChartOptions} />
      ) : (
        <Line
          data={chartData}
          options={{
            ...lineChartOptions,
            datasets: [
              {
                label: "Mood Over Time",
                data: chartData.datasets[0].data, // Use the same data as before
                backgroundColor: chartData.datasets[0].backgroundColor,
                borderColor: "#800080", // Set the stroke color to purple
                borderWidth: 2,
              },
            ],
          }}
        />
      )}
    </div>
  );
};

export default Chart;
