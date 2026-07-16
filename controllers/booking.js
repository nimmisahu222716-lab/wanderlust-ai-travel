const Booking = require("../models/booking");
const Listing = require("../models/listing");

// Create Booking
module.exports.createBooking = async (req, res) => {

    try {

        const { id } = req.params;
        const { checkIn, checkOut, guests } = req.body;

        const listing = await Listing.findById(id);

        if (!listing.isAvailable) {

    req.flash(
        "error",
        "This property is currently not accepting bookings."
    );

    return res.redirect(`/listings/${id}`);
}

        if (!listing) {
            req.flash("error", "Listing not found.");
            return res.redirect("/listings");
        }

        const existingBooking = await Booking.findOne({
            listing: id,
            status: "Confirmed",
            checkIn: { $lt: new Date(checkOut) },
            checkOut: { $gt: new Date(checkIn) }
        });

        if (existingBooking) {
            req.flash(
                "error",
                "This property is already booked for the selected dates."
            );
            return res.redirect(`/listings/${id}`);
        }

        const oneDay = 1000 * 60 * 60 * 24;

        const nights = Math.ceil(
            (new Date(checkOut) - new Date(checkIn)) / oneDay
        );

        if (nights <= 0) {
            req.flash(
                "error",
                "Check-out date must be after check-in date."
            );
            return res.redirect(`/listings/${id}`);
        }


        if (Number(guests) > listing.maxGuests) {

    req.flash(
        "error",
        `This property allows a maximum of ${listing.maxGuests} guests.`
    );

    return res.redirect(`/listings/${id}`);
}

        const totalPrice = nights * listing.price;

        const booking = new Booking({
            listing: listing._id,
            user: req.user._id,
            checkIn,
            checkOut,
            guests,
            totalPrice
        });

        await booking.save();

        req.flash(
            "success",
            "Booking Confirmed Successfully!"
        );

        res.redirect("/bookings");

    } catch (err) {

        console.log(err);

        req.flash(
            "error",
            "Unable to create booking."
        );

        res.redirect("back");
    }
};

// Show My Bookings
module.exports.showBookings = async (req, res) => {

    try {

        const bookings = await Booking.find({
            user: req.user._id
        })
        .populate("listing")
        .sort({ bookedAt: -1 });

        res.render("bookings/index", {
            bookings
        });

    } catch (err) {

        console.log(err);

        req.flash(
            "error",
            "Unable to fetch bookings."
        );

        res.redirect("/listings");
    }
};

// Cancel Booking
module.exports.cancelBooking = async (req, res) => {

    try {

        const { id } = req.params;

        await Booking.findByIdAndUpdate(id, {
            status: "Cancelled"
        });

        req.flash(
            "success",
            "Booking cancelled successfully."
        );

        res.redirect("/bookings");

    } catch (err) {

        console.log(err);

        req.flash(
            "error",
            "Unable to cancel booking."
        );

        res.redirect("/bookings");

    }

};