const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function sendBookingConfirmation(userEmail, bookingDetails) {

    const mailOptions = {
        from: `"WanderLust" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: "🎉 Booking Confirmed - WanderLust",

        html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;border:1px solid #ddd;border-radius:10px">

            <h1 style="color:#ff5a5f;text-align:center">
                WanderLust
            </h1>

            <h2 style="text-align:center;color:#333">
                Booking Confirmed 🎉
            </h2>

            <p>Hello <b>${bookingDetails.username}</b>,</p>

            <p>Your booking has been confirmed successfully.</p>

            <hr>

            <h3>Booking Details</h3>

            <p><b>Property:</b> ${bookingDetails.property}</p>

            <p><b>Check-In:</b> ${bookingDetails.checkIn}</p>

            <p><b>Check-Out:</b> ${bookingDetails.checkOut}</p>

            <p><b>Guests:</b> ${bookingDetails.guests}</p>

            <p><b>Total Price:</b> ₹${bookingDetails.totalPrice.toLocaleString("en-IN")}</p>

            <hr>

            <p>
                Thank you for choosing <b>WanderLust</b>.
            </p>

        </div>
        `
    };

    await transporter.sendMail(mailOptions);
}

module.exports = {
    transporter,
    sendBookingConfirmation
};