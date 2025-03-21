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
import "./SideNav.scss";

const SideNav = ({ isSideNavVisible, toggleSideNav, downloadChart }) => {
  const location = useLocation();

  return (
    <>
      <div className="side__nav-canvas">
        <div
          className={`offcanvas offcanvas-start ${isSideNavVisible ? "show" : ""}`}
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
                    location.pathname === "/" ? "active" : ""
                  }`}
                >
                  <img
                    src={homeImg}
                    alt="Home"
                    className="me-2"
                  />
                  Home
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to="/profile"
                  className={`nav-link ${
                    location.pathname === "/profile" ? "active" : ""
                  }`}
                >
                  <img
                    src={userImg}
                    alt="Profile"
                    className="me-2"
                  />
                  Profile
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to="/report"
                  className={`nav-link ${
                    location.pathname === "/report" ? "active" : ""
                  }`}
                >
                  <img
                    src={reportImg}
                    alt="Reports"
                    className="me-2"
                  />
                  Reports
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to="/rewards"
                  className={`nav-link ${
                    location.pathname === "/rewards" ? "active" : ""
                  }`}
                >
                  <img
                    src={rewardsImg}
                    alt="Rewards"
                    className="me-2"
                  />
                  Rewards
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to="/history"
                  className={`nav-link ${
                    location.pathname === "/history" ? "active" : ""
                  }`}
                >
                  <img
                    src={vibeHistoryImg}
                    alt="History"
                    className="me-2"
                  />
                  History
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to="/logout"
                  className={`nav-link ${
                    location.pathname === "/logout" ? "active" : ""
                  }`}
                >
                  <img
                    src={logoutImg}
                    alt="Logout"
                    className="me-2"
                  />
                  Logout
                </Link>
              </li>
            </ul>

            <div className="offcanvas-download">
              {location.pathname === "/report" && (
                <button className="btn download-btn" onClick={downloadChart}>
                  <img src={downloadImg} alt="Download" className="me-2" />
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