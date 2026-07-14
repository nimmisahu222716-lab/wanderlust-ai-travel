const express = require("express");
const router = express.Router();

const aiController = require("../controllers/ai");
const { isLoggedIn } = require("../middleware");
const aiRateLimiter = require("../aiRateLimiter");

// ==============================
// Generate AI Description
// ==============================
router.post(
    "/generate-description",
    isLoggedIn,
    aiRateLimiter,
    aiController.generateDescription
);

// ==============================
// Improve AI Description
// ==============================
router.post(
    "/improve-description",
    isLoggedIn,
    aiRateLimiter,
    aiController.improveDescription
);

module.exports = router;