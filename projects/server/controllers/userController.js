const db = require("../models");

const user = db.User;

module.exports = {
  register: async (req, res) => {
    try {
      const { email } = req.body;

      const result = await user.create({
        email,
      });
      res.status(200).send({
        message: "Register Sucess",
        result,
      });
    } catch (err) {
      console.log(err);
    }
  },
};
