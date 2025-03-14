import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Grid,
} from "@material-ui/core";
import PayButton from "./payButton";
import styles from "./styles/payGatewayDialogStyles";
import PaymentService from "./services/paymentService";
import PaymentSuccessful from "./paymentSuccessful";
import PaymentFailure from "./PaymentFailure";
import seatDeleteService from "./services/seatDeleteService";
 
const PayGatewayDialog = ({ onClose, amount,  open, handleClose, bookingId, setShowConfirmation, changer, setChanger}) => {
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState({});
  const [timeLeft, setTimeLeft] = useState(300);
  const [timeoutReached, setTimeoutReached] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [showPaymentFailure, setShowPaymentFailure] = useState(false);
  const [failMessage, setFailMessage] = useState("");
  const [sucFal, setSucFal] = useState(false);
  const [showbooking, setShowBooking] = useState(false);
 
  const timeoutDuration = 5 * 60 * 1000;
  const timeoutIdRef = useRef(null);
  const classes = styles();
 
  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 16);
    setCardNumber(value);
    const formattedValue = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    e.target.value = formattedValue;
  };
 
  const handleCardNumberBlur = () => {
    if (cardNumber.length !== 16) {
      setError((prev) => ({
        ...prev,
        cardNumber: "Card Number must be 16 digits",
      }));
    } else {
      setError((prev) => ({ ...prev, cardNumber: "" }));
    }
  };
 
  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 3);
    setCvv(Number(value));
  };
 
  const handleCvvBlur = () => {
    let errorMessage = "";
    if (cvv.toString().length !== 3) {
      errorMessage = "CVV must be 3 digits";
    } else if (cvv === 0) {
      errorMessage = "CVV cannot be 0";
    }
    setError((prev) => ({ ...prev, cvv: errorMessage }));
  };
 
  const handleExpiryDateChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    let formattedValue = value;
    if (value.length > 2) {
      formattedValue = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }
    setExpiryDate(formattedValue);
  };
 
  const handleExpiryDateBlur = () => {
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
      setError((prev) => ({ ...prev, expiryDate: "Invalid expiry date" }));
    } else {
      setError((prev) => ({ ...prev, expiryDate: "" }));
    }
  };
 
  const handleNameChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z\s]/g, "").slice(0, 100);
    setName(value);
  };
 
  const handleNameBlur = () => {
    const alphabeticName = name.replace(/\s/g, "");
    if (alphabeticName.length < 3 || !/^[a-zA-Z\s]+$/.test(name)) {
      setError((prev) => ({
        ...prev,
        name: "Name must have more than 3 alphabetic characters and only contain letters and spaces",
      }));
    } else {
      setError((prev) => ({ ...prev, name: "" }));
    }
  };
 
  const handlePayClick = async () => {
    setError({});
    if (cardNumber.length !== 16) {
      setError((prev) => ({
        ...prev,
        cardNumber: "Card Number must be 16 digits",
      }));
      return;
    }
    if (cvv.toString().length !== 3 || cvv === 0) {
      setError((prev) => ({ ...prev, cvv: "CVV must be 3 digits" }));
      return;
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
      setError((prev) => ({ ...prev, expiryDate: "Invalid expiry date" }));
      return;
    }
    if (name.length < 3 || !/^[a-zA-Z\s]+$/.test(name)) {
      setError((prev) => ({
        ...prev,
        name: "Name must be more than 3 characters and only contain letters and spaces",
      }));
      return;
    }
 
    timeoutIdRef.current = setTimeout(() => {
      setTimeoutReached(true);
      onClose();
    }, timeoutDuration);
 
    try {
        await PaymentService.makePayment(
        cardNumber,
        expiryDate,
        name,
        cvv,
        bookingId
      );
      setShowPaymentSuccess(true);
      setSucFal(true);
    } catch (err) {
      setShowPaymentFailure(true);
      setFailMessage("Failed");
      setSucFal(true);
    } finally {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    }
  };
 
  useEffect(() => {
    if (timeoutReached || showPaymentSuccess || showPaymentFailure) {
      return;
    }
    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(intervalId);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
 
    return () => clearInterval(intervalId);
  }, [ timeoutReached ,showPaymentSuccess,showPaymentFailure, open]);
 
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };
 
  useEffect(() => {
    if (timeLeft === 0 && !sucFal) {
      handleCloseDialog("Timeout")
    }
  }, [timeLeft,sucFal]);
 
  const handleCloseDialog = async (message) => {
    await seatDeleteService.deleteAbortedSeats(bookingId)
    setShowPaymentFailure(true);
    if (message != "Timeout") {
      setSucFal(true);
    }
    setFailMessage(message);
    setError({})
  };
 
  useEffect(() => {
    if (showPaymentSuccess) {
      const timer = setTimeout(() => {
        handleClose()
        setShowPaymentSuccess(false);
        setShowBooking(true);
        setShowConfirmation(true)
        setChanger(!changer)
        onClose()
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showPaymentSuccess]);
 
  useEffect(() => {
    if (showPaymentFailure) {
      const timer = setTimeout(() => {
        setShowPaymentFailure(false);
        onClose()
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showPaymentFailure]);
 
  useEffect(() => {
    if(showbooking) {
      setShowBooking(false)
      onClose();
  } } , [showbooking]);
 
  useEffect(()=> {
    if(open){
      setTimeLeft(300)
      setCardNumber("")
      setCvv("")
      setExpiryDate("")
      setName("")
    }
  }, [open]);
  return (
    <>
      <Dialog
        open={open}
        onClose={(event, reason) => {
          if (reason !== "backdropClick") {
            handleCloseDialog("Timeout");
          }
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{ className: classes.dialogPaper }}
      >
        <DialogTitle className={classes.dialogTitle}>
          Payment Gateway
          <span className={classes.timeleft}>{formatTime(timeLeft)}</span>
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <TextField
            id="card-number"
            label="Card Number"
            fullWidth
            value={cardNumber.replace(/\d{4}(?=\d)/g, "$& ")}
            onChange={handleCardNumberChange}
            onBlur={handleCardNumberBlur}
            margin="normal"
            variant="outlined"
            className={classes.textField}
            error={!!error.cardNumber}
            helperText={error.cardNumber}
          />
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <TextField
                id="cvv"
                label="CVV"
                fullWidth
                value={cvv}
                onChange={handleCvvChange}
                onBlur={handleCvvBlur}
                margin="normal"
                variant="outlined"
                className={classes.textField}
                error={!!error.cvv}
                helperText={error.cvv}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="expiry-date"
                label="Expiry Date"
                fullWidth
                value={expiryDate}
                onChange={handleExpiryDateChange}
                onBlur={handleExpiryDateBlur}
                margin="normal"
                variant="outlined"
                className={classes.textField}
                error={!!error.expiryDate}
                helperText={error.expiryDate}
              />
            </Grid>
          </Grid>
          <TextField
            id="name"
            label="Name"
            fullWidth
            value={name}
            onChange={handleNameChange}
            onBlur={handleNameBlur}
            margin="normal"
            variant="outlined"
            className={classes.textField}
            error={!!error.name}
            helperText={error.name}
          />
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Button
            onClick={() => {handleCloseDialog("Aborted")}}
            color="secondary"
            className={classes.cancelButton}
          >
            Cancel
          </Button>
          <PayButton
            data-testid="pay-button"
            onClick={handlePayClick}
            amount={amount}
            color="primary"
            className={classes.payButton}
          >
            Pay
          </PayButton>
        </DialogActions>
      </Dialog>
 
      {showPaymentSuccess && (
        <PaymentSuccessful
          onClose={() => {
            setShowPaymentSuccess(false);
            setShowConfirmation(true)
            setChanger(!changer)
            onClose();
          }}
        />
      )}
      
      {showPaymentFailure && (
        <PaymentFailure
          failMessage={failMessage}
          onClose={() => {
            handleClose()
            setShowPaymentFailure(false);
            onClose();
          }}
        />
      )}
    </>
  );
};
 
export default PayGatewayDialog;
