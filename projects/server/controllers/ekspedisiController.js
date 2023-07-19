const db = require("../models");
const { Ekspedisi } = db;

module.exports = {
  getUserEkspedisi: async (req, res) => {
    try {
      const data = await Ekspedisi.findAll();
      res.status(200).send(data);
    } catch (error) {
      console.error(error);
    }
  },
  getAllEkspedisi: async (req, res) => {
    try {
      let page = Number(req.query.page);
      const limit = 8;

      const totalOrders = await Ekspedisi.count();
      const totalPages = Math.ceil(totalOrders / limit);

      const data = await Ekspedisi.findAll({
        order: [["createdAt", "DESC"]],
        limit,
        offset: page * limit,
      });
      res.status(200).send({ data, totalPages });
    } catch (error) {
      console.error(error);
    }
  },
  createEkspedisi: async (req, res) => {
    const { name } = req.body;
    try {
      const ekspedisi = await Ekspedisi.create({ name });

      res.status(200).send({
        message: "Ekspedisi created successfully",
        data: ekspedisi,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Failed to create Ekspedisi",
      });
    }
  },
  deleteEkspedisi: async (req, res) => {
    const { id } = req.params;
    try {
      const ekspedisi = await Ekspedisi.findByPk(id);
      if (!ekspedisi) {
        return res.status(404).send({
          message: "Ekspedisi not found",
        });
      }

      await ekspedisi.destroy();

      res.status(200).send({
        message: "Ekspedisi deleted successfully",
        data: ekspedisi,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Failed to delete Ekspedisi",
      });
    }
  },
};
