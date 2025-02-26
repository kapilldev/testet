import React from "react";

const Button = ({ onClick }) => {
  const buttonStyle = {
    width: "100%",
    background: "#1a73e8",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "5px",
    fontSize: "14px",
    cursor: "pointer",
    marginTop: "10px",
  };

  const hoverStyle = {
    background: "#1666c1",
  };

  return (
    <button
      style={buttonStyle}
      onMouseOver={(e) => (e.target.style.background = hoverStyle.background)}
      onMouseOut={(e) => (e.target.style.background = buttonStyle.background)}
      onClick={onClick}
    >
      CHANGE PASSWORD
    </button>
  );
};

export default Button;
