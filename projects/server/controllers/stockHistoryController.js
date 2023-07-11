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
      const limit = 5;
      const productSearch = req.query.productSearch || "";
      if (productSearch) page = 0;
      let warehouse = parseInt(req.query.warehouse);
      const month = req.query.month;

      let startDate = null;
      let endDate = null;
      if (month) {
        startDate = moment(month, "MM").startOf("month").format("YYYY-MM-DD");
        endDate = moment(month, "MM").endOf("month").format("YYYY-MM-DD");
      }

      const result = await StockHistory.findAndCountAll({
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
        offset: page * limit,
        limit: limit,
      });

      const totalRow = result.count;

      const totalPage = Math.ceil(totalRow / limit);

      res.status(200).send({
        result,
        totalPage,
        totalRow,
        month: month,
      });
    } catch (error) {
      console.log(error);
    }
  },
};
