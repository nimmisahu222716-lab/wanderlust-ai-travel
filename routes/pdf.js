const express = require("express");
const router = express.Router();

const pdfController = require("../controllers/pdf");

const { isLoggedIn } = require("../middleware");

router.get(
    "/bookings",
    isLoggedIn,
    pdfController.exportBookingsPDF
);

router.get(
    "/revenue",
    isLoggedIn,
    pdfController.exportRevenuePDF
);

module.exports = router;