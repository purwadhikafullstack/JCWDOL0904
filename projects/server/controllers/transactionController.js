const db = require("../models");
const {
  Transaction,
  Warehouse,
  TransactionItem,
  Products,
  User,
  Category,
  Stocks,
} = db;
const axios = require("axios");
const { Op, where } = require("sequelize");
const moment = require("moment");

module.exports = {
  getAllProductTrans: async (req, res) => {
    try {
      let idWarehouse = req.query.idWarehouse || null;
      const productSearch = req.query.productSearch || "";
      const adminWarehouse = req.query.adminWarehouse || null;
      const selectedCategory = req.query.selectedCategory || null;
      let page = parseInt(req.query.page);
      let limit = 5;
      const month = req.query.month || "01";
      let orderFilter = req.query.order;
      let sortFilter = req.query.sort;

      let startDate = null;
      let endDate = null;
      if (month) {
        startDate = moment(month, "MM").startOf("month").format("YYYY-MM-DD");
        endDate = moment(month, "MM").endOf("month").format("YYYY-MM-DD");
      }
      if (adminWarehouse) {
        idWarehouse = adminWarehouse;
      }
      let result = null;
      result = await TransactionItem.findAndCountAll({
        where: {
          ...(selectedCategory ? { category: selectedCategory } : {}),
          ...(month
            ? {
                createdAt: {
                  [Op.between]: [new Date(startDate), new Date(endDate)],
                },
              }
            : {}),
        },
        include: [
          {
            model: Transaction,
            ...(idWarehouse
              ? { where: { id_warehouse: parseInt(idWarehouse) } }
              : {}),
            include: [Warehouse],
          },
          {
            model: Products,
            where: {
              product_name: {
                [db.Sequelize.Op.like]: `%${productSearch}%`,
              },
            },
          },
        ],
        order: [[orderFilter, sortFilter]],
        offset: page * limit,
      });

      const totalPage = Math.ceil(result.count / limit);
      if (parseInt(page) >= totalPage) {
        page = totalPage - 1;
        if ((page = 0)) {
          page = 0;
        }
        result = await TransactionItem.findAndCountAll({
          where: {
            ...(selectedCategory ? { category: selectedCategory } : {}),
            ...(month
              ? {
                  createdAt: {
                    [Op.between]: [new Date(startDate), new Date(endDate)],
                  },
                }
              : {}),
          },
          include: [
            {
              model: Transaction,
              ...(idWarehouse
                ? { where: { id_warehouse: parseInt(idWarehouse) } }
                : {}),
              include: [Warehouse],
            },
            {
              model: Products,
              where: {
                product_name: {
                  [db.Sequelize.Op.like]: `%${productSearch}%`,
                },
              },
            },
          ],
          order: [[orderFilter, sortFilter]],
          offset: page * limit,
        });
      }
      console.log(result);
      const productLimited = result.rows.slice(0, limit);
      const priceOnly = [];
      result.rows.forEach((el) => {
        priceOnly.push(el.price);
      });
      const totalPriceFiltered = priceOnly.reduce((acc, curr) => {
        return acc + curr;
      }, 0);
      const total_price = await TransactionItem.sum("price");
      res.status(200).send({
        startDate,
        result: productLimited,
        idWarehouse,
        adminWarehouse,
        totalPage,
        page,
        totalPriceFiltered,
        total_price,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        message: "Error!",
      });
    }
  },

  getTransactionById: async (req, res) => {
    try {
      const { id } = req.dataToken;

      const findUserId = await User.findOne({
        where: { id: id },
      });

      const result = await Transaction.findAll({
        where: { id_user: findUserId.id },
        order: [["transaction_date", "DESC"]],
        limit: 1,
      });

      res.status(200).send({
        result: result.length > 0 ? result : [],
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: "Server error" });
    }
  },
};
