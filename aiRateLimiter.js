const rateLimit = require("express-rate-limit");

const aiRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour

    max: 10,

    standardHeaders: true,
    legacyHeaders: false,

    message: {
        success: false,
        message: "You've reached the AI request limit. Please try again after one hour."
    }
});

module.exports = aiRateLimiter;