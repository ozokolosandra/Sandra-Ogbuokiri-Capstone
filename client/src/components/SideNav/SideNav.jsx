import React from "react";
import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import userImg from "../../assets/images/user.svg";
import reportImg from "../../assets/images/reports.svg";
import downloadImg from "../../assets/images/download.svg";
import homeImg from "../../assets/images/home.svg";
import logoutImg from "../../assets/images/logout.svg";
import rewardsImg from "../../assets/images/rewards.svg";
import vibeHistoryImg from "../../assets/images/moodhistory.svg";
import "./SideNav.scss"

const SideNav = ({ isSideNavVisible, toggleSideNav, downloadChart }) => {
  const location = useLocation();

  return (
    <>
    <div className="side__nav-canvas">
      <div
        className={`offcanvas offcanvas-start bg-dark ${isSideNavVisible ? "show" : ""}`}
        id="sidebarMenu"
        tabIndex="-1"
        
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Vibes♥Radar</h5>
          <button
            type="button"
            className="btn-close btn-close-white"
            onClick={toggleSideNav}
          ></button>
        </div>
        <div className="offcanvas-body">
          <ul className="nav flex-column">
     
            <li className="nav-item">
              <Link
                to="/"
                className={`nav-link ${
                  location.pathname === "/" ? "active text-black bg-white border-white" : "text-white"
                }`}
              >
                <img
                  src={homeImg}
                  alt="Home"
                  className={`me-2 ${location.pathname === "/" ? "icon-black" : "icon-white"}`}
                />
                Home
              </Link>
            </li>

            
            <li className="nav-item">
              <Link
                to="/profile"
                className={`nav-link ${
                  location.pathname === "/profile" ? "active text-black bg-white border-white" : "text-white"
                }`}
              >
                <img
                  src={userImg}
                  alt="Profile"
                  className={`me-2 ${location.pathname === "/profile" ? "icon-black" : "icon-white"}`}
                />
                Profile
              </Link>
            </li>

            
            <li className="nav-item">
              <Link
                to="/report"
                className={`nav-link ${
                  location.pathname === "/report" ? "active text-black bg-white border-white" : "text-white"
                }`}
              >
                <img
                  src={reportImg}
                  alt="Reports"
                  className={`me-2 ${location.pathname === "/report" ? "icon-black" : "icon-white"}`}
                />
                Reports
              </Link>
            </li>

            
            <li className="nav-item">
              <Link
                to="/rewards"
                className={`nav-link ${
                  location.pathname === "/rewards" ? "active text-black bg-white border-white" : "text-white"
                }`}
              >
                <img
                  src={rewardsImg}
                  alt="Rewards"
                  className={`me-2 ${location.pathname === "/rewards" ? "icon-black" : "icon-white"}`}
                />
                Rewards
              </Link>
            </li>

            
            <li className="nav-item">
              <Link
                to="/history"
                className={`nav-link ${
                  location.pathname === "/history" ? "active text-black bg-white border-white" : "text-white"
                }`}
              >
                <img
                  src={vibeHistoryImg}
                  alt="History"
                  className={`me-2 ${location.pathname === "/history" ? "icon-black" : "icon-white"}`}
                />
                History
              </Link>
            </li>

           
            <li className="nav-item">
              <Link
                to="/logout"
                className={`nav-link ${
                  location.pathname === "/logout" ? "active text-black bg-white border-white" : "text-white"
                }`}
              >
                <img
                  src={logoutImg}
                  alt="Logout"
                  className={`me-2 ${location.pathname === "/logout" ? "icon-black" : "icon-white"}`}
                />
                Logout
              </Link>
            </li>
          </ul>

          <div className="offcanvas-download">
          {location.pathname === "/report" && (
            <button className="btn btn-success mt-3" onClick={downloadChart}>
              <img src={downloadImg} alt="Dobtn btn-success wnload" className="me-2" width="24" />
              Download Report
            </button>
          )}
          </div>
        </div>
      </div>

      
      </div>
    </>
  );
};

export default SideNav;
