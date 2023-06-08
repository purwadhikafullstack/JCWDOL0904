const db = require("../models");
const { sequelize } = require("../models");
const User = db.User;
const jwt = require("jsonwebtoken");
const nodemailer = require("../helpers/nodemailer.js");
const bcrypt = require("bcrypt");

module.exports = {
  userVerification: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const { password } = req.body;

      if (!password) {
        throw "Please complete your data";
      }

      const passwordRegex =
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[0-9a-zA-Z!@#$%^&*()_+]{8,}$/;

      if (!passwordRegex.test(password)) {
        throw {
          message:
            "Password must contain at least 8 characters including an uppercase letter, a symbol, and a number",
        };
      }

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
      await t.commit();
      res.status(200).send({
        message: "Verification success",
        data: userPassword,
      });
    } catch (err) {
      await t.rollback();
      res.status(400).send({
        message:
          "Verification failed, Password must contain at least 8 characters including an uppercase letter, a symbol, and a number",
      });
    }
  },

  userLogin: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(401).send({
          message: "Please input your email and password!",
        });
      }
      const userExist = await User.findOne({
        where: { email },
      });

      if (!userExist) {
        res.status(400).send({
          message: "Email not found, please register!",
        });
      }

      // const isValid = await bcrypt.compare(
      //   password,
      //   userExist.dataValues.password
      // );
      // console.log(isValid);
      // if (!isValid) {
      //   res.status(400).send({
      //     message: "wrong email address or password!",
      //   });
      // }

      {
        res.status(200).send({
          message: "Login Success",
          result: userExist,
        });
      }
    } catch (err) {
      console.log(err);
      res.status(404).send({ message: err.message, data: null });
    }
  },
};
