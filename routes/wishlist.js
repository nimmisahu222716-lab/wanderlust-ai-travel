const express = require("express");
const router = express.Router();

const wishlistController = require("../controllers/wishlist");
const { isLoggedIn } = require("../middleware");

// Toggle Wishlist

// Wishlist Page
router.get(
    "/",
    isLoggedIn,
    wishlistController.showWishlist
);
router.post("/:id", isLoggedIn, wishlistController.toggleWishlist);

module.exports = router;