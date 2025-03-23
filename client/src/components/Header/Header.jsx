import React, { useState } from "react";
import "./Header.scss";
import menuIcon from "../../assets/images/menu.svg";

const Header = ({ toggleSideNav }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <>
      <div className="header">
        <span className="header__title">Vibes♥Radar</span>

        <div
          className="header__icon"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={toggleSideNav}
        >
          <img src={menuIcon} alt="menu" className="menuImg" />

          {isHovered && <span className="header__icon--tooltip">Menu</span>}
        </div>
      </div>
    </>
  );
};

export default Header;
