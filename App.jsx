import { makeStyles } from "@material-ui/core/styles";

export default makeStyles(() => ({
  button: {
    display: "flex",  // Ensures button doesn't expand beyond necessary space
    justifyContent: "center", // Centers text inside the button
    alignItems: "center",
    width: "fit-content", // Ensures it only takes necessary space
    maxWidth: "100%", // Prevents button from overflowing on small screens
    background: "#1a73e8",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    fontSize: "14px",
    cursor: "pointer",
    margin: "10px auto", // Centering the button
    "&:hover": {
      background: "#1666c1",
    },

    // Make it responsive for smaller screens
    "@media (max-width: 600px)": {
      width: "100%", // Button takes full width on small screens
    },
  },
}));





