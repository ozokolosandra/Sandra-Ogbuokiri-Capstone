import React, { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import errorIcon from "../../assets/images/error.svg";
import "./AddVibes.scss";
import UpliftingMessageModal from "../UpliftingMessageModal/UpliftingMessageModal";
import "bootstrap/dist/css/bootstrap.min.css";

function AddVibes({ user, onCancel }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [moodText, setMoodText] = useState("");
  const [upliftingMessage, setUpliftingMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateError, setDateError] = useState("");
  const [moodError, setMoodError] = useState("");
  const [startDateTouched, setStartDateTouched] = useState(false);
  const [endDateTouched, setEndDateTouched] = useState(false);
  const [moodTextTouched, setMoodTextTouched] = useState(false);

  
  const isFormValid = () => {
    let hasError = false;

    if (!startDate) {
      setDateError("Start Date cannot be empty.");
      hasError = true;
    }

    if (!endDate) {
      setDateError("End Date cannot be empty.");
      hasError = true;
    }

    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      setDateError("End Date cannot be before the Start Date.");
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
    setStartDateTouched(true);
    setEndDateTouched(true);
    setMoodTextTouched(true);

    if (!isFormValid()) {
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/moods", {
        mood_text: moodText,
        start_date: startDate,
        end_date: endDate,
        user_id: user?.id,
      });

      setUpliftingMessage(response.data.uplifting_message);
      setIsModalOpen(true);
      setMoodText("");
      setStartDate("");
      setEndDate("");
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
      <h2 className="text-center mb-4">Hello {user?.user_name || "Guest"}</h2>

      {!upliftingMessage && (
        <form onSubmit={handleSubmit} className="card p-4 shadow-none border-0">
          <div className="mb-3">
            <label className="form-label">Start Date:</label>
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setDateError("");
              }}
              onFocus={() => setStartDateTouched(true)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">End Date:</label>
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setDateError("");
              }}
              onFocus={() => setEndDateTouched(true)}
            />
          </div>

          {dateError && (startDateTouched || endDateTouched) && (
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
            <button type="button" className="btn-cancel" onClick={onCancel}>
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
