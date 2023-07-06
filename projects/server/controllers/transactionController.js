const db = require("../models");
const { Transaction, Warehouse, TransactionItem, Products, User, Category } =
  db;
const axios = require("axios");
const { Op, where } = require("sequelize");

module.exports = {
  // Get All Transaction
  getAllTransaction: async (req, res) => {
    try {
      let page = parseInt(req.query.page);
      const limit = 5;
      const invoiceNumber = req.query.invoiceNumber || "";
      const role = req.query.role;
      const warehouse = parseInt(req.query.warehouse);
      console.log(warehouse);

      let changeWhere;
      if (role == "adminWarehouse") {
        changeWhere = {
          id: warehouse,
        };
      } else if (!warehouse) changeWhere = {};
      else if (warehouse && role == "admin") changeWhere = { id: warehouse };

      if (invoiceNumber) page = 0;

      const transactionWhere = invoiceNumber
        ? {
            status: {
              [db.Sequelize.Op.ne]: "Canceled",
            },
            invoice_number: {
              [db.Sequelize.Op.like]: `%${invoiceNumber}%`,
            },
          }
        : {
            status: {
              [db.Sequelize.Op.ne]: "Canceled",
            },
          };

      const result = await Transaction.findAndCountAll({
        include: [
          {
            model: Warehouse,
            where: changeWhere,
          },
          {
            model: TransactionItem,
            include: [{ model: Products, include: [Category] }],
          },
          {
            model: User,
          },
        ],
        where: transactionWhere,
        offset: page * limit,
        limit: limit,
      });
      console.log(result);

      const total_price = await Transaction.sum("total_price", {
        where: {
          status: {
            [Op.ne]: "Canceled",
            // "Waiting For Payment Confirmation"
          },
        },
      });

      const totalItems = result.count;
      const totalPages = Math.ceil(totalItems / limit);
      let allTransaction = result.rows;

      res.status(200).send({
        data: allTransaction,
        totalPages,
        total_price,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
