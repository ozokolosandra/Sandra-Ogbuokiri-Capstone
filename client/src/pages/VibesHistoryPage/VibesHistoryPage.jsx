import Header from "../../components/Header/Header";
import VibesHistory from "../../components/VibesHistory/VibesHistory";
import { useState } from "react";
import SideNav from "../../components/SideNav/SideNav";

const VibesHistoryPage = () => {
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
      <VibesHistory />
    </div>
  );
};

export default VibesHistoryPage;
