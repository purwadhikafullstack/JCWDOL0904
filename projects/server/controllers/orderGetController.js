const { Transaction, Products, TransactionItem, Address, Ekspedisi } = require('../models');
const db = require("../models");

module.exports = {
    // User
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
                        include: [Products],
                    },
                    {
                        model: Address,
                    },
                    {
                        model: Ekspedisi,
                    },
                ],
                where: whereCondition,
                order: [['createdAt', 'DESC']],
                limit,
                offset: (page) * limit,
            });

            const totalPages = Math.ceil(totalOrders / limit);
            res.status(200).send({ orders: orders.rows, totalPages });
        } catch (error) {
            console.error(error);
        }
    },
    // Admin
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
                        include: [Products],
                    },
                    {
                        model: Address,
                    },
                    {
                        model: Ekspedisi,
                    },
                ],
                where: whereCondition,
                order: [['createdAt', 'DESC'], ['status', 'DESC']],
                limit,
                offset: page * limit,
            });

            const totalPages = Math.ceil(totalOrders / limit);
            res.status(200).send({ orders: orders.rows, totalPages });
        } catch (error) {
            console.error(error);
        }
    },
    // Admin
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
                where: {
                    id_warehouse: warehouseId
                },
            });

            const orders = await Transaction.findAll({
                include: [
                    {
                        model: TransactionItem,
                        include: [Products],
                    },
                    {
                        model: Address,
                    },
                    {
                        model: Ekspedisi,
                    },
                ],
                where: whereCondition,
                order: [['createdAt', 'DESC']],
                limit,
                offset: page * limit,
            });

            const totalPages = Math.ceil(totalOrders / limit);
            res.status(200).send({ orders, totalPages });
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: 'Internal server error' });
        }
    },
    // Admin (Order Detail)
    getOrderById: async (req, res) => {
        try {
            const { id } = req.params;
            const orders = await Transaction.findAll({
                where: { id },
                include: [
                    {
                        model: TransactionItem,
                        include: [Products],
                    },
                    {
                        model: Address,
                    },
                    {
                        model: Ekspedisi,
                    },
                ],
                order: [['createdAt', 'DESC']],
            });

            res.status(200).send({ orders });
        } catch (error) {
            console.error(error);
        }
    },
}