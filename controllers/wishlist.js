const User = require("../models/user");
const Listing = require("../models/listing");

// Add or Remove Wishlist
module.exports.toggleWishlist = async (req, res) => {

    try {

        const { id } = req.params;

        const user = await User.findById(req.user._id);

        const alreadyExists = user.wishlist.includes(id);

        if (alreadyExists) {

            user.wishlist.pull(id);

            req.flash("success", "Removed from Wishlist ❤️");

        } else {

            user.wishlist.push(id);

            req.flash("success", "Added to Wishlist ❤️");

        }

        await user.save();

if (req.body.redirect === "wishlist") {
    return res.redirect("/wishlist");
}

res.redirect(`/listings/${id}`);

    } catch (err) {

        console.log(err);

        req.flash("error", "Something went wrong.");

        res.redirect("back");

    }

};

// Show Wishlist Page
module.exports.showWishlist = async (req, res) => {

    const user = await User.findById(req.user._id)
        .populate("wishlist");

    res.render("wishlist/index", {
        wishlist: user.wishlist
    });

};