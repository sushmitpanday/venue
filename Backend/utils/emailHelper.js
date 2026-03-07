const nodemailer = require('nodemailer');

const sendBookingEmails = async(userData, bookingData) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: { rejectUnauthorized: false }
    });

    const { userEmail, userName } = userData;
    const { venueName, amount, transactionId, date } = bookingData;
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

    // Table wala design jo dono ko dikhega
    const detailsHtml = `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; border: 1px solid #eee; padding: 20px;">
            <h2 style="color: #4CAF50; text-align: center;">Booking Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <tr style="background: #f8f8f8;">
                    <td style="padding: 10px; border: 1px solid #ddd;"><b>Venue:</b></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${venueName}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;"><b>Amount Paid:</b></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">₹${amount}</td>
                </tr>
                <tr style="background: #f8f8f8;">
                    <td style="padding: 10px; border: 1px solid #ddd;"><b>Transaction ID:</b></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${transactionId}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;"><b>Date:</b></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${date}</td>
                </tr>
            </table>
            <p style="margin-top: 20px;">Thank you for booking with <b>RentMyVenue</b>.</p>
        </div>
    `;

    try {
        // 1. User ko email
        await transporter.sendMail({
            from: `"RentMyVenue" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: `Booking Confirmed: ${venueName}`,
            html: `<h3>Hi ${userName},</h3><p>Your payment was successful!</p>${detailsHtml}`
        });

        // 2. Admin ko email
        await transporter.sendMail({
            from: `"CONGRATULATIONS YOUR VENUE HAVE BOOKED" <${process.env.EMAIL_USER}>`,
            to: adminEmail,
            subject: `🚨 New Booking: ${venueName} (₹${amount})`,
            html: `<h3>New Booking Received!</h3><p>Customer: ${userName} (${userEmail})</p>${detailsHtml}`
        });

        console.log("📧 Success: Emails sent to User and Admin.");
    } catch (error) {
        console.error("📧 Nodemailer Error:", error);
        throw error;
    }
};

module.exports = sendBookingEmails;