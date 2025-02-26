// App.js
import React, { useState } from "react";
import ChangePasswordModal from "./components/ChangePasswordModal";
import Button from "./components/Button";
import "./App.css";

const App = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="app-container">
      <h1>User Profile</h1>
      <Button onClick={() => setShowModal(true)} /> {/* Reusable Button */}
      {showModal && <ChangePasswordModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default App;
