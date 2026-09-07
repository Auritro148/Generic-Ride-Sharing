const path = require("path");
const dotenv = require("dotenv");
const nodeMail = require("nodemailer");

dotenv.config({
    path: path.join(__dirname, "..", ".env")
});




const transporter = nodeMail.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);

async function sendEmail(to, subject, text) {
    return transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
    });
}


module.exports = {sendEmail};


