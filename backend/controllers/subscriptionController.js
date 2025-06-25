const Subscription = require('../models/subscriptionModel');
const nodemailer = require('nodemailer');

// Configure your transporter (reuse from authController if possible)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILER_EMAIL, // replace with your email
    pass: process.env.NODEMAILER_PASS,    // replace with your app password
  },
});

exports.subscribe = async (req, res) => {
  try {
    // Use the logged-in user's email
    const email = req.user.email;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Save the email to the subscription database if not already subscribed
    let subscription = await Subscription.findOne({ email });
    if (!subscription) {
      subscription = await Subscription.create({ email });
    }

    // Send confirmation email
    await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: 'Subscription Confirmation',
      text: 'Thank you for subscribing to our newsletter!'
    });

    return res.status(200).json({ message: "Subscribed successfully! Confirmation email sent." });
  } catch (error) {
    console.error('Subscription error:', error);
    return res.status(500).json({ error: 'Failed to subscribe and send email.' });
  }
}; 