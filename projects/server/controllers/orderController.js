const { Transaction, Warehouse, Products, Stocks, TransactionItem, Address, sequelize, Carts, Ekspedisi } = require('../models');
const db = require("../models");
const moment = require("moment");
const { io } = require("../src/index")

const checkExpiredOrders = async () => {
    try {
        const expiredOrders = await Transaction.findAll({
            where: {
                status: 'Waiting For Payment',
                expired: {
                    [db.Sequelize.Op.lte]: moment().toDate(), // Find orders with expired date less than or equal to the current date and time
                },
            },
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

        for (const order of expiredOrders) {
            await order.update({ status: 'Canceled' });
            console.log(`ini order`, order);

            // Emit transaction-update event with the updated transaction
            io.emit("transaction-update", order.toJSON());
        }
    } catch (error) {
        console.error('Error checking expired orders:', error);
    }
};

setInterval(checkExpiredOrders, 6000);

module.exports = {
    createOrder: async (req, res) => {
        try {
            const { cartItems, addressId, userId, ekspedisiId, totalAmount } = req.body;
            if (!ekspedisiId) {
                return res.status(400).json({ error: 'An expedition must be selected' });
            }

            let cart = await Carts.count()
            if (cart == 0) {
                return res.status(400).json({ error: 'The product in the cart is empty' });
            }
            const address = await Address.findByPk(addressId);

            if (!address) {
                return res.status(404).json({ error: 'Address not found' });
            }

            const nearestWarehouse = await Warehouse.findOne({
                order: [
                    [
                        sequelize.literal(`ST_Distance_Sphere(
                  POINT(${address.longitude}, ${address.latitude}),
                  POINT(Warehouse.longitude, Warehouse.latitude)
                )`)
                    ]
                ],
                limit: 1
            });
            if (!nearestWarehouse) {
                return res.status(404).json({ error: 'Nearest warehouse not found' });
            }

            const expirationDate = new Date();
            expirationDate.setSeconds(expirationDate.getSeconds() + 30); // Set expiration to 30 seconds from now

            const transaction = await Transaction.create({
                total_price: totalAmount,
                transaction_date: new Date(),
                status: 'Waiting For Payment',
                id_address: addressId,
                id_ekspedisi: ekspedisiId,
                id_user: userId,
                id_warehouse: nearestWarehouse.id,
                expired: expirationDate,
            });

            const transactionItems = await Promise.all(
                cartItems.map(async (cartItem) => {
                    const { Product, quantity } = cartItem;

                    const product = await Products.findByPk(Product.id);

                    if (!product) {
                        return res.status(404).send({ error: `Product with ID ${Product.id} not found` });
                    }

                    const totalStock = await Stocks.sum('stock', {
                        where: { id_product: Product.id },
                    });

                    if (totalStock <= 0) {
                        return res.status(400).send({ error: `Product with ID ${Product.id} is out of stock` });
                    }

                    return TransactionItem.create({
                        quantity,
                        price: product.price,
                        id_product: Product.id,
                        id_transaction: transaction.id,
                    });
                })
            );

            await Carts.destroy({
                where: {
                    id_user: userId,
                },
            });

            return res.status(201).send({ transaction, transactionItems });
        } catch (error) {
            console.error(error);
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
    getOrdersByWarehouse: async (req, res) => {
        try {
            const { warehouseId } = req.params;
            let page = Number(req.query.page);
            const limit = 8;
            const invoiceNumber = req.query.invoiceNumber;
            const status = req.query.status;

            const whereCondition = {};
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
                where: { id_warehouse: warehouseId },
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
    getAllOrderByUser: async (req, res) => {
        try {
            const userId = req.query.userId;
            let page = Number(req.query.page);
            const limit = 5;
            const invoiceNumber = req.query.invoiceNumber;
            const status = req.query.status;

            const whereCondition = {};
            if (userId) {
                whereCondition.id_user = userId;
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
                offset: page * limit,
            });

            // console.log(orders.rows.length);
            // console.log(`ini total orders`, totalOrders);
            // console.log(`Ini roders count`, orders.count);
            const totalPages = Math.ceil(orders.count / limit);
            res.status(200).send({ orders: orders.rows, totalPages });
        } catch (error) {
            console.error(error);
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
    cancelOrder: async (req, res) => {
        try {
            const transactionId = req.params.id;

            const transaction = await Transaction.findByPk(transactionId);
            if (!transaction) {
                return res.status(404).json({ message: 'Transaction not found' });
            }

            if (transaction.status === 'Canceled') {
                return res.status(400).json({ message: 'Transaction is already canceled' });
            }

            if (transaction.status === 'Waiting For Payment Confirmation' || transaction.status === 'On Proses' || transaction.status === 'On Proses' || transaction.status === 'Shipped') {
                return res.status(400).json({ message: 'You can not canceled transaction' });
            }

            // Update the transaction status to "Canceled"
            await transaction.update({ status: 'Canceled' });

            res.status(200).json({ message: 'Transaction canceled successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error canceling transaction' });
        }
    },
    rejectOrder: async (req, res) => {
        try {
            const transactionId = req.params.id;
            const transaction = await Transaction.findByPk(transactionId);

            if (!transaction) {
                return res.status(404).json({ message: 'Transaction not found' });
            }

            if (transaction.status !== 'Waiting For Payment Confirmation') {
                return res.status(400).json({ message: 'Cannot reject transaction with the current status' });
            }

            await transaction.update({ status: 'Waiting For Payment' });

            const expirationDate = new Date();
            expirationDate.setSeconds(expirationDate.getSeconds() + 30);
            await transaction.update({ expired: expirationDate });
            await transaction.update({ payment_proof: null });

            res.status(200).json({ message: 'Transaction rejected successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error rejecting transaction' });
        }
    },
}
