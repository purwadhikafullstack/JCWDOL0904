const db = require("../models");
const { Op } = require("sequelize");
const User = db.User;
const jwt = require("jsonwebtoken");
const nodemailer = require("../helpers/nodemailer");
const fs = require("fs");
const handlebars = require("handlebars");
const { error } = require("console");

module.exports = {
  userRegister: async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).send({
          message: "Please input your email address",
        });
      }

      if (!email.includes("@") || !email.endsWith(".com")) {
        return res.status(400).send({
          message: "Please enter a valid email address",
        });
      }

      const userAlreadyExist = await User.findOne({
        where: { email },
      });

      if (userAlreadyExist) {
        if (userAlreadyExist.is_verified) {
          return res.status(400).send({
            message: "Your email address is already verified, please login",
          });
        } else {
          return res.status(400).send({
            message:
              "Your email address already exists, but it is not verified. Please verify your email!",
          });
        }
      }

      let result = await User.create({
        email,
      });

      let payload = { id: result.id };
      let token = jwt.sign(payload, "galaxy");

      await User.update(
        { verify_token: token },
        {
          where: {
            id: result.id,
          },
        }
      );

      const verificationLink = `http://localhost:3000/verification/${token}`;
      const tempEmail = fs.readFileSync(
        require.resolve("../templates/verification.html"),
        { encoding: "utf8" }
      );
      const tempCompile = handlebars.compile(tempEmail);
      const tempResult = tempCompile({ verificationLink });

      let mail = {
        from: `Admin <galaxy@gmail.com>`,
        to: `${email}`,
        subject: `Verify your account`,
        html: tempResult,
      };
      let response = nodemailer.sendMail(mail);
      console.log(response);

      res.status(200).send({
        message: "Register success, please check your email",
        result,
      });
    } catch (err) {
      console.log(err);
    }
  },

  getUserData: async (req, res) => {
    try {
      const { id } = req.body;

      const result = await User.findOne({
        where: {
          id,
        },
      });

      res.status(200).send({
        result,
      });
    } catch (error) {
      res.status(400).send(error);
    }
  },

  getUserById: async (req, res) => {
    try {
      const { id } = req.params;

      const user = await User.findOne({
        where: {
          id,
        },
      });

      res.status(200).send({
        user,
      });
    } catch (error) {
      res.status(400).send(error);
    }
  },

  userRequest: async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).send({
          message: "Please input your email address",
        });
      }

      if (!email.includes("@") || !email.endsWith(".com")) {
        return res.status(400).send({
          message: "Please enter a valid email address",
        });
      }

      let user = await User.findOne({ where: { email } });

      let payload = { id: user.id };
      let token = jwt.sign(payload, "galaxy", {
        expiresIn: "1m",
      });

      await User.update(
        { reset_token: token },
        {
          where: {
            id: user.id,
          },
        }
      );

      const resetLink = `http://localhost:3000/inputpassword/${token}`;
      const tempEmail = fs.readFileSync(
        require.resolve("../templates/reset.html"),
        { encoding: "utf8" }
      );
      const tempCompile = handlebars.compile(tempEmail);
      const tempResult = tempCompile({ resetLink });

      let mail = {
        from: `Admin <galaxy@gmail.com>`,
        to: `${email}`,
        subject: `Reset Password`,
        html: tempResult,
      };

      let response = nodemailer.sendMail(mail);
      console.log(response);

      res.status(200).send({
        message: "Please check your email",
        user,
      });
    } catch (err) {
      console.log(err);
    }
  },
};
