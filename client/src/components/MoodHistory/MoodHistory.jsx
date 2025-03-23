import React, { useEffect, useState } from "react";
import "./MoodHistory.scss"; // Your custom CSS

const MoodHistory = () => {
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [flippedCardId, setFlippedCardId] = useState(null); // Track which card is flipped

  // Fetch moods from the backend
  useEffect(() => {
    const fetchMoods = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve the token from storage
        if (!token) {
          throw new Error("No token found. Please log in.");
        }

        const response = await fetch("http://localhost:8080/moods", {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the header
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch moods");
        }

        const data = await response.json();
        setMoods(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMoods();
  }, []);

  // Function to handle card click
  const handleCardClick = (id) => {
    if (flippedCardId === id) {
      setFlippedCardId(null); // Unflip the card if it's already flipped
    } else {
      setFlippedCardId(id); // Flip the clicked card
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="mood_history">
      <h2>Mood History</h2>
      <div className="mood_history__card-container">
        {moods.map((mood) => (
          <div
            className={`mood_history__card ${flippedCardId === mood.id ? "flipped" : ""}`}
            key={mood.id}
            onClick={() => handleCardClick(mood.id)} // Toggle flip on click
          >
            <div className="mood_history__card-front">
              <h5>{mood.mood_category}</h5>
            </div>
            <div className="mood_history__card-back">
                <a>Vibe: {mood.mood_text}</a>
              <span>Uplifting Message: {mood.uplifting_message}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoodHistory;
