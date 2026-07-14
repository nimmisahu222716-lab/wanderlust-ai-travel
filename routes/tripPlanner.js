const express = require("express");
const router = express.Router();

const { isLoggedIn } = require("../middleware");
const tripPlannerController = require("../controllers/tripPlanner");
const aiRateLimiter = require("../aiRateLimiter");

// ===============================
// Show Trip Planner Page
// ===============================
router.get("/", isLoggedIn, (req, res) => {
    res.render("tripPlanner/index");
});

// ===============================
// Generate Trip Plan
// ===============================
router.post(
    "/generate",
    isLoggedIn,
    aiRateLimiter,
    tripPlannerController.generateTrip
);

module.exports = router;