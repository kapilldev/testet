import { makeStyles } from "@material-ui/core/styles";

export default makeStyles(() => ({
  button: {
    width: "100%",
    background: "#1a73e8",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "5px",
    fontSize: "14px",
    cursor: "pointer",
    marginTop: "10px",
    "&:hover": {
      background: "#1666c1",
    },
  },
  buttonSmall: {
    width: "auto",
    padding: "10px 10px",
    margin: "20px",
  },
}));
