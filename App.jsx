


import React, { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import { FormikTextField } from "../formik";
import { Button, IconButton, InputAdornment, Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { Visibility, VisibilityOff, Refresh } from "@material-ui/icons";
import {LoadCanvasTemplateNoReload, loadCaptchaEnginge, validateCaptcha } from "react-simple-captcha";
import styles from "./styles/signupStyles";
import PropTypes from "prop-types";
import useSignup from "./hooks/useSignup";
import { formSchema, initialValues } from "./services/signupFormServices";
import { signup } from "../../helpers/authService";

const Signup = ({ location, history, isAuthenticated }) => {
    const classes = styles();
    const { from } = location.state || { from: { pathname: "/" } };
    const { errorMessage, handleSignup } = useSignup(signup);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        loadCaptchaEnginge(6);
        if (isAuthenticated) {
            history.replace(from);
        }
    }, []);

    // Reload CAPTCHA
    const handleReloadCaptcha = () => {
        loadCaptchaEnginge(6);
    };

    return (
        <div className={classes.signupContainer}>
            <Formik
                initialValues={{ ...initialValues, captcha: "" }}
                onSubmit={async (values, { setErrors }) => {
                    if (!validateCaptcha(values.captcha)) {
                        setErrors({ captcha: "Invalid CAPTCHA. Try again." });
                        return;
                    }

                    const { success, field, message } = await handleSignup(values);
                    if (field) {
                        setErrors({ [field]: message });
                    } else {
                        setSnackbarMessage(message);
                        setSnackbarSeverity(success ? "success" : "error");
                        setSnackbarOpen(true);
                    }

                    if (success) {
                        setTimeout(() => window.location.href = "/login", 1500);
                    }
                }}
                validationSchema={formSchema}
            >
                {(props) => {
                    const { isValid } = props;
                    return (
                        <Form className={classes.signupForm}>
                            <FormikTextField required margin="dense" name="name" label="Name" />
                            <FormikTextField required margin="dense" name="username" label="Username" />
                            <FormikTextField required type="email" margin="dense" name="email" label="Email" />
                            <Button
                                    variant="contained"
                                    type="button"
                                    color="primary"
                                    className={classes.signupButton}
                                    disabled = {}
                                >
                                    Send OTP
                                </Button>
                            <FormikTextField required margin="dense" name="mobilenumber" label="Mobile Number" />
                            <FormikTextField
                                required
                                type={showPassword ? "text" : "password"}
                                margin="dense"
                                name="password"
                                label="Password"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton type="button" onClick={() => setShowPassword(!showPassword)}>
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            
                            <FormikTextField
                                required
                                type={showConfirmPassword ? "text" : "password"}
                                margin="dense"
                                name="confirmPassword"
                                label="Confirm Password"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <div className={classes.captchaContainer}>
                                <LoadCanvasTemplateNoReload />
                                <IconButton  onClick={() => handleReloadCaptcha()} className={classes.reloadButton}>
                                    <Refresh />
                                </IconButton>
                            </div>
                            <FormikTextField
                                required
                                name="captcha"
                                label="Enter CAPTCHA"
                            />

                            {errorMessage()}
                            <div className={classes.signupButtonContainer}>
                                <Button
                                    variant="contained"
                                    type="submit"
                                    disabled={!isValid}
                                    color="primary"
                                    className={classes.signupButton}
                                >
                                    Signup
                                </Button>
                            </div>

                            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
                                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
                                    {snackbarMessage}
                                </Alert>
                            </Snackbar>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
};

Signup.propTypes = {
    location: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
};

export default Signup;



import React, { useState } from "react";
import Typography from "@material-ui/core/Typography";
import styles from "../styles/signupStyles";


export default (onSignup) => {
    const classes = styles();
    const [showError, setShowError] = useState(false);

    const errorMessage = () => {
        if (showError) {
            return (
                <Typography variant="body1" color="error" className={classes.loginErrorMessage}>
                    Signup failed
                </Typography>
            )
        }
    };

    const handleSignup = async (values) => {
        const { name, username, email, mobilenumber, password, confirmpassword } = values;
        try {
            const userDetails = await onSignup(name, username, email, mobilenumber, password, confirmpassword);
            setShowError(false);
            if (userDetails) {
                return { success: true, field: null, message: "Signup successful! Redirecting to login..." };
            } else {
                return { success: false, field: null, message: "Signup failed. Please try again." };
            }
        } catch (err) {
            setShowError(true);
            const errorMessage = err.response?.data?.error || "Signup failed. Please try again.";
            return { success: false, field: err.response?.data?.field, message: errorMessage };
        }
    };

    return {
        errorMessage: errorMessage,
        handleSignup: handleSignup
    };
};




import * as Yup from "yup";
import { object, string, ref } from "yup";
 
 
export const initialValues = {
    name: '',
    username: '',
    email: '',
    "mobilenumber": '',
    password: '',
    confirmPassword: ''
};
 
 
export const formSchema = Yup.object({
  name: Yup.string()
    .matches(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces")
    .test(
      "max-words",
      "Name cannot have more than 3 words",
      (value) => value && value.trim().split(/\s+/).length <= 3
    )
    .max(75, "Name cannot exceed 75 characters")
    .required("Name is required"),

  username: Yup.string()
    .required("Username is required"),
  email: string("Enter your email")
    .matches(
        /^[a-zA-Z][a-zA-Z0-9._-]{1,}@[a-zA-Z][a-zA-Z0-9-]{1,}\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/,
        "Enter a valid email"
    )
    .required("Email is required"),
 
  otp : Yup.string()
    .matches(/^[0-9]{4}$/, "Enter a valid OTP")
    .required("OTP is required"),

  mobilenumber: Yup.string()
    .matches(/^[0-9]{10}$/, "Enter a valid 10-digit mobile number")
    .required("Mobile number is required"),
 
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password cannot exceed 64 characters")
    .matches(/^\S*$/, "Password cannot contain spaces") // No spaces allowed
    .test(
      "has-uppercase",
      "Password must contain at least one uppercase letter",
      (value) => /[A-Z]/.test(value)
    )
    .test(
      "has-digit",
      "Password must contain at least one number",
      (value) => /[0-9]/.test(value)
    )
    .test(
      "has-special-char",
      "Password must contain at least one special character",
      (value) => /[!@#$%^&*()_+\-=~|:;"'<>,.?]/.test(value)
    )
    .required("Password is required"),
 
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});


import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
    signupContainer: {
        display: "flex",
        justifyContent: "center",
        padding: "20px 40px",
        width: "100%",
    },
    signupForm: {
        display: "flex",
        flexDirection: "column",
        maxWidth: "400px",
        width: "100%",
    },
    signupButton: {
        marginTop: "10px",
        maxWidth: "150px",
        width: "100%",
    },
    signupButtonContainer: {
        display: "flex",
        justifyContent: "center",
        marginTop: "12px",
    },
    signupErrorMessage: {
        marginTop: "8px",
    },
    signupMessage: {
        marginTop: "15px",
    },
    signupLink: {
        textDecoration: "none",
    },
    captchaContainer: {
        marginTop: "15px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",  
        gap: "10px",
    },
    reloadButton: {
        color: theme.palette.primary.main,
    },
}));




Hey these are the files related to Signup Page , i want to create a OTP validation for email and mobile number. 

There should be a Send OTP button below Email and Phone nUMBER field . 
The button should be disabled until the email is validated  by regex ( in the signupservices.js) already being checked , using result of that the 
Send OTP button should be disabled and enabled , as soon as the email field has any change it should again check and enable only when the input is correct and validates by regex. 
Donrt do regex cHECK AGAIN. 


on clicking on SEND OTP another field should open for entering the OTP and one more verify OTP button should be there side by side on entering the OTP field 

OTP should be anything mock right now of 4 digits. (Verify OTP should be enmabled only after entering 4 digits) 
after the OTP is verified , the entering OTP and verify OTP button should disappear and tyhe Send OTP button should agaoin be disabled and a green tick 
can be shown at the end of the email field , when its verofird 


Do same for mobile number 



Note : use material UI , dont disturb captcha code or any other existing functionality. 


Code in a way such that later i will make a call to backend for OTP service 



