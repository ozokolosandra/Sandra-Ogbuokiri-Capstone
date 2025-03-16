import React, { useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import "./AddVibes.scss";

// Set the app element for accessibility (required by react-modal)
Modal.setAppElement("#root");

function AddVibes({ user, onCancel }) {
  const [date, setDate] = useState("");
  const [moodText, setMoodText] = useState("");
  const [upliftingMessage, setUpliftingMessage] = useState(null); // State for uplifting message
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal open state

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
        user_id: user?.id || 1, // Use user ID if available or fallback to 2
      });

      console.log("Mood added:", response.data);

      // Set the uplifting message from the response
      setUpliftingMessage(response.data.uplifting_message);

      alert("Mood added successfully!");
      setMoodText("");
      setDate("");

      // Open the modal with the uplifting message
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error adding mood:", error);
      alert("Failed to add mood. Please try again.");
    }
  }

  // Handle the "Ok" button click
  const handleOkClick = () => {
    // Close the modal
    setIsModalOpen(false);
    // Clear the uplifting message and show the form again
    setUpliftingMessage(null);
  };

  return (
    <div className="vibes">
      <h2 className="vibes__header">Hello</h2>

      {/* Only render the form if there is no uplifting message */}
      {!upliftingMessage && (
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
            <button type="submit" className="submit-btn">
              Submit
            </button>
            <button type="button" onClick={onCancel} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Modal for the uplifting message */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)} // Close modal when requested
        contentLabel="Uplifting Message"
        className="uplifting-message-modal"
        overlayClassName="modal-overlay"
      >
        <h3 className="uplifting-message__header">Uplifting Message:</h3>
        <p className="uplifting-message__text">{upliftingMessage}</p>
        {/* Ok button to close modal and reset */}
        <button onClick={handleOkClick} className="ok-modal-btn">
          Ok
        </button>
      </Modal>
    </div>
  );
}

export default AddVibes;
