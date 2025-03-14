import "./Header.scss";

function Header({ name }) {
  return (
    <div className="header">
      <h1>VibesRadar</h1>
      <div className="header__title">Welcome {name ? name : "Guest"}</div>
    </div>
  );
}

export default Header;
