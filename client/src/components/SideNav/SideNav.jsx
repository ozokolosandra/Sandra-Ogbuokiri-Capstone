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

const SideNav = ({ isSideNavVisible, toggleSideNav, downloadChart }) => {
  const location = useLocation();

  return (
    <>
      <div
        className={`offcanvas offcanvas-start  ${
          isSideNavVisible ? "show" : ""
        }`}
        id="sidebarMenu"
        tabIndex="-1"
        style={{
          backgroundColor: "#2c3e50", 
          color: "#ffffff", 
        }}
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Navigation</h5>
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
                className={`nav-link text-white ${
                  location.pathname === "/" ? "active bg-primary" : ""
                }`}
              >
                <img src={homeImg} alt="Home" className="me-2" width="24" />
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/profile"
                className={`nav-link text-white ${
                  location.pathname === "/profile" ? "active bg-primary" : ""
                }`}
              >
                <img src={userImg} alt="Profile" className="me-2" width="24" />
                Profile
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/report"
                className={`nav-link text-white ${
                  location.pathname === "/report" ? "active bg-primary" : ""
                }`}
              >
                <img src={reportImg} alt="Reports" className="me-2" width="24" />
                Reports
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/rewards"
                className={`nav-link text-white ${
                  location.pathname === "/rewards" ? "active bg-primary" : ""
                }`}
              >
                <img
                  src={rewardsImg}
                  alt="Rewards"
                  className="me-2"
                  width="24"
                />
                Rewards
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/history"
                className={`nav-link text-white ${
                  location.pathname === "/history" ? "active bg-primary" : ""
                }`}
              >
                <img
                  src={vibeHistoryImg}
                  alt="History"
                  className="me-2"
                  width="24"
                />
                History
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/logout"
                className={`nav-link text-white ${
                  location.pathname === "/logout" ? "active bg-danger" : ""
                }`}
              >
                <img src={logoutImg} alt="Logout" className="me-2" width="24" />
                Logout
              </Link>
            </li>
          </ul>

          {/* Download Button (Only on Report Page) */}
          {location.pathname === "/report" && (
            <button className="btn btn-success mt-3" onClick={downloadChart}>
              <img src={downloadImg} alt="Download" className="me-2" width="24" />
              Download Report
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default SideNav;
