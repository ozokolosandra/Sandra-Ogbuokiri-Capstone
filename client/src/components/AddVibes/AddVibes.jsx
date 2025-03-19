import React, { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import errorIcon from "../../assets/images/error.svg";
import UpliftingMessageModal from "../UpliftingMessageModal/UpliftingMessageModal";
import "./AddVibes.scss";

function AddVibes({ user, onCancel }) {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [moodText, setMoodText] = useState("");
    const [upliftingMessage, setUpliftingMessage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dateError, setDateError] = useState(""); // Separate error for date
    const [moodError, setMoodError] = useState(""); // Separate error for mood

    const handleSubmit = async (event) => {
        event.preventDefault();

        let hasError = false; // Track errors

        // Validate start and end dates
        if (!startDate || !endDate) {
            setDateError("Please select a valid start and end date.");
            hasError = true;
        } else if (new Date(endDate) < new Date(startDate)) {
            setDateError("End date cannot be before the start date.");
            hasError = true;
        } else {
            setDateError(""); // Clear date error if valid
        }

        // Validate mood text
        if (!moodText.trim()) {
            setMoodError("Please describe your mood.");
            hasError = true;
        } else {
            setMoodError(""); // Clear mood error if valid
        }

        if (hasError) return; // Stop if errors exist

        try {
            const response = await axios.post("http://localhost:8080/moods", {
                mood_text: moodText,
                start_date: startDate,
                end_date: endDate,
                user_id: user?.id,
            });

            console.log(response.data);

            setUpliftingMessage(response.data.uplifting_message);
            setIsModalOpen(true);
            setMoodText("");
            setStartDate("");
            setEndDate("");
            setDateError(""); // Clear errors
            setMoodError("");
        } catch (error) {
            console.error("Error adding mood:", error);
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setUpliftingMessage(null);
    };

    return (
        <div className="vibes">
            <h2 className="vibes__header">Hello {user?.user_name || "Guest"}</h2>

            {!upliftingMessage && (
                <form onSubmit={handleSubmit} className="form__vibes">
                    {/* Start Date */}
                    <label className="vibes__info">
                        <span className="vibes__info__date">Start Date:</span>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => {
                                setStartDate(e.target.value);
                                setDateError(""); // Clear date error
                            }}
                        />
                    </label>

                    {/* End Date */}
                    <label className="vibes__info">
                        <span className="vibes__info__date">End Date:</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => {
                                setEndDate(e.target.value);
                                setDateError("");
                            }}
                        />
                    </label>

                    {/* Date Error Message */}
                    {dateError && (
                        <div className="vibes__error">
                            <span className="vibes__error__icon">
                                <img src={errorIcon} className="error-icon" alt="error icon" />
                            </span>
                            <span className="vibes__error__message">{dateError}</span>
                        </div>
                    )}

                    {/* Mood Input */}
                    <label className="vibes">
                        <span className="vibes__input">How are you feeling today?</span>
                        <textarea
                            value={moodText}
                            onChange={(e) => {
                                setMoodText(e.target.value);
                                setMoodError(""); // Clear mood error
                            }}
                            rows="4"
                            placeholder="Describe your mood..."
                            className="vibes__mood__input"
                        />
                    </label>

                    {/* Mood Error Message */}
                    {moodError && (
                        <div className="vibes__error">
                            <span className="vibes__error__icon">
                                <img src={errorIcon} className="error-icon" alt="error icon" />
                            </span>
                            <span className="vibes__error__message">{moodError}</span>
                        </div>
                    )}

                    <div className="vibes__button">
                        <button type="submit" className="submit-btn">Submit</button>
                        <button type="button" onClick={onCancel} className="cancel-btn">Cancel</button>
                    </div>
                </form>
            )}

            <UpliftingMessageModal isOpen={isModalOpen} onClose={handleModalClose} upliftingMessage={upliftingMessage} />
        </div>
    );
}

AddVibes.propTypes = {
    user: PropTypes.object,
    onCancel: PropTypes.func.isRequired,
};

export default AddVibes;
