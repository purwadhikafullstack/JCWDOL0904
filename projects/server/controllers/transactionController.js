const db = require("../models");
const { Transaction } = db;
const axios = require("axios");

module.exports = {
  // Get All Transaction
  getAllTransaction: async (req, res) => {
    try {
      const result = await Transaction.findAll();
      console.log(result);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
