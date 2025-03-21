import "./Profile.scss";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaEdit, FaTimes, FaCheck } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  async function fetchProfile() {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfile(response.data);
      setEditedProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error.response?.data || error.message);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleEditClick = () => setIsEditing(true);

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedProfile(profile);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveClick = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:8080/users/me", editedProfile, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfile(editedProfile);
      setIsEditing(false);
      setShowSuccessMessage(true); // Show the success message
      setTimeout(() => {
        setShowSuccessMessage(false); // Hide the message after 3 seconds
      }, 3000);
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error.message);
    }
  };

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="container mt-4">
      <h3>Update your profile here!</h3>
      {showSuccessMessage && (
        <div className="success-message">
          Profile updated successfully!
        </div>
      )}
      <div className="mb-3">
        <label className="form-label">Username:</label>
        {isEditing ? (
          <input
            type="text"
            className="form-control"
            name="user_name"
            value={editedProfile.user_name}
            onChange={handleInputChange}
          />
        ) : (
          <p>{profile.user_name}</p>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label">Email:</label>
        {isEditing ? (
          <input
            type="email"
            className="form-control"
            name="email"
            value={editedProfile.email}
            onChange={handleInputChange}
          />
        ) : (
          <p>{profile.email}</p>
        )}
      </div>

      {isEditing ? (
        <div className="bttns">
          <div className="d-flex gap-5">
            <button className="btn btn-success" onClick={handleSaveClick}>
              <FaCheck /> Confirm
            </button>
            <button className="btn btn-cancel" onClick={handleCancelClick}>
              <FaTimes /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <button className="btn btn-edit" onClick={handleEditClick}>
          <FaEdit /> Edit Profile
        </button>
      )}
    </div>
  );
}

export default Profile;