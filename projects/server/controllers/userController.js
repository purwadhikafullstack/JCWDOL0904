const db = require("../models");
const { Op } = require("sequelize");
const User = db.User;
const jwt = require("jsonwebtoken");
const nodemailer = require("../helpers/nodemailer");

module.exports = {
  userRegister: async (req, res) => {
    try {
      const { email } = req.body;
      console.log(req.body);

      const userAlreadyExist = await User.findOne({
        where: {
          [Op.or]: [{ email }],
        },
      });

      if (userAlreadyExist) {
        res.status(400).send({
          message:
            "Your email address already exist, please verify your email!",
        });
      }

      let result = await User.create({
        email,
      });

      let payload = { id: result.id };
      let token = jwt.sign(payload, "galaxy", {
        expiresIn: "9999 years",
      });

      await User.update(
        { verify_token: token },
        {
          where: {
            id: result.id,
          },
        }
      );

      let mail = {
        from: `Admin <galaxy@gmail.com>`,
        to: `${email}`,
        subject: `Verify your account`,
        html: `
        <div>
        <p>Thank you for registering, you need to activate your account,</p>
        <a href="http://localhost:3000/verification/${token}">Click Here</a>
        <span>to activate</span>
        </div>
        `,
      };
      let response = await nodemailer.sendMail(mail);
      console.log(response);

      res.status(200).send({
        message: "Register Success",
        result,
      });
    } catch (err) {
      console.log(err);
    }
  },
};
