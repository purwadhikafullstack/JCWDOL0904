const db = require("../models");
const transaction = db.Transaction;
const stoc = db.Stocks;
const stockHistory = db.StockHistory;
const { createNotification } = require("./notificationController");
module.exports = {
  cancelOrder: async (req, res) => {
    try {
      const { dataTransaction } = req.body;
      const warehouseId = dataTransaction.id_warehouse;
      const result = await transaction.findOne({
        where: { id: dataTransaction.id },
      });
      let allStockNow = [];

      let coba;
      let halo = [];
      if (result.status === "On Process") {
        await Promise.all(
          dataTransaction.TransactionItems?.map(async (element) => {
            const stockNow = await stoc.findOne({
              where: {
                id_product: element.id_product,
                id_warehouse: warehouseId,
              },
            });

            if (stockNow) {
              await stoc.update(
                {
                  stock: stockNow.stock + element.quantity,
                },
                { where: { id: stockNow.id } }
              );

              await transaction.update(
                {
                  status: "Canceled",
                },
                { where: { id: dataTransaction.id } }
              );

              await stockHistory.create({
                status: "in",
                id_product: element.id_product,
                id_warehouse: warehouseId,
                current_stock: stockNow.stock + element.quantity,
                quantity: element.quantity,
              });
            }
          })
        );
      } else if (
        result.status === "Shipped" ||
        result.status === "Order Confirmed" ||
        result.status === "Canceled"
      ) {
        throw new Error("Can't cancel this transaction!");
      } else {
        await Promise.all(
          dataTransaction.TransactionItems?.map(async (element) => {
            const stockNow = await stoc.findOne({
              where: {
                id_product: element.id_product,
                id_warehouse: warehouseId,
              },
            });

            if (stockNow) {
              await transaction.update(
                {
                  status: "Canceled",
                },
                { where: { id: dataTransaction.id } }
              );
            }
          })
        );
      }
      await createNotification(
        `Invoice ${result.invoice_number}`,
        "Your order is being canceled",
        result.id_user,
        "admin"
      );
      res.status(200).send({
        result,
        coba,
        dataTransaction: dataTransaction,
        allStockNow,
        idWarehouse: dataTransaction.id_warehouse,
        idProduct: dataTransaction.TransactionItems[0].id_product,
        halo,
      });
    } catch (error) {
      res.status(400).send({
        message: error.message,
      });
    }
  },
};
