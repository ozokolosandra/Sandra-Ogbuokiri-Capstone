import React, { useState, useRef } from "react";
import Report from '../../components/Report/Report';
import Header from '../../components/Header/Header';
import SideNav from '../../components/SideNav/SideNav';
import { useNavigate } from "react-router-dom";
import "./ReportPage.scss";

function ReportPage() {
  const navigate = useNavigate();
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const chartRef = useRef(null); // Ref to access the chart instance

  const toggleSidebar = () => {
    setIsSidebarActive((prev) => !prev);
  };

  // Function to download the chart as an image
  const downloadChart = () => {
    const chart = chartRef.current;

    if (chart) {
      // Convert the chart to a base64 image
      const image = chart.toBase64Image("image/png", 1.0);

      // Create a temporary <a> element to trigger the download
      const link = document.createElement("a");
      link.href = image;
      link.download = "chart.png"; // Set the filename for the downloaded image
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <Header />
      <SideNav
        className="side-nav"
        isActive={isSidebarActive}
        toggleSidebar={toggleSidebar}
        downloadChart={downloadChart} // Pass the download function to SideNav
      />
      <div className={`report ${isSidebarActive ? "active" : ""}`}>
        <Report
          className="report-container"
          chartRef={chartRef} // Pass the ref to Report
        />
      </div>
    </div>
  );
}

export default ReportPage;