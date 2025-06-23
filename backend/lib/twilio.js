const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = process.env.TWILIO_VERIFY_SERVICE_SID; // You need to create a Verify Service in Twilio Console

const client = twilio(accountSid, authToken);

const sendOTP = async (phone) => {
  return client.verify.v2.services(verifySid)
    .verifications
    .create({ to: phone, channel: 'sms' });
};

const verifyOTP = async (phone, code) => {
  return client.verify.v2.services(verifySid)
    .verificationChecks
    .create({ to: phone, code });
};

module.exports = { sendOTP, verifyOTP }; 