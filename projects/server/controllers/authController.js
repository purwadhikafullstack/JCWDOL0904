const db = require("../models");
const User = db.User;
const jwt = require("jsonwebtoken");
const nodemailer = require("../helpers/nodemailer.js");
const bcrypt = require("bcrypt");

module.exports = {
  userLogin: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(401).send({
          message: "Please input your email and password!",
        });
      }
      const userExist = await User.findOne({
        where: { email, password },
      });

      if (!userExist) {
        res.status(400).send({
          message: "Email not found, please register!",
        });
      }

      // const isValid = await bcrypt.compare(password, userExist.password);

      // if (!isValid) {
      //   throw { message: "wrong email address or password!" };
      // }

      const payload = {
        id: userExist.id,
        is_verified: userExist.is_verified,
      };

      const token = jwt.sign(payload, "galaxy", { expiresIn: "9999 years" });

      const userVerified = jwt.verify(token, "galaxy");
      console.log(userVerified);

      if (!userVerified.is_verified) {
        res.status(400).send({
          message: "Please verify your account!",
        });
      } else {
        res.status(200).send({
          message: "Login Success",
          result: userExist,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  userVerification: async (req, res) => {
    try {
      // console.log(req.headers);
      const { password } = req.body;
      console.log(req.body);

      if (!password) {
        throw Error("Please complete your data");
      }

      const passwordRegex =
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[0-9a-zA-Z!@#$%^&*()_+]{8,}$/;

      if (!passwordRegex.test(password))
        throw "Password must contain at least 8 characters including an uppercase letter, a symbol, and a number";

      const salt = await bcrypt.genSalt(10);
      const hashPass = await bcrypt.hash(password, salt);

      let token = req.headers.authorization;
      token = token.split(" ")[1];
      const data = jwt.verify(token, "galaxy");
      console.log(data);

      const userPassword = await User.update(
        { is_verified: true, password: hashPass },
        { where: { id: data.id } }
      );
      res.status(200).send({
        message: "Verification success",
        data: userPassword,
      });
    } catch (err) {
      console.log(err);
      res.status(400).send({
        message: err.message,
        data: null,
      });
    }
  },
};
