const User = require("../models/user");
const { cloudinary } = require("../cloudConfig");
const Listing = require("../models/listing");
const Booking = require("../models/booking");

module.exports.showProfile = async (req, res) => {

    const user = await User.findById(req.user._id);

    const wishlistCount = user.wishlist ? user.wishlist.length : 0;

    const bookingCount = await Booking.countDocuments({
        user: req.user._id
    });

    const listingCount = await Listing.countDocuments({
        owner: req.user._id
    });

    res.render("profile/show.ejs", {
        user,
        wishlistCount,
        bookingCount,
        listingCount
    });
};
module.exports.renderEditProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    res.render("profile/edit.ejs", { user });
};

module.exports.updateProfile = async (req, res) => {

    const { name, phone, bio, location } = req.body;

    const user = await User.findById(req.user._id);

    user.name = name;
    user.phone = phone;
    user.bio = bio;
    user.location = location;

    // Save profile image if uploaded
   if (req.file) {

    // Delete old profile image from Cloudinary
    if (user.image && user.image.filename) {
        await cloudinary.uploader.destroy(user.image.filename);
    }

    // Save new profile image
    user.image = {
        url: req.file.path,
        filename: req.file.filename
    };
}

    await user.save();

    req.flash("success", "Profile updated successfully!");

    res.redirect("/profile");
};