import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./SideNav.scss";
import userImg from "../../assets/images/user.svg";
import reportImg from "../../assets/images/reports.svg";
import downloadImg from "../../assets/images/download.svg";
import homeImg from "../../assets/images/home.svg";
import logoutImg from "../../assets/images/logout.svg";
import rewardsImg from "../../assets/images/rewards.svg";
import vibeHistoryImg from "../../assets/images/moodhistory.svg";

const SideNav = ({ isActive, toggleSidebar, downloadChart }) => {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const location = useLocation(); // Get the current location

  const handleSidebarToggle = () => {
    setIsSidebarActive(!isSidebarActive);
  };

  return (
    <div className="nav-container">
      <div className={`side-nav ${isSidebarActive ? "active" : ""}`}>
        {/* Navigation Items */}
        <Link to="/" className={`side-nav__link ${location.pathname === "/" ? "active" : ""}`}>
          <div className="nav-item">
            <img src={homeImg} alt="Home" className="nav-icon" />
            <span className="tooltip tooltip-home">Home</span>
          </div>
        </Link>
        <Link to="/profile" className={`side-nav__link ${location.pathname === "/profile" ? "active" : ""}`}>
          <div className="nav-item">
            <img src={userImg} alt="User Profile" className="nav-icon" />
            <span className="tooltip tooltip-user">Profile</span>
          </div>
        </Link>
        <Link to="/report" className={`side-nav__link ${location.pathname === "/report" ? "active" : ""}`}>
          <div className="nav-item">
            <img src={reportImg} alt="Reports" className="nav-icon" />
            <span className="tooltip tooltip-reports">Reports</span>
          </div>
        </Link>
        <Link to="/rewards" className={`side-nav__link ${location.pathname === "/rewards" ? "active" : ""}`}>
          <div className="nav-item">
            <img src={rewardsImg} alt="Rewards" className="nav-icon" />
            <span className="tooltip tooltip-rewards">Rewards</span>
          </div>
        </Link>
        <Link to="/history" className={`side-nav__link ${location.pathname === "/history" ? "active" : ""}`}>
          <div className="nav-item">
            <img src={vibeHistoryImg} alt="History" className="nav-icon" />
            <span className="tooltip tooltip-rewards">History</span>
          </div>
        </Link>
        <Link to="/logout" className={`side-nav__link ${location.pathname === "/logout" ? "active" : ""}`}>
          <div className="nav-item">
            <img src={logoutImg} alt="Logout" className="nav-icon" />
            <span className="tooltip tooltip-logout">Logout</span>
          </div>
        </Link>

        {/* Conditionally render the download icon */}
        {location.pathname === "/report" && (
          <div className="download-icon">
          <div className="nav-item" onClick={downloadChart}>
            <img src={downloadImg} alt="Download" className="nav-icon" />
            <span className="tooltip tooltip-logout">Download</span>
          </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideNav;