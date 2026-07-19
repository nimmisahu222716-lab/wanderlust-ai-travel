const Listing = require("../models/listing");
const Booking = require("../models/booking");
const PDFDocument = require("pdfkit");

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

    const allBookings = await Booking.find({
    listing: { $in: listingIds }
});

const confirmedBookings = allBookings.filter(
    booking => booking.status === "Confirmed"
);

   const totalRevenue = confirmedBookings.reduce((sum, booking) => {
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

const topProperties = await Booking.aggregate([

    {
        $match: {
            listing: { $in: listingIds },
            status: "Confirmed"
        }
    },

    {
        $group: {
            _id: "$listing",
            bookings: { $sum: 1 },
            revenue: { $sum: "$totalPrice" }
        }
    },

    {
        $sort: {
            revenue: -1
        }
    },

    {
        $limit: 5
    }

]);

for (let property of topProperties) {

    property.listing = await Listing.findById(property._id);

}

const monthlyRevenue = await Booking.aggregate([

    {
        $match: {
            listing: { $in: listingIds },
            status: "Confirmed"
        }
    },

    {
        $group: {

            _id: {
                year: { $year: "$bookedAt" },
                month: { $month: "$bookedAt" }
            },

            revenue: {
                $sum: "$totalPrice"
            }

        }

    },

    {
        $sort: {
            "_id.year": 1,
            "_id.month": 1
        }
    }

]);

console.log(monthlyRevenue);

const bookingSummary = {

    confirmed: allBookings.filter(
        booking => booking.status === "Confirmed"
    ).length,

    completed: allBookings.filter(
        booking => booking.status === "Completed"
    ).length,

    cancelled: allBookings.filter(
        booking => booking.status === "Cancelled"
    ).length

};

const myListings = await Listing.find({
    owner: req.user._id
});

const totalListings = hostListings.length;
const totalBookings = allBookings.length;

const now = new Date();

const currentMonth = now.getMonth();
const currentYear = now.getFullYear();

const lastMonthDate = new Date(currentYear, currentMonth - 1);

const lastMonth = lastMonthDate.getMonth();
const lastMonthYear = lastMonthDate.getFullYear();

const thisMonthRevenue = confirmedBookings
    .filter(booking =>
        booking.bookedAt.getMonth() === currentMonth &&
        booking.bookedAt.getFullYear() === currentYear
    )
    .reduce((sum, booking) => sum + booking.totalPrice, 0);

const lastMonthRevenue = confirmedBookings
    .filter(booking =>
        booking.bookedAt.getMonth() === lastMonth &&
        booking.bookedAt.getFullYear() === lastMonthYear
    )
    .reduce((sum, booking) => sum + booking.totalPrice, 0);

const averageBookingValue =
    confirmedBookings.length > 0
        ? Math.round(totalRevenue / confirmedBookings.length)
        : 0;

const highestEarningProperty =
    topProperties.length > 0 && topProperties[0].listing
        ? topProperties[0].listing.title
        : "N/A";

const aiInsights = [];

// Revenue comparison
if (thisMonthRevenue > lastMonthRevenue) {

    const growth =
        lastMonthRevenue === 0
            ? 100
            : Math.round(
                ((thisMonthRevenue - lastMonthRevenue) /
                lastMonthRevenue) * 100
            );

    aiInsights.push(
        `📈 Revenue increased by ${growth}% compared to last month.`
    );

} else if (thisMonthRevenue < lastMonthRevenue) {

    const decline =
        Math.round(
            ((lastMonthRevenue - thisMonthRevenue) /
            lastMonthRevenue) * 100
        );

    aiInsights.push(
        `📉 Revenue decreased by ${decline}% compared to last month.`
    );

} else {

    aiInsights.push(
        "📊 Revenue remained the same as last month."
    );

}

// Best property
if (highestEarningProperty !== "N/A") {

    aiInsights.push(
        `🏆 ${highestEarningProperty} is currently your highest earning property.`
    );

}

// Completed bookings
if (bookingSummary.completed > 0) {

    aiInsights.push(
        `✅ You completed ${bookingSummary.completed} booking(s).`
    );

}

// Cancelled bookings
if (bookingSummary.cancelled > 0) {

    aiInsights.push(
        `⚠️ ${bookingSummary.cancelled} booking(s) were cancelled.`
    );

}

// Availability
if (unavailableListings > 0) {

    aiInsights.push(
        `💡 ${unavailableListings} listing(s) are unavailable. Making them available could increase bookings.`
    );

}

res.render("dashboard/index", {

    totalListings,
    totalBookings,
    totalRevenue,
    availableListings,
    unavailableListings,

    recentBookings,

    topProperties,

    monthlyRevenue,

    myListings,

    bookingSummary,

    thisMonthRevenue,
lastMonthRevenue,
averageBookingValue,
highestEarningProperty,

aiInsights

});

};

module.exports.manageBookings = async (req, res) => {

    const hostListings = await Listing.find({
        owner: req.user._id
    });

    const listingIds = hostListings.map(listing => listing._id);

    await Booking.updateMany(
    {
        listing: { $in: listingIds },
        status: "Confirmed",
        checkOut: { $lt: new Date() }
    },
    {
        $set: {
            status: "Completed"
        }
    }
);

    const bookings = await Booking.find({
        listing: { $in: listingIds }
    })
    .populate("user")
    .populate("listing")
    .sort({ bookedAt: -1 });

    res.render("dashboard/bookings", {
        bookings
    });

};

module.exports.completeBooking = async (req, res) => {

    await Booking.findByIdAndUpdate(
        req.params.id,
        { status: "Completed" }
    );

    req.flash("success", "Booking marked as completed.");

    res.redirect("/dashboard/bookings");
};

module.exports.cancelBooking = async (req, res) => {

    await Booking.findByIdAndUpdate(
        req.params.id,
        { status: "Cancelled" }
    );

    req.flash("success", "Booking cancelled.");

    res.redirect("/dashboard/bookings");
};