import React, { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import errorIcon from "../../assets/images/error.svg"
import UpliftingMessageModal from "../UpliftingMessageModal/UpliftingMessageModal";
import "./AddVibes.scss";

function AddVibes({ user, onCancel }) {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [moodText, setMoodText] = useState("");
    const [upliftingMessage, setUpliftingMessage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState(""); // State for error message

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validate start and end dates
        if (new Date(endDate) < new Date(startDate)) {
            setError("End date cannot be before the start date.");
            return;
        }

        if (!startDate || !endDate || !moodText) {
            setError("Please select a date range and enter your mood.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/moods", {
                mood_text: moodText,
                start_date: startDate,
                end_date: endDate,
                user_id: user?.id, // Use the user_id from the user prop
            });
            console.log(response.data);

            setUpliftingMessage(response.data.uplifting_message);
            setIsModalOpen(true);
            setMoodText("");
            setStartDate("");
            setEndDate("");
            setError(""); // Clear any previous error
        } catch (error) {
            console.error("Error adding mood:", error);
            setError("Failed to add mood. Please try again.");
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false); // Close the modal
        setUpliftingMessage(null); // Clear the uplifting message
    };

    return (
        <div className="vibes">
            <h2 className="vibes__header">Hello {user?.user_name || "Guest"}</h2>

            {!upliftingMessage && (
                <form onSubmit={handleSubmit} className="form__vibes">
                    <label className="vibes__info">
                        <span className="vibes__info__date">Start Date:</span>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => {
                                setStartDate(e.target.value);
                                setError(""); // Clear error when user changes input
                            }}
                        />
                    </label>

                    <label className="vibes__info">
                        <span className="vibes__info__date">End Date:</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => {
                                setEndDate(e.target.value);
                                setError(""); 
                            }}
                        />
                    </label>

                    
                    {error && (
                        <div className="vibes__error">
                            <span className="vibes__error__icon">
                                <img src = {errorIcon} className ="error-icon" alt ="error icon"/>
                            </span>
                            <span className="vibes__error__message">{error}</span>
                        </div>
                    )}

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

            
            <UpliftingMessageModal
                isOpen={isModalOpen}
                onClose={handleModalClose} 
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