const { io } = require('../src/index');

const sendEmailNotification = (user, message) => {
    // Implement your email notification logic here
    // You can use libraries like nodemailer to send emails
    // For example:
    const nodemailer = require("nodemailer");

    // Create a transporter to send emails (replace with your actual email configuration)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your_email@gmail.com',
            pass: 'your_email_password',
        },
    });

    // Define the email content
    const mailOptions = {
        from: 'your_email@gmail.com',
        to: user.email, // Assuming user.email contains the recipient's email address
        subject: 'Notification',
        text: message,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email notification:', error);
        } else {
            console.log('Email notification sent:', info.response);
        }
    });
};

const sendWebSocketNotification = (user, message) => {

    // For example, using socket.io:
    // Replace this with the actual path to your socket.io setup

    // Emit the message to the user or a specific channel/room
    io.to(user.socketId).emit('notification', message); // Assuming user.socketId contains the recipient's socket ID
};

module.exports = {
    sendEmailNotification,
    sendWebSocketNotification,
};