const db = require("..//models");
const transactionItem = db.TransactionItem;
const transaksi = db.Transaction;
const stockmovement = db.StockMovement;
const user = db.User;
const { Op } = require("sequelize");
const moment = require("moment");

module.exports = {
  countAllTransaction: async (req, res) => {
    try {
      const adminData = req.dataToken;
      const dataAdmin = await user.findOne({
        paranoid: false,
        where: {
          id: adminData.id,
          [Op.or]: [{ deletedAt: { [Op.ne]: null } }, { deletedAt: null }],
        },
      });

      const result = await transaksi.findAndCountAll({
        where: {
          status: {
            [Op.notIn]: ["Order Confirmed", "Canceled"],
          },
          ...(dataAdmin.id_warehouse
            ? { id_warehouse: dataAdmin.id_warehouse }
            : {}),
        },
        limit: 3,
      });

      res.status(200).send({ result: result.count });
    } catch (error) {
      res.status(400).send({
        message: "failed got transaction ongoing!",
      });
    }
  },
  countAllMutation: async (req, res) => {
    try {
      const adminData = req.dataToken;
      const dataAdmin = await user.findOne({
        where: { id: adminData.id },
      });

      let result;
      if (dataAdmin.id_warehouse) {
        const sender = await stockmovement.findAll({
          where: {
            status: {
              [Op.notIn]: ["rejected", "approved"],
            },
            warehouse_sender_id: dataAdmin.id_warehouse,
          },
        });

        const receive = await stockmovement.findAll({
          where: {
            status: {
              [Op.notIn]: ["rejected", "approved"],
            },
            warehouse_receive_id: dataAdmin.id_warehouse,
          },
        });
        result = sender.length + receive.length;
      } else {
        const getAll = await stockmovement.findAll({
          where: {
            status: {
              [Op.notIn]: ["rejected", "approved"],
            },
          },
        });
        result = getAll.length;
      }

      res.status(200).send({ result });
    } catch (error) {
      res.status(400).send({
        message: "failed get mutation ongoing!",
      });
    }
  },
  countAllUserBuy: async (req, res) => {
    try {
      let warehous = req.body.warehouseprice || null;
      const adminData = req.dataToken;
      const dataAdmin = await user.findOne({
        paranoid: false,
        where: {
          id: adminData.id,
          [Op.or]: [{ deletedAt: { [Op.ne]: null } }, { deletedAt: null }],
        },
      });

      if (dataAdmin.id_warehouse) warehous = dataAdmin.id_warehouse;

      const startDate = moment().startOf("month").format("YYYY-MM-DD");
      const endDate = moment().endOf("month").format("YYYY-MM-DD");

      const result = await transaksi.findAll({
        where: {
          createdAt: {
            [db.Sequelize.Op.between]: [new Date(startDate), new Date(endDate)],
          },
          ...(warehous === "All Warehouse" || warehous === null
            ? {}
            : { id_warehouse: parseInt(warehous) }),
        },
        include: [transactionItem],
      });

      const countQty = {};
      result.forEach((el) => {
        if (countQty[`${el.id_user}`]) {
          countQty[`${el.id_user}`] += el.total_price;
        } else {
          countQty[`${el.id_user}`] = el.total_price;
        }
      });

      const userPrice = [];
      const userData = await user.findAll({
        paranoid: false,
        where: {
          [Op.or]: [{ deletedAt: { [Op.ne]: null } }, { deletedAt: null }],
        },
      });
      userData.forEach((el) => {
        if (countQty[`${el.id}`]) {
          userPrice.push({
            id: el.id,
            username: el.username,
            price: countQty[`${el.id}`],
          });
        }
      });

      res.status(200).send({ result, userPrice });
    } catch (error) {
      res.status(400).send({
        message: "Failed get user buy!",
      });
    }
  },
};
