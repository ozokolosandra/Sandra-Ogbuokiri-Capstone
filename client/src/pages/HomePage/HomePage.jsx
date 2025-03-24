import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import AddVibes from "../../components/AddVibes/AddVibes";
import { useNavigate } from "react-router-dom";
import SideNav from "../../components/SideNav/SideNav";
import "./HomePage.scss";

function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSideNavVisible, setIsSideNavVisible] = useState(false);

  const toggleSideNav = () => {
    setIsSideNavVisible((prev) => {
      return !prev;
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user_id = localStorage.getItem("user_id");
    const user_name = localStorage.getItem("user_name");

    if (!token) {
      navigate("/login");
      return;
    }

    if (user_id && user_name) {
      setUser({ id: user_id, user_name });
    }
  }, [navigate]);

  const handleCancel = () => {};

  return (
    <div>
      <Header toggleSideNav={toggleSideNav} />
      <SideNav
        isSideNavVisible={isSideNavVisible}
        toggleSideNav={toggleSideNav}
      />

      {user ? (
        <AddVibes user={user} onCancel={handleCancel} />
      ) : (
        <p>Please log in to add vibes.</p>
      )}
    </div>
  );
}

export default HomePage;
