import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./SideNav.scss";
import userImg from "../../assets/images/user.svg";
import reportImg from "../../assets/images/reports.svg";
import settingsImg from "../../assets/images/settings.svg";
import homeImg from "../../assets/images/home.svg";
import logoutImg from "../../assets/images/logout.svg";
import rewardsImg from "../../assets/images/rewards.svg";

import vibeHistoryImg from "../../assets/images/moodhistory.svg"

const SideNav = ({ isActive, toggleSidebar }) => {
  const [isSidebarActive, setIsSidebarActive] = useState(false);

  // Renaming the internal function
  const handleSidebarToggle = () => {
    setIsSidebarActive(!isSidebarActive);
  };

  return (
    <div className={`side-nav ${isSidebarActive ? "active" : ""}`}>
     
      

      {/* Navigation Items */}
      <Link to="/" className="side-nav__link">
        <div className="nav-item">
          <img src={homeImg} alt="Home" className="nav-icon" />
          <span className="tooltip tooltip-home">Home</span>
          
        </div>
      </Link>
      <Link to="/profile" className="side-nav__link">
        <div className="nav-item">
          <img src={userImg} alt="User Profile" className="nav-icon" />
          <span className="tooltip tooltip-user">Profile</span>
          
        </div>
      </Link>
      <Link to="/report" className="side-nav__link">
        <div className="nav-item">
          <img src={reportImg} alt="Reports" className="nav-icon" />
          <span className="tooltip tooltip-reports">Reports</span>
          
        </div>
      </Link>
      <Link to="/rewards" className="side-nav__link">
        <div className="nav-item">
          <img src={rewardsImg} alt="Rewards" className="nav-icon" />
          <span className="tooltip tooltip-rewards">Rewards</span>
          
        </div>
      </Link>
      <Link to="/rewards" className="side-nav__link">
        <div className="nav-item">
          <img src={vibeHistoryImg} alt="Rewards" className="nav-icon" />
          <span className="tooltip tooltip-rewards">History</span>
          
        </div>
      </Link>
      <Link to="/settings" className="side-nav__link">
        <div className="nav-item">
          <img src={settingsImg} alt="Settings" className="nav-icon" />
          <span className="tooltip tooltip-settings">Settings</span>
         
        </div>
      </Link>
      <Link to="/logout" className="side-nav__link">
        <div className="nav-item">
          <img src={logoutImg} alt="Logout" className="nav-icon" />
          <span className="tooltip tooltip-logout">Logout</span>
          
        </div>
      </Link>
    </div>
  );
};

export default SideNav;
