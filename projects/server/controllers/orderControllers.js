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
            io.emit("transaction-update", order.toJSON());
        }
    } catch (error) {
        console.error('Error checking expired orders:', error);
    }
};
setInterval(checkExpiredOrders, 11000);

module.exports = {
    createOrder: async (req, res) => {
        try {
            const { cartItems, addressId, userId, ekspedisiId, totalAmount, category } = req.body;
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
                        category: Product.Category.category,
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
    cancelOrder: async (req, res) => {
        try {
            const transactionId = req.params.id;
            const transaction = await Transaction.findByPk(transactionId);
            if (!transaction) {
                return res.status(404).send({ message: 'Transaction not found' });
            }
            if (transaction.status === 'Canceled') {
                return res.status(400).send({ message: 'Transaction is already canceled' });
            }
            if (transaction.status === 'Waiting For Payment Confirmation' || transaction.status === 'On Process' || transaction.status === 'Order Confirmed' || transaction.status === 'Shipped') {
                return res.status(400).send({ message: 'You can not canceled transaction' });
            }
            await transaction.update({ status: 'Canceled' });
            res.status(200).send({ message: 'Transaction canceled successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Error canceling transaction' });
        }
    },
    acceptOrder: async (req, res) => {
        try {
            const { id } = req.params;
            const transaction = await Transaction.findOne({
                where: {
                    id,
                },
            });

            if (transaction.status === 'Order Confirmed') {
                return res.status(400).send({ message: 'Transaction is already confirmed' });
            }

            if (transaction.status !== 'Shipped') {
                return res.status(404).send({ message: 'Transaction not eligible for confirmation' });
            }

            await transaction.update({ status: "Order Confirmed" });
            res.status(200).send({ message: 'Transaction confirmed successfully' });
        } catch (error) {
            console.log(error);
        }
    },
}
