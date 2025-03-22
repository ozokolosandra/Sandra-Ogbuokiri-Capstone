import "./Profile.scss";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaEdit, FaTimes, FaCheck } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap"; // Using Bootstrap's Modal
import "bootstrap/dist/css/bootstrap.min.css";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // For password change
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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
    // Reset password fields
    setPasswordData({ newPassword: "", confirmPassword: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  // Show the confirm modal before actually saving
  const handleSaveClick = () => {
    // If user wants to change password, check if fields match
    if (passwordData.newPassword || passwordData.confirmPassword) {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
    }
    setShowConfirmModal(true);
  };

  // Called when user confirms changes in the modal
  const handleConfirmChanges = async () => {
    try {
      const token = localStorage.getItem("token");

      // Example of how you might structure password data in the request body
      const updateData = {
        ...editedProfile,
        ...(passwordData.newPassword && { password: passwordData.newPassword }),
      };

      await axios.put("http://localhost:8080/users/me", updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfile(editedProfile);
      setIsEditing(false);
      setShowSuccessMessage(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error.message);
    } finally {
      setShowConfirmModal(false);
      // Reset password fields
      setPasswordData({ newPassword: "", confirmPassword: "" });
    }
  };

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="container mt-4">
      <h3>Update Your Profile</h3>

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

      {isEditing && (
        <>
          <hr />
          <h5>Change Password</h5>
          <div className="mb-3">
            <label className="form-label">New Password:</label>
            <input
              type="password"
              className="form-control"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Confirm New Password:</label>
            <input
              type="password"
              className="form-control"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
            />
          </div>
        </>
      )}

      {isEditing ? (
        <div className="bttns d-flex gap-5">
          <button className="btn btn-success" onClick={handleSaveClick}>
            <FaCheck /> Save Changes
          </button>
          <button className="btn btn-cancel" onClick={handleCancelClick}>
            <FaTimes /> Cancel
          </button>
        </div>
      ) : (
        <button className="btn btn-edit" onClick={handleEditClick}>
          <FaEdit /> Edit Profile
        </button>
      )}

      {/* Modal for Confirming Changes */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Changes</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to save these changes?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmChanges}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Profile;
