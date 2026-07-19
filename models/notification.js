const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        listing: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Listing"
        },

        message: {
            type: String,
            required: true
        },

        type: {
            type: String,
            enum: [
                "booking",
                "cancel",
                "system"
            ],
            default: "booking"
        },

        isRead: {
            type: Boolean,
            default: false
        }

    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Notification",
    notificationSchema
);