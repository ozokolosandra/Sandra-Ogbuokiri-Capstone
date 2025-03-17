import React, { useState } from "react";
import Report from '../../components/Report/Report';
import Header from '../../components/Header/Header';
import SideNav from '../../components/SideNav/SideNav';
import { useNavigate } from "react-router-dom";  
import "./ReportPage.scss"

function ReportPage() {
  const navigate = useNavigate();
  const [isSidebarActive, setIsSidebarActive] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarActive((prev) => !prev);
  };

  return (
    <div>
      <Header />
      
        <SideNav className="side-nav" isActive={isSidebarActive} toggleSidebar={toggleSidebar} />
        <div className={`report ${isSidebarActive ? "active" : ""}`}>
          <Report className="report-container" />
        </div>
      
    </div>
  );
}

export default ReportPage;
