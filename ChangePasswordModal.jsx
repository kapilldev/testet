import React, { useState } from "react";
import "./ChangePassword.css";
import Button from "./Button"; // Reusable button component

const ChangePasswordModal = ({ onClose }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (!passwordRegex.test(newPassword)) {
      setError("Password must be 8-64 characters long, with at least one uppercase, one lowercase, one number, and one special character.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      const response = await fetch("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.error === "New password matches last 3 passwords") {
          setError("New password is the same as the last 3 passwords. Choose another.");
        } else {
          setError(result.error || "Something went wrong. Please try again.");
        }
        return;
      }

      setSuccess(true);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
      
    } catch (err) {
      setError("Failed to change password. Please try again.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Change Password</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type={showOld ? "text" : "password"}
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
            <span onClick={() => setShowOld(!showOld)}>&#128065;</span>
          </div>

          <div className="input-group">
            <input
              type={showNew ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <span onClick={() => setShowNew(!showNew)}>&#128065;</span>
          </div>

          <div className="input-group">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span onClick={() => setShowConfirm(!showConfirm)}>&#128065;</span>
          </div>

          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">Success! Login with new password.</p>}

          <Button label="Change Password" />
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
