import React from 'react';
import './Header.scss'; // Import the SCSS file

const Logo = () => {
  return (
    <div className="header">
      <span className="header__add">Vibes </span>
      <span className="header__heart"> ♥ </span>
      <span className="header__vibes"> Radar</span>
    </div>
  );
};

export default Logo;