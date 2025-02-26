import React , {useState} from 'react';
import {CssBaseline, ThemeProvider} from '@material-ui/core';
import Layout from "./components/layout/Layout";
import Theme from './Theme';
import ChangePasswordModal from './components/ChangePassword/ChangePasswordModal';
import Button from './components/ChangePassword/Button';
import useStyles from './components/ChangePassword/styles/buttonStyles'; // Import the styles


export default () => {
    const [showModal, setShowModal] = useState(false);
    const classes = useStyles();
    return (
        <ThemeProvider theme={Theme}>
            <CssBaseline/>
            <Layout/>
            <Button className = "buttonSmall" onClick={() => setShowModal(true)}  /> {/* Reusable Button */}
        {showModal && <ChangePasswordModal onClose={() => setShowModal(false)} />}
        </ThemeProvider>
    );
};





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
    padding: "5px 10px",
    margin: "10px",
  },
}));





