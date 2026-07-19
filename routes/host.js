const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const hostController = require("../controllers/host");

router.get(
    "/:id",
    wrapAsync(hostController.showHostProfile)
);

module.exports = router;