const db = require("../models");
const stoc = db.Stocks;
const product = db.Products;
const stockHistory = db.StockHistory;
const ware = db.Warehouse;
const user = db.User;
const { Op } = require("sequelize");

module.exports = {
  geAllProductStock: async (req, res) => {
    try {
      let warehous = req.query.ware;
      let page = req.query.page || 0;
      const search = req.query.search || "";
      let categoryFilter = req.query.categoryFilter || "";
      const sort = req.query.sort || "ASC";
      let limit = 5;
      const stockFilter = req.query.stockFilter;
      let sto;
      const dataToken = req.dataToken;

      const findAdmin = await user.findOne({
        where: { id: dataToken.id },
      });
      let adminWarehouse;
      if (!findAdmin) throw new Error("Your account is not found!");
      if (findAdmin.id_warehouse) {
        warehous = findAdmin.id_warehouse;
        adminWarehouse = await ware.findOne({
          where: { id: findAdmin.id_warehouse },
        });
      }

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
      let result;
      result = await product.findAndCountAll({
        order: [[stoc, "stock", sort]],
        where: {
          product_name: { [Op.like]: `%${search}%` },
          ...(categoryFilter ? { id_category: categoryFilter } : {}),
        },
        include: [
          {
            model: stoc,
            where:
              sto || sto === 0
                ? { id_warehouse: warehous, stock: sto }
                : { id_warehouse: warehous },
          },
        ],
        offset: page * limit,
      });
      const forPage = await product.findAll({
        where: {
          product_name: { [Op.like]: `%${search}%` },
          ...(categoryFilter ? { id_category: categoryFilter } : {}),
        },
        include: [
          {
            model: stoc,
            where:
              sto || sto === 0
                ? { id_warehouse: warehous, stock: sto }
                : { id_warehouse: warehous },
          },
        ],
      });
      const totalPage = Math.ceil(forPage.length / limit);
      if (page >= totalPage && totalPage > 0) {
        page = totalPage - 1;
        result = await product.findAndCountAll({
          order: [[stoc, "stock", sort]],
          where: {
            product_name: { [Op.like]: `%${search}%` },
            ...(categoryFilter ? { id_category: categoryFilter } : {}),
          },
          include: [
            {
              model: stoc,
              where:
                sto || sto === 0
                  ? { id_warehouse: warehous, stock: sto }
                  : { id_warehouse: warehous },
            },
          ],
          offset: page * limit,
        });
      }
      const limitedData = result.rows.slice(0, limit);
      res.status(200).send({
        result: limitedData,
        totalPage,
        categoryFilter,
        adminWarehouse,
      });
    } catch (error) {
      res.status(400).send({
        message: error.message,
      });
    }
  },
  updateStock: async (req, res) => {
    try {
      const { newStock, id } = req.body;
      const dataToken = req.dataToken;
      const cekAdmin = await user.findOne({
        where: { id: dataToken.id },
      });
      if (!cekAdmin) throw new Error("Your account is not found!");
      const currentStock = await stoc.findOne({
        where: { id },
      });
      const cekWarehouse = await ware.findOne({
        where: {
          id: currentStock.id_warehouse,
        },
      });

      if (!cekWarehouse) throw new Error("Someone has deleted the warehouse!");
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
        current_stock: newStock + currentStock.stock,
      });
      res.status(200).send({ currentStock, historyStock });
    } catch (error) {
      res.status(400).send({
        message: error.message,
      });
    }
  },
  decreaseStock: async (req, res) => {
    try {
      const { newStock, id } = req.body;
      const currentStock = await stoc.findOne({
        where: { id },
      });
      const dataToken = req.dataToken;
      const cekAdmin = await user.findOne({
        where: { id: dataToken.id },
      });
      if (!cekAdmin) throw new Error("Your account is not found!");

      const cekWarehouse = await ware.findOne({
        where: {
          id: currentStock.id_warehouse,
        },
      });
      if (!cekWarehouse) throw new Error("Someone has deleted the warehouse!");
      if (currentStock.stock < newStock)
        throw new Error("You subtracking too many stock!");

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
        current_stock: currentStock.stock - newStock,
      });

      res.status(200).send({ stockDecrease, historyStock });
    } catch (error) {
      res.status(400).send({
        message: error.message,
      });
    }
  },
  initialDataStock: async (req, res) => {
    try {
      const { id } = req.body;
      const allProduct = await product.findAll();

      await Promise.all(
        allProduct.forEach(async (el) => {
          await stoc.create({
            stock: 0,
            id_product: el.id,
            id_warehouse: id,
          });
        })
      );

      res.status(200).send({ allProduct });
    } catch (error) {
      res.status(400).send({
        message: "Something went wrong",
      });
    }
  },
};
