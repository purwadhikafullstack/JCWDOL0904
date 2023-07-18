const db = require("../models");
const { Op, Transaction } = require("sequelize");
const User = db.User;
const transaction = db.Transaction;
const Warehouse = db.Warehouse;
const jwt = require("jsonwebtoken");
const nodemailer = require("../helpers/nodemailer");
const fs = require("fs");
const handlebars = require("handlebars");
const { error } = require("console");
const bcrypt = require("bcrypt");

module.exports = {
  // user register
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

      const result = await User.create({
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

  // Add Admin
  addAdmin: async (req, res) => {
    try {
      const { email, fullname, username, password } = req.body;
      const { id } = req.dataToken;
      console.log(email, fullname, username, password, id);

      const dataRole = await User.findOne({
        where: { id },
      });

      if (dataRole.role === "adminWarehouse") {
        return res.status(400).send({
          message: "Registration is not allowed for admin warehouse role",
        });
      }

      if (dataRole.role === "admin") {
        if (!email || !fullname || !username || !password) {
          return res.status(400).send({
            message: "Please input all your data",
          });
        }
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

      const result = await User.create({
        email,
        fullname,
        username,
        role: "adminWarehouse",
        password: hashPass,
      });

      return res.status(200).send({
        message: "Register new Admin Success",
      });
    } catch (error) {
      console.log(error);
    }
  },

  // get user data
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

  // get all user data
  getAllUserData: async (req, res) => {
    try {
      const result = await User.findAll({
        include: [
          {
            model: Warehouse,
          },
        ],
      });
      res.json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // get user by id
  getUserById: async (req, res) => {
    try {
      const { id } = req.dataToken;

      const user = await User.findOne({
        attributes: [
          "fullname",
          "username",
          "email",
          "is_verified",
          "role",
          "id_warehouse",
          "user_image",
        ],
        where: {
          id: id,
        },
      });

      res.status(200).send({
        user,
      });
    } catch (error) {
      res.status(400).send(error);
    }
  },

  // delete user by id
  deleteUser: async (req, res) => {
    try {
      const { id } = req.body;
      const dataRole = req.dataToken;
      // console.log(id);

      const noDeleteAdmin = await User.findOne({
        where: { id: id },
      });

      if (noDeleteAdmin.role === "admin") {
        return res.status(400).send({
          message: "You can't delete admin!",
        });
      }
      const data = await User.findOne({
        where: { id: dataRole.id },
      });

      if (data.role === "adminWarehouse" || data.role === "user") {
        return res.status(400).send({
          message: "You don't have permission!",
        });
      }

      const userStatus = await transaction.findOne({
        where: {
          id_user: id,
          status: { [Op.notIn]: ["Order Confirmed", "Canceled"] },
        },
      });
      console.log(userStatus);

      if (userStatus) {
        return res.status(400).send({
          message:
            "User cannot be deleted unless their status is 'cancel' or 'order confirm'!",
        });
      }
      const result = await User.destroy({
        where: {
          id,
        },
      });
      res.status(200).send({
        message: "Delete User data Success",
      });
    } catch (error) {
      console.log(error);
    }
  },

  // user forgot password request
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

      if (!user) {
        return res.status(400).send({
          message: "Cant find email, please register",
        });
      }

      let payload = { id: user.id };
      let token = jwt.sign(payload, "galaxy", {
        expiresIn: "5m",
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

  // Edit data
  updateUserData: async (req, res) => {
    try {
      const { id, username, fullname, password, role } = req.body;
      const dataToken = req.dataToken;
      // console.log(dataToken);

      const findAdminPassword = await User.findOne({
        where: { id: dataToken.id },
      });

      const isValid = await bcrypt.compare(
        password,
        findAdminPassword.dataValues.password
      );
      console.log(isValid);

      if (role === "adminWarehouse" || role === "user") {
        return res.status(400).send({
          message: "You don't have permission!",
        });
      }

      if (!username || !fullname || !password) {
        return res.status(400).send({
          message: "Please input all data",
        });
      }

      let result;
      if (isValid) {
        result = await User.update({ username, fullname }, { where: { id } });
      } else {
        res.status(400).send({
          message: "Please input correct password",
        });
      }

      res.status(200).send({
        message: "Update data success",
        result,
      });
    } catch (error) {
      console.log(error);
    }
  },

  changeUsername: async (req, res) => {
    try {
      let username = req.body.username;
      const { id } = req.dataToken;
      console.log(id);

      let result = await User.update(
        {
          username,
        },
        {
          where: { id: id },
        }
      );

      let changeUsername;
      if (result)
        changeUsername = await User.findOne({
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
          where: { id: id },
        });

      res.status(200).send({
        message: "Change username success",
        result,
        changeUsername,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  },
};
