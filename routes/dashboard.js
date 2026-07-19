const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboard");
const { isLoggedIn } = require("../middleware");

router.get(
    "/",
    isLoggedIn,
    dashboardController.dashboard
);

router.get(
    "/bookings",
    isLoggedIn,
    dashboardController.manageBookings
);

router.put(
    "/bookings/:id/complete",
    isLoggedIn,
    dashboardController.completeBooking
);

router.put(
    "/bookings/:id/cancel",
    isLoggedIn,
    dashboardController.cancelBooking
);

module.exports = router;