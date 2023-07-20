const db = require("..//models");
const User = db.User;
const jwt = require("jsonwebtoken");

module.exports = {
  tokenValid: async (req, res) => {
    let token = req.headers.authorization;
    token = token.split(" ")[1];
    try {
      const verified = jwt.verify(token, "galaxy");
      res.status(200).send({
        message: "Token is valid",
        user: verified.id,
      });
    } catch (err) {
      res.status(400).send({
        message: "Invalid or expired token",
      });
    }
  },
};
