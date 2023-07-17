const db = require("../models");
const { Warehouse, Products, StockHistory } = db;
const axios = require("axios");
const { Op, where } = require("sequelize");
const moment = require("moment");

module.exports = {
  getStockHistory: async (req, res) => {
    try {
      let page = parseInt(req.query.page);
      console.log(page);
      const limit = 8;
      const productSearch = req.query.productSearch || "";
      if (productSearch) page = 0;
      let warehouse = parseInt(req.query.warehouse);
      const month = req.query.month;
      let orderFilter = req.query.order;
      let sortFilter = req.query.sort;

      let startDate = null;
      let endDate = null;
      if (month) {
        startDate = moment(month, "MM").startOf("month").format("YYYY-MM-DD");
        endDate = moment(month, "MM").endOf("month").format("YYYY-MM-DD");
      }

      let result = null;
      result = await StockHistory.findAndCountAll({
        where: {
          ...(month
            ? { createdAt: { [Op.gte]: startDate, [Op.lte]: endDate } }
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
          { model: Warehouse },
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
            ...(month
              ? { createdAt: { [Op.gte]: startDate, [Op.lte]: endDate } }
              : {}),
            ...(warehouse ? { id_warehouse: warehouse } : {}),
          },
          include: [
            {
              model: Products,
              where: {
                product_name: { [db.Sequelize.Op.like]: `%${productSearch}%` },
              },
            },
            { model: Warehouse },
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
        month: month,
        orderFilter,
        sortFilter,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        message: "Error!",
      });
    }
  },
};
