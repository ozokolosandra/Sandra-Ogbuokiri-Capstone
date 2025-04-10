import React, { forwardRef } from "react";
import { Bar, Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import { useEffect } from "react";

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
  TimeScale
);

const Chart = forwardRef((props, ref) => {
  const { chartType, chartData, numberToMood } = props;

  useEffect(() => {
    return () => {
      if (ref.current) {
        ref.current.chartInstance?.destroy();
      }
    };
  }, [chartData, chartType]);

  if (!chartData.datasets || chartData.datasets.length === 0) {
    return <p>No data available for the chart.</p>;
  }

  // Line chart options
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
          tooltipFormat: "MMM dd",
          displayFormats: { day: "MMM dd" },
        },
        title: {
          display: true,
          text: "Date",
          font: {
            family: "Outfit",
            size: 16,
            weight: "bold",
            color: "#000000",
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Mood Count",
          font: {
            family: "Outfit",
            size: 16,
            weight: "bold",
            color: "#000000",
          },
        },
        min: 0,
        max: 7,
        ticks: { stepSize: 1 },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          usePointStyle: true, 
          pointStyle: "rectRounded", 
          padding: 15, 
          boxWidth: 30, 
          boxHeight: 20, 
          borderRadius: 5, 
          borderWidth: 1, 
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label || ""}: ${context.raw}`,
        },
      },
    },
  };

  const updatedChartData = {
    ...chartData,
    datasets: chartData.datasets.map((dataset) => ({
      ...dataset,
      borderColor: "#000000",
      backgroundColor: dataset.borderColor,
      fill: false,
      borderWidth:1
    })),
  };

  // Bar chart options
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: { display: true, text: "Vibes" ,font: {
          family: 'Outfit', 
          size: 16,
          weight: 'bold',
          color:'#000000'
        } },
        barThickness: 20,
        categoryPercentage: 0.3,
      },
      y: {
        title: { display: true, text: "Frequency of Vibes",font: {
          family: 'Outfit', 
          size: 16,
          weight: 'bold',
          color:'#000000'
        }},
        min: 0,
        max: 10,
        ticks: {
          callback: (value) => numberToMood[value] || value,
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) =>
            `${context.dataset.label || ""}: ${
              numberToMood[context.raw] || context.raw
            }`,
        },
      },
    },
  };

  return (
    <div className="report__chart">
      {chartType === "bar" ? (
        <Bar ref={ref} data={chartData} options={barChartOptions} />
      ) : (
        <Line ref={ref} data={updatedChartData} options={lineChartOptions} />
      )}
    </div>
  );
});

export default Chart;
