const db = require("..//models");
const { Op } = require("sequelize");
const { sequelize } = require("..//models");
const User = db.User;
const transaction = db.Transaction;
const Warehouse = db.Warehouse;
const jwt = require("jsonwebtoken");
const nodemailer = require("..//helpers/nodemailer");
const fs = require("fs");
const handlebars = require("handlebars");
const { error } = require("console");
const bcrypt = require("bcrypt");

module.exports = {
  userRegister: async (req, res) => {
    const trans = await sequelize.transaction();
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
        paranoid: true,
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
        paranoid: true,
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

      const verificationLink = `${process.env.IMAGE_URL}verification/${token}`;

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

      await trans.commit();
      res.status(200).send({
        message: "Register success, please check your email",
        result,
      });
    } catch (err) {
      await trans.rollback();
      return res.status(400).send({
        message: "Fail to register",
      });
    }
  },

  addAdmin: async (req, res) => {
    try {
      const { email, fullname, username, password } = req.body;
      const { id } = req.dataToken;

      const cekUsername = await User.findAll({
        paranoid: true,
        where: {
          username,
        },
      });

      if (cekUsername.length > 0)
        return res.status(400).send({
          message: "username already exist!",
        });

      const cekEmail = await User.findAll({
        paranoid: true,
        where: {
          email,
        },
      });
      if (cekEmail.length > 0)
        return res.status(400).send({
          message: "email already exist!",
        });
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
      return res.status(40).send({
        message: "Register new Admin fail",
      });
    }
  },

  getUserData: async (req, res) => {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).send({
          message: "Fail to get user data",
        });
      }
      const result = await User.findOne({
        where: {
          id,
        },
      });
      res.status(200).send({
        result,
      });
    } catch (error) {
      res.status(400).send({ message: "Fail to get user data" });
    }
  },

  getAllUserData: async (req, res) => {
    try {
      let page = req.query.page;
      let email = req.query.email;
      const limit = 8;

      const result = await User.findAndCountAll({
        where: {
          email: {
            [db.Sequelize.Op.like]: `%${email}%`,
          },
        },
        include: [
          {
            model: Warehouse,
          },
        ],
        limit,
        offset: page * limit,
      });

      const totalPages = Math.ceil(result.count / limit);

      res.status(200).send({
        result,
        message: "Get all user data success",
        totalPages,
      });
    } catch (error) {
      res.status(404).send({ message: "Fail to get user data" });
    }
  },

  getUserById: async (req, res) => {
    try {
      const { id } = req.dataToken;
      if (!id) {
        return res.status(400).send({
          message: "There's no user data",
        });
      }
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
      res.status(404).send({ message: "Cant find user" });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { id } = req.body;
      const dataRole = req.dataToken;
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
      res.status(400).send({
        message: "Delete user fail",
      });
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
      const resetLink = `${process.env.IMAGE_URL}inputpassword/${token}`;
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
      res.status(200).send({
        message: "Please check your email",
        user,
      });
    } catch (err) {
      res.status(400).send({
        message: "Fail to send send email",
      });
    }
  },

  updateUserData: async (req, res) => {
    try {
      const { id, username, fullname, password, role } = req.body;
      const dataToken = req.dataToken;

      const findAdminPassword = await User.findOne({
        where: { id: dataToken.id },
      });

      const isValid = await bcrypt.compare(
        password,
        findAdminPassword.dataValues.password
      );

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
      res.status(400).send({
        message: "Fail to update user data",
      });
    }
  },

  changeUsername: async (req, res) => {
    try {
      let username = req.body.username;
      const { id } = req.dataToken;
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
      res.status(400).send({ message: "Fail to change username" });
    }
  },
};
