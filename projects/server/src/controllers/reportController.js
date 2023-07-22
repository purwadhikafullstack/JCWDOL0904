const db = require("../models");
const transactionItem = db.TransactionItem;
const transaction = db.Transaction;
const ware = db.Warehouse;
const product = db.Products;
const { Op, where } = require("sequelize");
const moment = require("moment");

module.exports = {
  getAllReport: async (req, res) => {
    try {
      let idWarehouse = req.query.idWarehouse || null;
      const productSearch = req.query.productSearch || "";
      const adminWarehouse = req.query.adminWarehouse || null;
      const selectedCategory = req.query.selectedCategory || null;
      let limit = 5;
      const month = req.query.month || "07";
      let page = parseInt(req.query.page);
      let startDate = null;
      let endDate = null;

      if (month) {
        startDate = moment(month, "MM").startOf("month").format("YYYY-MM-DD");
        endDate = moment(month, "MM").endOf("month").format("YYYY-MM-DD");
      }
      if (adminWarehouse) {
        idWarehouse = adminWarehouse;
      }
      //   let result = null;
      //   result = await transactionItem.findAndCountAll({
      //     ...(selectedCategory
      //       ? {
      //           where: {
      //             category: selectedCategory,
      //             createdAt: {
      //               [Op.between]: [new Date(startDate), new Date(endDate)],
      //             },
      //           },
      //         }
      //       : {
      //           where: {
      //             createdAt: {
      //               [Op.between]: [new Date(startDate), new Date(endDate)],
      //             },
      //           },
      //         }),

      //     include: [
      //       {
      //         model: transaction,
      //         ...(idWarehouse
      //           ? {
      //               where: { id_warehouse: parseInt(idWarehouse) },
      //               include: [ware],
      //             }
      //           : { include: [ware] }),
      //       },
      //       {
      //         model: product,
      //         where: {
      //           product_name: {
      //             [db.Sequelize.Op.like]: `%${productSearch}%`,
      //           },
      //         },
      //       },
      //     ],
      //     offset: page * limit,
      //   });
      let result = null;
      result = await transactionItem.findAndCountAll({
        ...(selectedCategory ? { where: { category: selectedCategory } } : {}),
        include: [
          {
            model: transaction,
            where: {
              ...(idWarehouse ? { id_warehouse: idWarehouse } : {}),
              createdAt: {
                [Op.between]: [new Date(startDate), new Date(endDate)],
              },
            },
            include: [ware],
          },
          {
            model: product,
            where: { product_name: { [Op.like]: `%${productSearch}%` } },
          },
        ],
        offset: page * limit,
      });

      const totalPage = Math.ceil(result.count / limit);
      if (parseInt(page) >= totalPage && totalPage !== 0) {
        page = totalPage - 1;
        result = await transactionItem.findAndCountAll({
          ...(selectedCategory
            ? { where: { category: selectedCategory } }
            : {}),
          include: [
            {
              model: transaction,
              where: {
                ...(idWarehouse ? { id_warehouse: idWarehouse } : {}),
                createdAt: {
                  [Op.between]: [new Date(startDate), new Date(endDate)],
                },
              },
              include: [ware],
            },
            {
              model: product,
              where: { product_name: { [Op.like]: `%${productSearch}%` } },
            },
          ],
          offset: page * limit,
        });
      }
      let productLimited = [];
      if (result.rows.length > 0) {
        productLimited = result.rows.slice(0, limit);
      }
      const priceOnly = [];
      result.rows.forEach((el) => {
        priceOnly.push(el.price);
      });
      const totalPriceFiltered = priceOnly.reduce((acc, curr) => {
        return acc + curr;
      }, 0);
      const total_price = await transactionItem.sum("price");
      res.status(200).send({
        result: productLimited,
        idWarehouse,
        adminWarehouse,
        totalPage,
        page,
        totalPriceFiltered,
        total_price,
      });
    } catch (error) {
      res.status(400).send({
        message: " failed to get report!",
      });
    }
  },
};
