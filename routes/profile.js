const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });

const profileController = require("../controllers/profile");
const { isLoggedIn } = require("../middleware");

// Show Profile
router.get(
    "/",
    isLoggedIn,
    profileController.showProfile
);

// Edit Form
router.get(
    "/edit",
    isLoggedIn,
    profileController.renderEditProfile
);

// Update Profile
router.put(
    "/",
    isLoggedIn,
    upload.single("profileImage"),
    profileController.updateProfile
);

module.exports = router;