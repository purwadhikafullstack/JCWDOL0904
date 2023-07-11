const db = require("../models");
const warehous = db.Warehouse;
const stoc = db.Stocks;
const produc = db.Products;
const stockMovement = db.StockMovement;
const stockHistory = db.StockHistory;

module.exports = {
  migrationStock: async (req, res) => {
    try {
      const { id_warehouse_sender, id_warehouse_receive, id } = req.body;

      const result = await stockMovement.findOne({
        where: { id },
      });
      const getWarehouseDataSender = await warehous.findOne({
        where: { id: result.warehouse_sender_id },
        include: [stoc],
      });
      const getWarehouseDataReceive = await warehous.findOne({
        where: { id: result.warehouse_receive_id },
        include: [stoc],
      });

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

      // if (allSimilarProduct.length > 0) {
      //   allSimilarProduct.forEach(async (el) => {
      //     await stoc.update(
      //       { stock: el.stock },
      //       { where: { id_product: el.id_product } }
      //     );
      //     await stockHistory.create({
      //       quantity: el.stock,
      //       status: "in",
      //       id_product: el.id_product,
      //       id_warehouse: id_warehouse_receive,
      //     });
      //     await stockHistory.create({
      //       quantity: el.stock,
      //       status: "out",
      //       id_product: el.id_product,
      //       id_warehouse: id_warehouse_sender,
      //     });
      //   });
      // }
      // if (allDifferentproduct.length > 0) {
      //   allDifferentproduct.forEach(async (el) => {
      //     await stoc.create({
      //       stock: el.stock,
      //       id_product: el.id_product,
      //       id_warehouse: el.id_warehouse,
      //     });
      //     await stockHistory.create({
      //       quantity: el.stock,
      //       status: "in",
      //       id_product: el.id_product,
      //       id_warehouse: result.warehouse_receive_id,
      //     });
      //     await stockHistory.create({
      //       quantity: el.stock,
      //       status: "out",
      //       id_product: el.id_product,
      //       id_warehouse: result.warehouse_sender_id,
      //     });
      //   });
      // }

      // getAllStockReceive.forEach((receive) => {
      //   const sameproduct = getAllStockSender.find((sender) => {
      //     return receive.id_product === sender.id_product;
      //   });
      //   allSimilarProduct.push(sameproduct);
      // });
      // getAllStockReceive.forEach((receive) => {
      //   const sameproduct = getAllStockSender.find((sender) => {
      //     return receive.id_product !== sender.id_product;
      //   });
      //   allDifferentproduct.push(sameproduct);
      // });

      res.status(200).send({
        allSimilarProduct,
        allDifferentproduct,
      });
    } catch (error) {
      console.log(error);
    }
  },
  createMigration: async (req, res) => {
    try {
      const { warehouse_receive_id, warehouse_sender_id } = req.body;
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
      // const result = stockMovement.create({});

      res.status(200).send({
        allproduct,
      });
    } catch (error) {
      console.log(error);
    }
  },
};
