import React, { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import UpliftingMessageModal from "../UpliftingMessageModal/UpliftingMessageModal";
import "./AddVibes.scss";

function AddVibes({ user, onCancel }) {
    const [date, setDate] = useState("");
    const [moodText, setMoodText] = useState("");
    const [upliftingMessage, setUpliftingMessage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
      
        if (!date || !moodText) {
          alert("Please select a date and enter your mood.");
          return;
        }
      
        try {
          const response = await axios.post("http://localhost:8080/moods", {
            mood_text: moodText,
            date: date,
            user_id: user?.id, // Use the user_id from the user prop
          });
          console.log(response.data);
      
          setUpliftingMessage(response.data.uplifting_message);
          setIsModalOpen(true);
          setMoodText("");
          setDate("");
        } catch (error) {
          console.error("Error adding mood:", error);
          alert("Failed to add mood. Please try again.");
        }
      };

    const handleModalClose = () => {
        setIsModalOpen(false); // Close the modal
        setUpliftingMessage(null); // Clear the uplifting message
    };

    return (
        <div className="vibes">
            <h2 className="vibes__header">Hello  {user?.user_name || "Guest"} </h2>

            {!upliftingMessage && (
                <form onSubmit={handleSubmit} className="form__vibes">
                    <label className="vibes__info">
                        <span className="vibes__info__date">Select Date:</span>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </label>

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

            {/* Use the new modal component */}
            <UpliftingMessageModal
                isOpen={isModalOpen}
                onClose={handleModalClose} // Pass the updated handler
                upliftingMessage={upliftingMessage}
            />
        </div>
    );
}

AddVibes.propTypes = {
    user: PropTypes.object,
    onCancel: PropTypes.func.isRequired,
};

export default AddVibes;