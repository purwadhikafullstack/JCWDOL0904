const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mini.project.socmed@gmail.com",
    pass: "extnsxajdusrnhoz",
  },
});

module.exports = transporter;
