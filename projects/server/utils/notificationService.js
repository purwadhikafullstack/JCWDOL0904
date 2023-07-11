const transporter = require("../helpers/nodemailer.js")

const sendEmailNotification = (user, message) => {
    // Define the email content
    const mailOptions = {
        from: 'Admin <galaxy@gmail.com>',
        to: user.email,
        subject: 'Notification',
        text: message,
    };

    console.log(`ini user email`, user);

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email notification:', error);
        } else {
            console.log('Email notification sent:', info.response);
        }
    });
};


module.exports = {
    sendEmailNotification,
};