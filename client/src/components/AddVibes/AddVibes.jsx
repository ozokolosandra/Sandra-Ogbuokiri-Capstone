import React, { useState } from "react";
import axios from "axios";
import "./AddVibes.scss"

function AddVibes({ user, onCancel }) {
  const [date, setDate] = useState("");
  const [moodText, setMoodText] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    
    if (!date || !moodText) {
      alert("Please select a date and enter your mood.");
      return;
    }

    console.log("Form submitted, logging mood...");

    try {
      const response = await axios.post("http://localhost:8080/moods", {
        mood_text: moodText,
        date: date,
        user_id:2   
      });

      console.log("Mood added:", response.data);
      alert("Mood added successfully!");
      setMoodText("");
      setDate("");
    } catch (error) {
      console.error("Error adding mood:", error);
      alert("Failed to add mood. Please try again.");
    }
  }

  return (
    <div className="vibes">
      <h2 className="vibes__header">Hello</h2>

      <form onSubmit={handleSubmit} className="form__vibes">
        {/* Date Picker */}
        <label className="vibes__info">
          <span className="vibes__info__date">Select Date:</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        {/* Mood Textarea */}
        <label className="vibes">
          <span className="vibes__input">How are you feeling today?</span>
          <textarea
            value={moodText}
            onChange={(e) => setMoodText(e.target.value)}
            rows="4"
            placeholder="Describe your mood..."
            className="vibes__mood__input"
          />
        </label>

        {/* Buttons */}
        <div className="vibes__button">
          <button
            type="submit"
            className="submit-btn"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="cancel-btn"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddVibes;
