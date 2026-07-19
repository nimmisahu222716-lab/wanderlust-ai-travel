const PDFDocument = require("pdfkit");

const Listing = require("../models/listing");
const Booking = require("../models/booking");

function drawTableRow(doc, y, c1, c2, c3, c4, c5) {

    doc.fontSize(10)
        .font("Helvetica");

    doc.text(c1, 50, y, { width: 35 });
    doc.text(c2, 90, y, { width: 90 });
    doc.text(c3, 190, y, { width: 140 });
    doc.text(c4, 340, y, { width: 80 });
    doc.text(c5, 450, y, { width: 90, align: "right" });

}

function drawLine(doc, y) {

    doc.moveTo(50, y)
        .lineTo(550, y)
        .stroke("#cccccc");

}

module.exports.exportBookingsPDF = async (req, res) => {

    try {

        const hostListings = await Listing.find({
            owner: req.user._id
        });

        const listingIds = hostListings.map(
            listing => listing._id
        );

        const bookings = await Booking.find({
            listing: { $in: listingIds }
        })
            .populate("user")
            .populate("listing")
            .sort({ createdAt: -1 });

        const doc = new PDFDocument({
            margin: 50,
            size: "A4"
        });

        res.setHeader(
            "Content-Type",
            "application/pdf"
        );

        res.setHeader(
            "Content-Disposition",
            "attachment; filename=Booking-Report.pdf"
        );

        doc.pipe(res);

        // Heading
        doc
            .fontSize(24)
            .fillColor("#ff5a5f")
            .text("WanderLust", {
                align: "center"
            });

        doc.moveDown();

        doc
            .fontSize(18)
            .fillColor("black")
            .text("Booking Report", {
                align: "center"
            });

        doc.moveDown();

        doc.fontSize(12);

        doc.text(`Host : ${req.user.username}`);

        doc.text(
            `Generated : ${new Date().toLocaleDateString("en-IN")}`
        );

        doc.moveDown();

        doc.moveTo(50, doc.y)
            .lineTo(550, doc.y)
            .stroke();

        doc.moveDown();

       // Table Header

const tableTop = doc.y;

doc
    .font("Helvetica-Bold")
    .fontSize(11);

doc.text("S.No", 50, tableTop);
doc.text("Guest", 90, tableTop);
doc.text("Property", 170, tableTop);
doc.text("Status", 320, tableTop);
doc.text("Total", 430, tableTop);

doc.moveTo(50, tableTop + 18)
    .lineTo(550, tableTop + 18)
    .stroke();

let y = tableTop + 28;

doc.font("Helvetica").fontSize(10);

bookings.forEach((booking, index) => {

    doc.text(index + 1, 50, y);

    doc.text(
        booking.user.username,
        90,
        y,
        {
            width: 70
        }
    );

    doc.text(
        booking.listing.title,
        170,
        y,
        {
            width: 130
        }
    );

    doc.text(
        booking.status,
        320,
        y
    );

    doc.text(
        `₹${booking.totalPrice}`,
        430,
        y
    );

    y += 25;

    // New page if needed

    if (y > 720) {

        doc.addPage();

        y = 60;

    }

});

        doc.moveTo(50, doc.y)
            .lineTo(550, doc.y)
            .stroke();

        doc.y = y + 15;

doc.moveTo(50, doc.y)
    .lineTo(550, doc.y)
    .stroke();

doc.moveDown();

        const totalRevenue = bookings.reduce(
            (sum, booking) => sum + booking.totalPrice,
            0
        );

        doc.fontSize(14);

        doc.text(
            `Total Bookings : ${bookings.length}`
        );

        doc.text(
            `Total Revenue : ₹${totalRevenue.toLocaleString("en-IN")}`
        );

        doc.end();

    }

    catch (err) {

        console.log(err);

        req.flash(
            "error",
            "Unable to generate PDF."
        );

        res.redirect("/dashboard");

    }

};

module.exports.exportRevenuePDF = async (req, res) => {

    try {

        const hostListings = await Listing.find({
            owner: req.user._id
        });

        const listingIds = hostListings.map(listing => listing._id);

        const bookings = await Booking.find({
            listing: { $in: listingIds },
            status: { $in: ["Confirmed", "Completed"] }
        })
        .populate("listing")
        .sort({ createdAt: -1 });

        const doc = new PDFDocument({
            margin: 50,
            size: "A4"
        });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=Revenue-Report.pdf"
        );

        doc.pipe(res);

        // Heading
        doc.fontSize(24)
            .fillColor("#ff5a5f")
            .text("WanderLust", { align: "center" });

        doc.moveDown();

        doc.fontSize(18)
            .fillColor("black")
            .text("Revenue Report", { align: "center" });

        doc.moveDown();

        doc.fontSize(12);

        doc.text(`Host : ${req.user.username}`);
        doc.text(`Generated : ${new Date().toLocaleDateString("en-IN")}`);

        doc.moveDown();

        const totalRevenue = bookings.reduce(
            (sum, booking) => sum + booking.totalPrice,
            0
        );

        const averageRevenue = bookings.length
            ? Math.round(totalRevenue / bookings.length)
            : 0;

        const propertyRevenue = {};

        bookings.forEach((booking) => {

            const title = booking.listing.title;

            propertyRevenue[title] =
                (propertyRevenue[title] || 0) +
                booking.totalPrice;

        });

        const topProperty =
            Object.entries(propertyRevenue)
                .sort((a, b) => b[1] - a[1])[0];

        doc.font("Helvetica-Bold").fontSize(14);

        doc.text("Revenue Summary");

        doc.moveDown();

        doc.font("Helvetica").fontSize(12);

        doc.text(`Total Revenue : ₹${totalRevenue.toLocaleString("en-IN")}`);

        doc.text(`Confirmed Bookings : ${bookings.length}`);

        doc.text(`Average Booking Value : ₹${averageRevenue.toLocaleString("en-IN")}`);

        doc.text(
            `Top Performing Property : ${
                topProperty ? topProperty[0] : "N/A"
            }`
        );

        doc.moveDown();

        doc.font("Helvetica-Bold")
            .fontSize(13)
            .text("Property Revenue");

        doc.moveDown();

        doc.font("Helvetica");

        Object.entries(propertyRevenue).forEach(([title, revenue]) => {

            doc.text(
                `${title} ........................ ₹${revenue.toLocaleString("en-IN")}`
            );

        });

        doc.end();

    } catch (err) {

        console.log(err);

        req.flash("error", "Unable to generate revenue report.");

        res.redirect("/dashboard");

    }

};