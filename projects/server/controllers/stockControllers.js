const db = require("../models");
const stoc = db.Stocks;
const product = db.Products;
const stockHistory = db.StockHistory;
const { Op } = require("sequelize");

module.exports = {
  geAllProductStock: async (req, res) => {
    try {
      const ware = req.query.ware;
      let page = req.query.page || 0;
      const search = req.query.search || "";
      let limit = 5;
      const stockFilter = req.query.stockFilter;
      let sto;
      if (search) page = 0;

      if (stockFilter === null) {
        sto = null;
      } else if (stockFilter === "1") {
        sto = 0;
      } else if (stockFilter === "2") {
        sto = { [Op.and]: { [Op.gt]: 0, [Op.lt]: 100 } };
      } else if (stockFilter === "3") {
        sto = { [Op.gt]: 100 };
      }
      console.log(sto);

      const result = await product.findAndCountAll({
        where: { product_name: { [Op.like]: `%${search}%` } },
        include: [
          {
            model: stoc,
            where:
              sto || sto === 0
                ? { id_warehouse: ware, stock: sto }
                : { id_warehouse: ware },
          },
        ],
        limit,
        offset: page * limit,
      });

      const forPage = await product.findAndCountAll({
        where: { product_name: { [Op.like]: `%${search}%` } },
        limit,
        offset: page * limit,
      });

      const totalPage = Math.ceil(forPage.count / limit);
      res.status(200).send({ result: result.rows, totalPage });
    } catch (error) {
      console.log(error);
    }
  },
  updateStock: async (req, res) => {
    try {
      const { newStock, id } = req.body;
      const currentStock = await stoc.findOne({
        where: { id },
      });
      const stockIncrease = await stoc.update(
        {
          stock: newStock + currentStock.stock,
        },
        { where: { id } }
      );

      const historyStock = await stockHistory.create({
        quantity: newStock,
        id_product: currentStock.id_product,
        status: "in",
        id_warehouse: currentStock.id_warehouse,
      });
      res.status(200).send({ currentStock, historyStock });
    } catch (error) {
      console.log(error);
    }
  },
  decreaseStock: async (req, res) => {
    try {
      const { newStock, id } = req.body;
      const currentStock = await stoc.findOne({
        where: { id },
      });

      const stockDecrease = await stoc.update(
        {
          stock: currentStock.stock - newStock,
        },
        { where: { id } }
      );

      const historyStock = await stockHistory.create({
        quantity: newStock,
        id_product: currentStock.id_product,
        status: "out",
        id_warehouse: currentStock.id_warehouse,
      });

      res.status(200).send({ stockDecrease, historyStock });
    } catch (error) {
      console.log(error);
    }
  },
};
