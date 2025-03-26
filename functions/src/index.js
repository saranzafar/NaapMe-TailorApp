const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "saran.development@gmail.com", // Use your email
    pass: "saran.development@gmail.com", // Use an app password (not your main password)
  },
});

exports.sendOtpEmail = functions.https.onCall(async (data, context) => {
  const {email, otp} = data;

  const mailOptions = {
    from: "your-email@gmail.com",
    to: email,
    subject: "Your OTP for Verification",
    text: `Your OTP for verification is: ${otp}. It is valid for 10 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return {success: true};
  } catch (error) {
    return {success: false, error: error.message};
  }
});
