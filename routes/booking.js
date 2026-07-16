const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/booking");
const { isLoggedIn } = require("../middleware");


// My Bookings Page
router.get(
    "/",
    isLoggedIn,
    bookingController.showBookings
);

// Create Booking
router.post(
    "/:id",
    isLoggedIn, 
    bookingController.createBooking
);

// Cancel Booking
router.post(
    "/cancel/:id",
    isLoggedIn,
    bookingController.cancelBooking
);

module.exports = router;