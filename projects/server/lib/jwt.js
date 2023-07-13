const jwt = require("jsonwebtoken");
module.exports = {
  createToken: (payload) => {
    return jwt.sign(payload, "galaxy", { expiresIn: "24h" });
  },

  validateToken: (token) => {
    return jwt.verify(token, "galaxy");
  },
};
