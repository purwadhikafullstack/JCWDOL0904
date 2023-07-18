const db = require("../models");
const { Warehouse, Products, StockHistory } = db;
const axios = require("axios");
const { Op, where } = require("sequelize");
const moment = require("moment");

module.exports = {
  getStockHistory: async (req, res) => {
    try {
      let page = parseInt(req.query.page);
      const limit = 8;
      const productSearch = req.query.productSearch || "";
      if (productSearch) page = 0;
      let warehouse = parseInt(req.query.warehouse);
      let orderFilter = req.query.order;
      let sortFilter = req.query.sort;
      let startDate = req.query.startDate || moment().format("YYYY-MM-DD");
      let endDate = req.query.endDate || moment().format("YYYY-MM-DD");

      if (endDate) {
        const nextDay = moment(endDate).add(1, "days");
        endDate = nextDay.format("YYYY-MM-DD");
      }

      let result = null;
      result = await StockHistory.findAndCountAll({
        where: {
          ...(startDate && endDate
            ? {
                createdAt: {
                  [Op.between]: [startDate, endDate],
                },
              }
            : {}),
          ...(warehouse ? { id_warehouse: warehouse } : {}),
        },
        include: [
          {
            model: Products,
            paranoid: false,
            where: {
              [Op.or]: [{ deletedAt: { [Op.ne]: null } }, { deletedAt: null }],
              product_name: { [db.Sequelize.Op.like]: `%${productSearch}%` },
            },
          },
          {
            model: Warehouse,
            paranoid: false,
            where: {
              [Op.or]: [{ deletedAt: { [Op.ne]: null } }, { deletedAt: null }],
            },
          },
        ],
        order: [[orderFilter, sortFilter]],
        offset: page * limit,
        limit: limit,
      });

      const totalRow = result.count;

      const totalPage = Math.ceil(totalRow / limit);
      if (totalPage <= page) {
        page = Math.abs(totalPage - 1);
        result = await StockHistory.findAndCountAll({
          where: {
            ...(startDate && endDate
              ? {
                  createdAt: {
                    [Op.between]: [startDate, endDate],
                  },
                }
              : {}),
            ...(warehouse ? { id_warehouse: warehouse } : {}),
          },
          include: [
            {
              model: Products,
              paranoid: false,
              where: {
                [Op.or]: [
                  { deletedAt: { [Op.ne]: null } },
                  { deletedAt: null },
                ],
                product_name: { [db.Sequelize.Op.like]: `%${productSearch}%` },
              },
            },
            {
              model: Warehouse,
              paranoid: false,
              where: {
                [Op.or]: [
                  { deletedAt: { [Op.ne]: null } },
                  { deletedAt: null },
                ],
              },
            },
          ],
          order: [[orderFilter, sortFilter]],
          offset: page * limit,
          limit: limit,
        });
      }

      res.status(200).send({
        result,
        totalPage,
        totalRow,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        message: "Error!",
      });
    }
  },
};
