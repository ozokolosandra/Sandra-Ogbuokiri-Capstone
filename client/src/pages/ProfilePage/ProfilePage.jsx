import react from "react";
import { useState } from "react";
import "./ProfilePage.scss"
import Header from "../../components/Header/Header";
import Profile from "../../components/Profile/Profile";
import SideNav from "../../components/SideNav/SideNav";

function ProfilePage() {
  const [isSideNavVisible, setIsSideNavVisible] = useState(false);
  const toggleSideNav = () => {
    setIsSideNavVisible(!isSideNavVisible);
  };
  return (
    <>
      <Header toggleSideNav={toggleSideNav} />

      <SideNav
        isSideNavVisible={isSideNavVisible}
        toggleSideNav={toggleSideNav}
      />
      <div className="main-content">
        <Profile />
      </div>
    </>
  );
}

export default ProfilePage;
