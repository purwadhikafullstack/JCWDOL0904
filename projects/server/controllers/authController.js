const db = require("../models");
const { sequelize } = require("../models");
const User = db.User;
const jwt = require("jsonwebtoken");
const nodemailer = require("../helpers/nodemailer.js");
const bcrypt = require("bcrypt");
const { createToken } = require("../lib/jwt");

module.exports = {
  // user verification
  userVerification: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const { fullname, username, password, confirmPassword } = req.body;
      console.log(fullname);
      if (!fullname || !username || !password || !confirmPassword) {
        return res.status(400).send({
          message: "Please complete your data",
        });
      }

      if (password !== confirmPassword) {
        return res.status(400).send({
          message: "Passwords does not match",
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

      let token = req.headers.authorization;
      token = token.split(" ")[1];
      const data = jwt.verify(token, "galaxy");
      console.log(data);

      const user = await User.findOne({ where: { id: data.id } });

      if (user.is_verified) {
        return res.status(400).send({
          message: "Your account has already been verified",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashPass = await bcrypt.hash(password, salt);

      const userPassword = await User.update(
        { is_verified: true, fullname, username, password: hashPass },
        { where: { id: data.id } }
      );
      await transaction.commit();
      res.send({
        message: "Verification success",
        data: userPassword,
      });
    } catch (err) {
      await transaction.rollback();
      console.log(err);
      res.status(400).send({
        message: "Server Error!",
      });
    }
  },
  // user login
  userLogin: async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log(email, password);

      if (!email || !password) {
        return res.status(400).send({
          message: "Please input your email and password",
        });
      }

      const userExist = await User.findOne({
        where: { email },
      });

      const dataUser = await User.findOne({
        attributes: [
          "email",
          "fullname",
          "username",
          "id_warehouse",
          "is_verified",
          "user_image",
          "role",
          "password",
        ],
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

      const token = createToken({ id: userExist.id });

      await User.update(
        { login_token: token },
        {
          where: {
            id: userExist.id,
          },
        }
      );
      {
        res.status(200).send({
          message: "Login Success",
          result: token,
          data: dataUser,
        });
      }
    } catch (err) {
      console.log(err);
      res.status(400).send({ message: "Server error" });
    }
  },

  // user forgot password
  requestReset: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const { password, confirmPassword } = req.body;

      if (!password || !confirmPassword) {
        return res.status(400).send({
          message: "Please complete your data",
        });
      }

      if (password !== confirmPassword) {
        return res.status(400).send({
          message: "Passwords does not match",
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

      let token = req.headers.authorization;
      token = token.split(" ")[1];
      const data = jwt.verify(token, "galaxy");
      console.log(data);

      const salt = await bcrypt.genSalt(10);
      const hashPass = await bcrypt.hash(password, salt);

      const userPassword = await User.update(
        { password: hashPass },
        { where: { id: data.id } }
      );
      await transaction.commit();
      res.send({
        message: "Reset Password Success",
        data: userPassword,
      });
    } catch (err) {
      await transaction.rollback();
      console.log(err);
      res.status(400).send({
        message: "Server Error!",
      });
    }
  },

  // user update password
  updatePassword: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const { password, newPassword, confirmPassword } = req.body;
      const { id } = req.dataToken;

      const userExist = await User.findOne({
        where: { id },
      });

      const isValid = await bcrypt.compare(password, userExist.password);

      if (!isValid) {
        return res.status(400).send({
          message: "Your password does not match!",
        });
      }

      if (!newPassword || !confirmPassword) {
        return res.status(400).send({
          message: "Please input your new password and confirm password",
        });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).send({
          message: "New password and confirm password do not match",
        });
      }

      const passwordRegex =
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[0-9a-zA-Z!@#$%^&*()_+]{8,}$/;

      if (!passwordRegex.test(newPassword, confirmPassword)) {
        return res.status(400).send({
          message:
            "Password must contain at least 8 characters including an uppercase letter, a symbol, and a number",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashPass = await bcrypt.hash(newPassword, salt);

      const userPassword = await User.update(
        { password: hashPass },
        { where: { id: userExist.id } }
      );
      await transaction.commit();
      res.send({
        message: "Change Password Success",
        data: userPassword,
        userExist,
      });
    } catch (err) {
      await transaction.rollback();
      console.log(err);
      res.status(400).send({
        message: "Server Error!",
      });
    }
  },
};
