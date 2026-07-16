const Listing = require("../models/listing");
const Booking = require("../models/booking");

module.exports.dashboard = async (req, res) => {

    const hostListings = await Listing.find({
        owner: req.user._id
    });

    if (hostListings.length === 0) {

        req.flash(
            "error",
            "Create your first listing to access the Host Dashboard."
        );

        return res.redirect("/listings/new");
    }

    const listingIds = hostListings.map(listing => listing._id);

    const bookings = await Booking.find({
        listing: { $in: listingIds },
        status: "Confirmed"
    });

    const totalRevenue = bookings.reduce((sum, booking) => {
        return sum + booking.totalPrice;
    }, 0);

    const availableListings = hostListings.filter(
        listing => listing.isAvailable
    ).length;

    const unavailableListings = hostListings.filter(
        listing => !listing.isAvailable
    ).length;

    const recentBookings = await Booking.find({

    listing: { $in: listingIds },

    status: "Confirmed"

})
.populate("user")
.populate("listing")
.sort({ bookedAt: -1 })
.limit(5);

res.render("dashboard/index", {

    totalListings: hostListings.length,

    totalBookings: bookings.length,

    totalRevenue,

    availableListings,

    unavailableListings,

    recentBookings

});

};