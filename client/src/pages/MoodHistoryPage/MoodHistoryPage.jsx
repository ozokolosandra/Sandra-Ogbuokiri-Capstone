import Header from "../../components/Header/Header";
import MoodHistory from "../../components/MoodHistory/MoodHistory";
import { useState } from "react";
import SideNav from "../../components/SideNav/SideNav";

const MoodHistoryPage = () => {
    const [isSideNavVisible, setIsSideNavVisible] = useState(false); 
    const toggleSideNav = () => {
        setIsSideNavVisible(!isSideNavVisible);
      };
  return (
    <div>
      <Header toggleSideNav={toggleSideNav} />

      <SideNav
        isSideNavVisible={isSideNavVisible}
        toggleSideNav={toggleSideNav}
      />
      <MoodHistory />
    </div>
  );
};

export default MoodHistoryPage;
