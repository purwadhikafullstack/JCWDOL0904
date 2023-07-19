const db = require("..//models");
const product = db.Products;
const transactionItem = db.TransactionItem;
const stoc = db.Stocks;
const transaksi = db.Transaction;
const user = db.User;
const moment = require("moment");

module.exports = {
  getMostSold: async (req, res) => {
    try {
      const startDate = moment().startOf("month").format("YYYY-MM-DD");
      const endDate = moment().endOf("month").format("YYYY-MM-DD");
      let idWarehouse = req.query.warehouses;
      const adminData = req.dataToken;
      const dataAdmin = await user.findOne({
        where: { id: adminData.id },
      });

      if (dataAdmin.id_warehouse) idWarehouse = dataAdmin.id_warehouse;
      const results = await transactionItem.findAll({
        where: {
          createdAt: {
            [db.Sequelize.Op.between]: [new Date(startDate), new Date(endDate)],
          },
        },
        include: [
          {
            model: transaksi,
            ...(idWarehouse === "All Warehouse"
              ? {}
              : { where: { id_warehouse: parseInt(idWarehouse) } }),
          },
          { model: product },
        ],
      });

      const productMostSeld = {};
      results.forEach((el) => {
        if (productMostSeld[`${el.Product.id}`]) {
          productMostSeld[`${el.Product.id}`] += el.quantity;
        } else {
          productMostSeld[`${el.Product.id}`] = el.quantity;
        }
      });

      const AllStocks = await stoc.findAll({
        attributes: ["stock"],
      });
      let totalStock = 0;
      AllStocks.forEach((el) => {
        totalStock += el.stock;
      });

      const allProduct = await product.findAll();
      const productFavoriteData = [];
      allProduct.forEach((el) => {
        if (productMostSeld[`${el.id}`]) {
          productFavoriteData.push({
            product_image: el.product_image,
            product_name: el.product_name,
            qty: productMostSeld[`${el.id}`],
            product_sold: (productMostSeld[`${el.id}`] / totalStock) * 100,
            totalStock,
          });
        }
      });
      productFavoriteData.sort((a, b) => {
        return b.product_sold - a.product_sold;
      });
      const different = productFavoriteData.map((el) => {
        return {
          product_image: el.product_image,
          product_name: el.product_name,
          qty: el.qty,
          product_sold:
            (el.product_sold / productFavoriteData[0].product_sold) * 100,
          totalStock: el.totalStock,
        };
      });
      res.status(200).send({
        results,
        productMostSeld,
        totalStock,
        AllStocks,
        productFavoriteData: different,
        startDate,
        endDate,
      });
    } catch (error) {
      res.status(400).send({
        message: "Something went wrong",
      });
    }
  },
};
