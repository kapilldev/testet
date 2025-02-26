import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
    dialogRoot: {
        overflow: "hidden", // Ensure the dialog doesn't overflow
        minHeight: "30vh",
        maxHeight: "80vh",
        display: "flex",
        flexDirection: "column",
    },
    container: {
        display: "flex",
        flexDirection: "column",
        height: "100%", // Ensure full height is utilized properly
        alignItems:"start",
        paddingLeft:"10px"
    },
    dialogHeader: {
        fontWeight: "bold",
        padding: "10px 0px 20px 10px",
        textAlign: "center",
    },
    dialogContent: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        overflow: "hidden",
        flexWrap: "wrap", // Allow wrapping to prevent overflow
    },
    moviePicture: {
        display: "flex",
        justifyContent: "center",
        alignItems: "start",
        paddingLeft: "2%",
        paddingRight: "2%",
        width: "30%", // Adjust the width for better proportion
    },
    pictureAvatar: {
        height: "auto", // Let the height adjust based on the width
        width: "80%", // Make it responsive to fit inside its container
    },
    dialogMain: {
        display: "flex",
        padding: "0px 20px 20px 0px",
        flexDirection: "column",
        justifyContent: "flex-start", // Ensure there's no empty space at the top
        minWidth: "65%", // Reduce width to give space to avatar
        maxWidth: "70%",
        overflowY: "auto", // Allow scrolling in case content overflows
    },
    movieMarquee: {
        fontWeight: "bold",
        paddingTop: "5px",
        overflow: "hidden",
        textOverflow: "ellipsis", // Avoid text overflow
        whiteSpace: "nowrap", // Prevent text wrapping
    },
    seatsAndAmount: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "start", // Ensure space between Amount and Amount value
        width: "100%", // Ensure the container takes up full width
    },
    seatsSelector: {
        maxWidth: "40%", // Increase width for better seat input field handling
        justifyContent: "start",
        paddingLeft: "10px", // Add padding towards the left
        paddingRight: "10px",
    },
    dialogBottom: {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        padding: "20px 0px 0px 0px",
        width: "100%",
    },
    dialogButton: {
        marginTop: "10px", // Adjust button margin for better alignment
        alignItems: "flex-end",
    },
    imdbRating: {
        color: theme.palette.text.disabled,
        fontWeight: "bold",
        paddingTop: "5px",
        paddingBottom: "5px",
        textAlign: "start", // Center the IMDb rating
    },
    amount: {
        fontWeight: "bold",
    },
    amountContainer: {
        display: "flex",  // Enables Flexbox
        flexDirection: "column",  // Aligns items in a column
        justifyContent:"space-between",
        height: "100%",  // Ensures the container stretches to take up full height (so space can be applied)
        paddingLeft: "10px",  // Adds padding to the left
    }
}));
