import React, { useState } from "react";
import "./Header.scss";
import menuIcon from "../../assets/images/menu.svg";

const Logo = () => {
  const [isHovered, setIsHovered] = useState(false); // State to track hover

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
        >
          <img src={menuIcon} alt="menu" className="menuImg" />
         
          {isHovered && <span className="header__icon--tooltip">Menu</span>}
        </div>
      </div>
    </>
  );
};

export default Logo;