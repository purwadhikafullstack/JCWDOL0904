const { Transaction, Warehouse, Products, Stocks, TransactionItem, Address, sequelize, Carts, Ekspedisi, Notification } = require('../models');
const db = require("../models");
const moment = require("moment");
const { io } = require("../src/index")
const { } = require("../")

module.exports = {
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
    confirmOrder: async (req, res) => {
        try {
            const { id } = req.body;
            const transaction = await Transaction.findOne({
                where: {
                    id,
                },
            });
            if (transaction.status === 'On Process') {
                return res.status(400).send({ message: 'Transaction is already in process' });
            }
            if (transaction.status !== 'Waiting For Payment Confirmation') {
                return res.status(404).send({ message: 'Transaction not eligible for confirmation' });
            }

            await transaction.update({ status: "On Process" });
            res.status(200).send({ message: 'Transaction confirmed successfully' });
        } catch (error) {
            console.log(error);
        }
    },
    sendOrder: async (req, res) => {
        try {
            const { orderId } = req.params;
            const order = await Transaction.findByPk(orderId, {
                include: [
                    {
                        model: TransactionItem,
                        include: [Products],
                    },
                ],
            });

            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            if (order.status == 'Shipped') {
                return res.status(400).json({ message: 'Transaction is already sent' });
            }

            if (order.status !== 'On Process') {
                return res.status(400).json({ message: 'The transaction is not eligible to be sent' });
            }


            for (const item of order.TransactionItems) {
                // Iterate over each item in the order
                const product = await Products.findByPk(item.id_product);

                if (!product) {
                    return res.status(404).send({ error: `Product with ID ${item.id_product} not found` });
                }

                // Calculate the total stock quantity for the product
                const totalStock = await Stocks.sum('stock', {
                    where: { id_product: item.id_product },
                });

                if (totalStock <= 0) {
                    // If the product is out of stock, return an error response
                    return res.status(400).send({ error: `Product with ID ${item.id_product} is out of stock` });
                }

                if (item.quantity > totalStock) {
                    // If there is insufficient stock for the product, return an error response
                    return res.status(400).send({ error: `Insufficient stock for product with ID ${item.id_product}` });
                }
            }

            const expirationDate = new Date();
            expirationDate.setSeconds(expirationDate.getSeconds() + 30);

            await order.update({ status: 'Shipped', expired_confirmed: expirationDate });

            // Create a notification for the user
            const notification = await Notification.create({
                title: `Order ${order.invoice_number}`,
                message: 'Your order has been shipped',
                id_user: order.id_user, // Assuming there is a userId field in the Transaction model
            });

            // Notify the user about the sent order
            // Implement the notification mechanism here (e.g., send an email or emit a websocket event)
            const timeoutDuration = order.expired_confirmed - new Date();
            setTimeout(async () => {
                const updatedOrder = await Transaction.findAll({
                    where: {
                        status: 'Shipped',
                        expired_confirmed: {
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

                for (const order of updatedOrder) {
                    await order.update({ status: 'Order Confirmed' });
                    io.emit("orderConfirmed", order.toJSON());
                }
            }, timeoutDuration);
            res.status(200).json({ message: 'Order sent successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error sending order' });
        }
    },
}