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
      let startDate = req.query.startDate || moment().format("YYYY-MM-DD");
      let endDate = req.query.endDate || moment().format("YYYY-MM-DD");

      if (endDate) {
        const nextDay = moment(endDate).add(1, "days");
        endDate = nextDay.format("YYYY-MM-DD");
      }

      if (adminWarehouse) {
        idWarehouse = adminWarehouse;
      }
      let result = null;
      result = await TransactionItem.findAndCountAll({
        where: {
          ...(selectedCategory ? { category: selectedCategory } : {}),
          ...(startDate && endDate
            ? {
                createdAt: {
                  [Op.between]: [startDate, endDate],
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
            include: {
              model: Warehouse,
              paranoid: false,
              where: {
                [Op.or]: [
                  { deletedAt: { [Op.ne]: null } },
                  { deletedAt: null },
                ],
              },
            },
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
            ...(startDate && endDate
              ? {
                  createdAt: {
                    [Op.between]: [startDate, endDate],
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
              include: {
                model: Warehouse,
                paranoid: false,
                where: {
                  [Op.or]: [
                    { deletedAt: { [Op.ne]: null } },
                    { deletedAt: null },
                  ],
                },
              },
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
        result: productLimited,
        totalPage,
        page,
        totalPriceFiltered,
        total_price,
        message: "Success get data",
      });
    } catch (error) {
      res.status(400).send({
        message: "Fail to get data",
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
        message: "Success get data",
      });
    } catch (error) {
      res.status(400).send({ message: "Fail to get data" });
    }
  },
};
