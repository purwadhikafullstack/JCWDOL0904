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
  // Get All Transaction
  // getAllTransaction: async (req, res) => {
  //   try {
  //     let page = parseInt(req.query.page);
  //     const limit = 5;
  //     const invoiceNumber = req.query.invoiceNumber || "";
  //     const role = req.query.role;
  //     const warehouse = parseInt(req.query.warehouse);
  //     const category = req.query.category || "";
  //     // console.log(category);

  //     let changeWhere;
  //     if (role == "adminWarehouse") {
  //       changeWhere = {
  //         id: warehouse,
  //       };
  //     } else if (!warehouse) changeWhere = {};
  //     else if (warehouse && role == "admin") changeWhere = { id: warehouse };

  //     if (invoiceNumber) page = 0;

  //     let changeCategory = {
  //       category: category,
  //     };
  //     console.log(changeCategory);

  //     const transactionWhere = invoiceNumber
  //       ? {
  //           status: {
  //             [db.Sequelize.Op.ne]:
  //               "Canceled, Waiting For Payment Confirmation",
  //           },
  //           invoice_number: {
  //             [db.Sequelize.Op.like]: `%${invoiceNumber}%`,
  //           },
  //         }
  //       : {
  //           status: {
  //             [db.Sequelize.Op.ne]: "Canceled",
  //           },
  //         };

  //     const result = await Transaction.findAndCountAll({
  //       include: [
  //         {
  //           model: Warehouse,
  //           where: changeWhere,
  //         },
  //         {
  //           model: TransactionItem,
  //           ...(category ? { where: changeCategory } : {}),
  //           include: [Products],
  //         },
  //         {
  //           model: User,
  //         },
  //       ],
  //       where: transactionWhere,
  //       offset: page * limit,
  //       limit: limit,
  //     });
  //     // console.log(result);

  //     const total_price = await Transaction.sum("total_price", {
  //       where: {
  //         status: {
  //           [Op.ne]: "Canceled, Waiting For Payment Confirmation",
  //         },
  //       },
  //     });

  //     const totalItems = result.count;
  //     const totalPages = Math.ceil(totalItems / limit);
  //     let allTransaction = result.rows;

  //     res.status(200).send({
  //       // data: allTransaction,
  //       // totalPages,
  //       // total_price,
  //     });
  //   } catch (error) {
  //     // console.error(error);
  //     res.status(500).json({ error: "Internal server error" });
  //   }
  // },

  getAllProductTrans: async (req, res) => {
    try {
      let page = parseInt(req.query.page);
      const limit = 10;
      const role = req.query.role;
      const productSearch = req.query.productSearch || "";
      const userId = parseInt(req.query.userId);
      let warehouse = parseInt(req.query.warehouse);
      let categoryFilter = req.query.category || "";
      const month = req.query.month;

      let userData = await User.findOne({
        where: { id: userId },
      });

      if (userData.id_warehouse) warehouse = userData.id_warehouse;

      if (productSearch) page = 0;

      let startDate = null;
      let endDate = null;
      if (month) {
        startDate = moment(month, "MM").startOf("month").format("YYYY-MM-DD");
        endDate = moment(month, "MM").endOf("month").format("YYYY-MM-DD");
      }

      const result = await TransactionItem.findAll({
        where: {
          ...(categoryFilter ? { category: categoryFilter } : {}),
          ...(month
            ? { createdAt: { [Op.gte]: startDate, [Op.lte]: endDate } }
            : {}),
        },

        include: [
          {
            model: Products,
            where: {
              product_name: {
                [db.Sequelize.Op.like]: `%${productSearch}%`,
              },
            },
            include: [
              {
                model: TransactionItem,
                include: [
                  {
                    model: Transaction,

                    where: {
                      ...(warehouse ? { id_warehouse: warehouse } : {}),
                    },

                    include: [
                      {
                        model: Warehouse,
                      },
                    ],
                  },
                  {
                    model: Products,
                  },
                ],
              },
            ],
          },
        ],
        offset: page * limit,
        limit: limit,
      });

      let allProduct = [];
      result.forEach((el) => {
        const oneWarehouse = el.Product.TransactionItems.find((element) => {
          return el.id === element.id;
        });
        if (oneWarehouse) {
          allProduct.push(oneWarehouse);
        }
      });

      const paging = await TransactionItem.findAll({
        where: {
          ...(categoryFilter ? { category: categoryFilter } : {}),
          createdAt: {
            [Op.gte]: startDate,
            [Op.lte]: endDate,
          },
        },

        include: [
          {
            model: Products,
            where: {
              product_name: {
                [db.Sequelize.Op.like]: `%${productSearch}%`,
              },
            },
            include: [
              {
                model: TransactionItem,
                include: [
                  {
                    model: Transaction,

                    where: {
                      ...(warehouse ? { id_warehouse: warehouse } : {}),
                    },

                    include: [
                      {
                        model: Warehouse,
                      },
                    ],
                  },
                  {
                    model: Products,
                  },
                ],
              },
            ],
          },
        ],
      });

      let onePrice = [];
      paging.forEach((el) => {
        const oneWarehouse = el.Product.TransactionItems.find((element) => {
          return el.id === element.id;
        });
        if (oneWarehouse) {
          onePrice.push(oneWarehouse);
        }
      });

      const transactionByMonth = await TransactionItem.findAll({
        where: {
          createdAt: {
            [Op.gte]: startDate,
            [Op.lte]: endDate,
          },
        },
        include: [
          {
            model: Products,
            where: {
              product_name: {
                [db.Sequelize.Op.like]: `%${productSearch}%`,
              },
            },
            include: [
              {
                model: TransactionItem,
                include: [
                  {
                    model: Transaction,

                    where: {
                      ...(warehouse ? { id_warehouse: warehouse } : {}),
                    },

                    include: [
                      {
                        model: Warehouse,
                      },
                    ],
                  },
                  {
                    model: Products,
                  },
                ],
              },
            ],
          },
        ],
      });

      const priceOnly = onePrice.map((el) => {
        return el.price;
      });

      let priceFilter = priceOnly.reduce((acc, curr) => {
        return acc + curr;
      }, 0);

      const total_price = await TransactionItem.sum("price");
      const totalPages = Math.ceil(parseInt(onePrice.length) / limit);

      res.status(200).send({
        allProduct,
        totalPages,
        test: allProduct.length,
        total_price,
        total_value_by_month: priceFilter,
        warehouse,
        userId,
        month: month,
        transactionByMonth,
        priceFilter,
        priceOnly,
        onePrice,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getTimeTransaction: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;

      const result = await TransactionItem.findAll({
        where: {
          [Op.and]: [
            startDate && endDate
              ? {
                  createdAt: {
                    [Op.between]: [startDate, endDate],
                  },
                }
              : {},
          ],
        },
      });
      res.status(200).send({ result });
    } catch (error) {
      console.log(error);
    }
  },
  getMonthlyTransaction: async (req, res) => {
    try {
      const month = req.query.month;
      console.log(month);

      const startDate = moment(month, "MM")
        .startOf("month")
        .format("YYYY-MM-DD");
      const endDate = moment(month, "MM").endOf("month").format("YYYY-MM-DD");

      const result = await TransactionItem.findAll({
        where: {
          createdAt: {
            [Op.gte]: startDate,
            [Op.lte]: endDate,
          },
        },
      });

      res.status(200).send({ result, test: month });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: "An error occurred" });
    }
  },
};
