const db = require("../models");
const { sequelize } = require("../models");
const User = db.User;
const jwt = require("jsonwebtoken");
const nodemailer = require("../helpers/nodemailer.js");
const bcrypt = require("bcrypt");

module.exports = {
  userVerification: async (req, res) => {
    const roll = await sequelize.transaction();
    try {
      const { password } = req.body;

      if (!password) {
        return res.status(400).send({
          message: "Please complete your data",
        });
      }

      const passwordRegex =
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[0-9a-zA-Z!@#$%^&*()_+]{8,}$/;

      if (!passwordRegex.test(password)) {
        return res.status(400).send({
          message:
            "Password must contain at least 8 characters including an uppercase letter, a symbol, and a number",
        });
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
      await roll.commit();
      res.send({
        message: "Verification success",
        data: userPassword,
      });
    } catch (err) {
      await roll.rollback();
      console.log(err);
      res.status(400).send({
        message: "Server Error!",
      });
    }
  },

  userLogin: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).send({
          message: "Please input your email and password",
        });
      }

      const userExist = await User.findOne({
        where: { email },
      });

      if (!userExist) {
        return res.status(400).send({
          message: "Email not found, please register!",
        });
      }

      const isValid = await bcrypt.compare(
        password,
        userExist.dataValues.password
      );
      console.log(isValid);
      if (!isValid) {
        return res.status(400).send({
          message: "wrong email address or password!",
        });
      }
      {
        res.status(200).send({
          message: "Login Success",
          result: userExist,
        });
      }
    } catch (err) {
      console.log(err);
      res.status(400).send({ message: "Server error" });
    }
  },
};
