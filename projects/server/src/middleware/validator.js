const access = process.env.KEY_ACCESS;

module.exports = {
  authorize: async (req, res, next) => {
    if (req.headers.key == access) {
      return next();
    }
    res.status(500).send({ message: "Authorization failed" });
  },
};
