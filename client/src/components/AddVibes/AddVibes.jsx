import React, { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import errorIcon from "../../assets/images/error.svg";
import "./AddVibes.scss";
import UpliftingMessageModal from "../UpliftingMessageModal/UpliftingMessageModal";
import "bootstrap/dist/css/bootstrap.min.css";

const baseURL = import.meta.env.VITE_API_URL;

function AddVibes({ user, onCancel }) {
  const [date, setDate] = useState("");
  const [moodText, setMoodText] = useState("");
  const [upliftingMessage, setUpliftingMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateError, setDateError] = useState("");
  const [moodError, setMoodError] = useState("");
  const [dateTouched, setDateTouched] = useState(false);
  const [moodTextTouched, setMoodTextTouched] = useState(false);

  const isFormValid = () => {
    let hasError = false;

    if (!date) {
      setDateError("Date cannot be empty.");
      hasError = true;
    }

    if (!moodText.trim()) {
      setMoodError(
        "Vibes cannot be empty. Please describe how you are feeling."
      );
      hasError = true;
    }

    if (!hasError) {
      setDateError("");
      setMoodError("");
    }

    return !hasError;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setDateTouched(true);
    setMoodTextTouched(true);

    if (!isFormValid()) {
      return;
    }

    try {
      const response = await axios.post(`${baseURL}/moods`, {
        mood_text: moodText,
        date,
        user_id: user?.id,
      });
      console.log(date);

      setUpliftingMessage(response.data.uplifting_message);
      setIsModalOpen(true);
      setMoodText("");
      setDate("");
      setDateError("");
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
    <div className="container mt-4">
      <article className="hello-text">Hello {user?.user_name}</article>

      {!upliftingMessage && (
        <form onSubmit={handleSubmit} className="card p-4 shadow-none border-0">
          <div className="mb-3">
            <label className="form-label">Date:</label>
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setDateError("");
              }}
              onFocus={() => setDateTouched(true)}
            />
          </div>

          {dateError && dateTouched && (
            <div className="alert alert-danger d-flex align-items-center">
              <img src={errorIcon} alt="error" className="me-2" width="20" />
              <span>{dateError}</span>
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">How are you feeling today?</label>
            <textarea
              className="form-control"
              value={moodText}
              onChange={(e) => {
                setMoodText(e.target.value);
                setMoodError("");
              }}
              onFocus={() => setMoodTextTouched(true)}
              placeholder="Describe your mood..."
            />
          </div>

          {moodError && moodTextTouched && (
            <div className="alert alert-danger d-flex align-items-center">
              <img src={errorIcon} alt="error" className="me-2" width="20" />
              <span>{moodError}</span>
            </div>
          )}

          <div className="d-flex justify-content-between">
            <button type="submit" className="submit-btn">
              Submit
            </button>
            <button type="button" className="btn-cancel-btn" onClick={onCancel}>
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
