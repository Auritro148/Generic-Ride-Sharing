const path = require("path");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

// Load .env from:
// server/.env
dotenv.config({
    path: path.join(__dirname, "..", ".env")
});

// Create Gmail transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Check whether credentials are loaded
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);

// Verify SMTP connection
transporter.verify()
    .then(() => {
        console.log("SMTP authentication successful");
    })
    .catch((error) => {
        console.error("SMTP authentication failed:");
        console.error(error);
    });


// Send email
async function sendEmail(to, subject, text) {

    return transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
    });
}


module.exports = {
    sendEmail
};