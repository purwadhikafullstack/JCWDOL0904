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

      if (userAlreadyExist)
        res.status(400).send({
          message:
            "Your email address already exist, please verify your email!",
        });

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
      let response = await nodemailer.sendMail(mail);
      console.log(response);

      res.status(200).send({
        message: "Register success, please check your email",
        result,
      });
    } catch (err) {
      console.log(err);
      res.status(400).send({ message: "Server error" });
    }
  },
  getUserData: async (req, res) => {
    try {
      
      const {id} = req.body;

      const result = await User.findOne({
        where:{
          id
        }
      })

      res.status(200).send({
        result
      })

    } catch (error) {
      res.status(400).send(error)
    }
  },
  getUserById: async (req, res) => {
    try {
      
      const {id} = req.params;

      const user = await User.findOne({
        where:{
          id
        }
      })

      res.status(200).send({
        user
      })

    } catch (error) {
      res.status(400).send(error)
    }
  }
};
