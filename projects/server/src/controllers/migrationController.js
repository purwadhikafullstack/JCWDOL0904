const db = require("..//models");
const warehous = db.Warehouse;
const stoc = db.Stocks;
const stockMovement = db.StockMovement;

module.exports = {
  migrationStock: async (req, res) => {
    try {
      const { id_warehouse_sender, id_warehouse_receive, id } = req.body;

      const cekWarehouseReceive = await warehous.findOne({
        where: {
          id: id_warehouse_receive,
        },
      });
      const cekWarehouseSender = await warehous.findOne({
        where: {
          id: id_warehouse_sender,
        },
      });

      if (!cekWarehouseReceive || !cekWarehouseSender) {
        throw new Error("Someone has deleted the warehouse!");
      }
      const result = await stockMovement.findOne({
        where: { id },
      });
      const getWarehouseDataSender = await warehous.findOne({
        where: { id: result.warehouse_sender_id },
        include: [stoc],
      });

      if (!getWarehouseDataSender) {
        throw new Error("Someone has deleted the warehouse!");
      }
      const getWarehouseDataReceive = await warehous.findOne({
        where: { id: result.warehouse_receive_id },
        include: [stoc],
      });
      if (!getWarehouseDataReceive) {
        throw new Error("Someone has deleted the warehouse!");
      }
      let getAllStockReceive = [];
      let getAllStockSender = [];
      getWarehouseDataSender.Stocks.forEach((el) => {
        getAllStockSender.push(el);
      });
      getWarehouseDataReceive.Stocks.forEach((el) => {
        getAllStockReceive.push(el);
      });

      const allSimilarProduct = getAllStockSender.filter((sender) =>
        getAllStockReceive.some(
          (receive) => receive.id_product === sender.id_product
        )
      );
      const allDifferentproduct = getAllStockSender.filter(
        (sender) =>
          !getAllStockReceive.some(
            (receive) => receive.id_product === sender.id_product
          )
      );

      res.status(200).send({
        allSimilarProduct,
        allDifferentproduct,
      });
    } catch (error) {
      res.status(400).send({
        message: error.message,
      });
    }
  },
  createMigration: async (req, res) => {
    try {
      const { warehouse_receive_id, warehouse_sender_id } = req.body;
      const cekWarehouseReceive = await warehous.findOne({
        where: {
          id: warehouse_receive_id,
        },
      });
      const cekWarehouseSender = await warehous.findOne({
        where: {
          id: warehouse_sender_id,
        },
      });

      if (!cekWarehouseReceive || !cekWarehouseSender) {
        throw new Error("Someone has deleted the warehouse!");
      }
      const allproduct = await stoc.findAll({
        where: { id_warehouse: warehouse_sender_id },
      });

      allproduct.forEach(async (el) => {
        if (el.stock > 0) {
          await stockMovement.create({
            warehouse_receive_id,
            warehouse_sender_id,
            quantity: el.stock,
            id_product: el.id_product,
            status: "migration",
          });
        }
      });

      res.status(200).send({
        allproduct,
      });
    } catch (error) {
      res.status(400).send({
        message: error.message,
      });
    }
  },
};
