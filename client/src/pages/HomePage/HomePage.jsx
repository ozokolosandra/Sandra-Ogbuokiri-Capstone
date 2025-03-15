import React, { useEffect } from "react";
import Header from "../../components/Header/Header";
import axios from "axios";
import AddVibes from "../../components/AddVibes/AddVibes";
import { useNavigate } from "react-router-dom";  // Import useNavigate

function HomePage({ name }) {
  const navigate = useNavigate();  // Get the navigate function

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

  return (
    <div>
      <Header name={name} />
      <AddVibes onCancel={() => navigate("/moods")} />
      {/* user={currentUser} */}
    </div>
  );
}

export default HomePage;
