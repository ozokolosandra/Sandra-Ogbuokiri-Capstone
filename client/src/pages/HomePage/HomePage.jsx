import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import axios from "axios";
import AddVibes from "../../components/AddVibes/AddVibes";
import { useNavigate } from "react-router-dom";  
import SideNav from "../../components/SideNav/SideNav";
import "./HomePage.scss";

function HomePage({ name }) {
  const navigate = useNavigate();
  const [isSidebarActive, setIsSidebarActive] = useState(false);

  async function fetchMoods() {
    try {
      const response = await axios.get("http://localhost:8080/moods");
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching moods:", error);
    }
  }

  useEffect(() => {
    fetchMoods();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarActive(!isSidebarActive);
  };

  return (
    <div>
      <Header />
      
        <SideNav  />
       
          <AddVibes onCancel={() => navigate("/")} />
        
      </div>
    
  );
}

export default HomePage;
