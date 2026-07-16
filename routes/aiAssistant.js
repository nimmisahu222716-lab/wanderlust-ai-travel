const express = require("express");
const router = express.Router();

const { isLoggedIn } = require("../middleware");
const aiRateLimiter = require("../aiRateLimiter");
const aiAssistantController = require("../controllers/aiAssistant");

// Show AI Assistant Page
router.get("/", isLoggedIn, (req, res) => {
    res.render("aiAssistant/index");
});

// Ask AI
router.post(
    "/ask",
    isLoggedIn,
    aiRateLimiter,
    aiAssistantController.askAssistant
);

module.exports = router;