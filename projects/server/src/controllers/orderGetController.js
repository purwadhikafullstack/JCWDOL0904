const { Op } = require("sequelize");
const {
  Transaction,
  Products,
  TransactionItem,
  Address,
  Ekspedisi,
} = require("..//models");
const db = require("..//models");

module.exports = {
  getAllOrderByUser: async (req, res) => {
    try {
      const { id } = req.dataToken;
      let page = Number(req.query.page);
      const limit = 5;
      const invoiceNumber = req.query.invoiceNumber;
      const status = req.query.status;

      const whereCondition = {};
      if (id) {
        whereCondition.id_user = id;
      }
      if (status) {
        whereCondition.status = status;
      }
      if (invoiceNumber) {
        whereCondition.invoice_number = {
          [db.Sequelize.Op.like]: `%${invoiceNumber}%`,
        };
      }

      const totalOrders = await Transaction.count({
        where: whereCondition,
      });
      const orders = await Transaction.findAndCountAll({
        include: [
          {
            model: TransactionItem,
            include: [
              {
                model: Products,
                paranoid: false,
                where: {
                  [Op.or]: [
                    { deletedAt: { [Op.ne]: null } },
                    { deletedAt: null },
                  ],
                },
              },
            ],
          },
          {
            model: Address,
            paranoid: false,
            where: {
              [Op.or]: [{ deletedAt: { [Op.ne]: null } }, { deletedAt: null }],
            },
          },
          {
            model: Ekspedisi,
          },
        ],
        where: whereCondition,
        order: [["createdAt", "DESC"]],
        limit,
        offset: page * limit,
      });

      const totalPages = Math.ceil(totalOrders / limit);
      res.status(200).send({ orders: orders.rows, totalPages });
    } catch (error) {
      res.status(400).send({
        message: "failed get order by user!",
      });
    }
  },

  getAllOrders: async (req, res) => {
    try {
      let page = Number(req.query.page);
      const limit = 8;
      const warehouseId = req.query.warehouseId;
      const invoiceNumber = req.query.invoiceNumber;
      const status = req.query.status;

      const whereCondition = {};
      if (warehouseId) {
        whereCondition.id_warehouse = warehouseId;
      }
      if (status) {
        whereCondition.status = status;
      }
      if (invoiceNumber) {
        whereCondition.invoice_number = {
          [db.Sequelize.Op.like]: `%${invoiceNumber}%`,
        };
      }

      const totalOrders = await Transaction.count({
        where: whereCondition,
      });
      const orders = await Transaction.findAndCountAll({
        include: [
          {
            model: TransactionItem,
            include: [
              {
                model: Products,
                paranoid: false,
                where: {
                  [Op.or]: [
                    { deletedAt: { [Op.ne]: null } },
                    { deletedAt: null },
                  ],
                },
              },
            ],
          },
          {
            model: Address,
            paranoid: false,
            where: {
              [Op.or]: [{ deletedAt: { [Op.ne]: null } }, { deletedAt: null }],
            },
          },
          {
            model: Ekspedisi,
          },
        ],
        where: whereCondition,
        order: [
          ["createdAt", "DESC"],
          ["status", "DESC"],
        ],
        limit,
        offset: page * limit,
      });

      const totalPages = Math.ceil(totalOrders / limit);
      res.status(200).send({ orders: orders.rows, totalPages });
    } catch (error) {
      res.status(400).send({
        message: "failed get all order!",
      });
    }
  },

  getOrdersByWarehouse: async (req, res) => {
    try {
      const { warehouseId } = req.params;
      let page = Number(req.query.page);
      const limit = 8;
      const invoiceNumber = req.query.invoiceNumber;
      const status = req.query.status;

      const whereCondition = {};
      if (warehouseId) {
        whereCondition.id_warehouse = warehouseId;
      }
      if (status) {
        whereCondition.status = status;
      }
      if (invoiceNumber) {
        whereCondition.invoice_number = {
          [db.Sequelize.Op.like]: `%${invoiceNumber}%`,
        };
      }

      const totalOrders = await Transaction.count({
        where: whereCondition,
      });

      const orders = await Transaction.findAndCountAll({
        include: [
          {
            model: TransactionItem,
            include: [
              {
                model: Products,
                paranoid: false,
                where: {
                  [Op.or]: [
                    { deletedAt: { [Op.ne]: null } },
                    { deletedAt: null },
                  ],
                },
              },
            ],
          },
          {
            model: Address,
            paranoid: false,
            where: {
              [Op.or]: [{ deletedAt: { [Op.ne]: null } }, { deletedAt: null }],
            },
          },
          {
            model: Ekspedisi,
          },
        ],
        where: whereCondition,
        order: [["createdAt", "DESC"]],
        limit,
        offset: page * limit,
      });

      const totalPages = Math.ceil(totalOrders / limit);
      res.status(200).send({ orders: orders.rows, totalPages });
    } catch (error) {
      res.status(500).send({ error: "failed get order by warehouse!" });
    }
  },

  getOrderById: async (req, res) => {
    try {
      const { id } = req.params;
      const orders = await Transaction.findAll({
        where: { id },
        include: [
          {
            model: TransactionItem,
            include: [
              {
                model: Products,
                paranoid: false,
                where: {
                  [Op.or]: [
                    { deletedAt: { [Op.ne]: null } },
                    { deletedAt: null },
                  ],
                },
              },
            ],
          },
          {
            model: Address,
            paranoid: false,
            where: {
              [Op.or]: [{ deletedAt: { [Op.ne]: null } }, { deletedAt: null }],
            },
          },
          {
            model: Ekspedisi,
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      res.status(200).send({ orders });
    } catch (error) {
      res.status(400).send({
        message: "failed get order!",
      });
    }
  },
};
