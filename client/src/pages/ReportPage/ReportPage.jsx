import React, { useState, useRef } from "react";
import Report from "../../components/Report/Report";
import Header from "../../components/Header/Header";
import SideNav from "../../components/SideNav/SideNav";
import "./ReportPage.scss";

function ReportPage() {
  const [isSideNavVisible, setIsSideNavVisible] = useState(false); // State to manage SideNav visibility
  const chartRef = useRef(null); // Ref for the chart

  // Toggle SideNav visibility
  const toggleSideNav = () => {
    setIsSideNavVisible(!isSideNavVisible);
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
      {/* Pass toggleSideNav to Header */}
      <Header toggleSideNav={toggleSideNav} />

      {/* Pass isSideNavVisible and toggleSideNav to SideNav */}
      <SideNav
        isSideNavVisible={isSideNavVisible}
        toggleSideNav={toggleSideNav}
        downloadChart={downloadChart} // Pass the download function to SideNav
      />

      {/* Main content area */}
      <div className={`report ${isSideNavVisible ? "active" : ""}`}>
        <Report
          className="report-container"
          chartRef={chartRef} // Pass the ref to Report
        />
      </div>
    </div>
  );
}

export default ReportPage;