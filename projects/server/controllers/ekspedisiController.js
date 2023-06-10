const db = require("../models");
const { Ekspedisi } = db;

module.exports = {
    getAllEkspedisi: async (req, res) => {
        try {
            const data = await Ekspedisi.findAll();
            res.status(200).send(data);
        } catch (error) {
            console.error(error);
        }
    },
}