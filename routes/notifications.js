const express = require("express");
const router = express.Router();

const notificationController =
require("../controllers/notifications");

const { isLoggedIn } =
require("../middleware");

router.get(
    "/",
    isLoggedIn,
    notificationController.getNotifications
);

router.put(
    "/:id/read",
    isLoggedIn,
    notificationController.markAsRead
);

module.exports = router;