const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new Schema({

    email: {
        type: String,
        required: true
    },

    // Basic Profile Information
    name: {
        type: String,
        default: ""
    },

    phone: {
        type: String,
        default: ""
    },

    bio: {
        type: String,
        maxlength: 300,
        default: ""
    },

    location: {
        type: String,
        default: ""
    },

    // Profile Picture
    image: {
        url: {
            type: String,
            default: ""
        },
        filename: {
            type: String,
            default: ""
        }
    },

    isHost: {
    type: Boolean,
    default: false
},

    wishlist: [
        {
            type: Schema.Types.ObjectId,
            ref: "Listing"
        }
    ]

}, {
    timestamps: true
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);