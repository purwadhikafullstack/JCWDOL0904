const { Transaction, Warehouse, Products, Stocks, TransactionItem, Address, sequelize, Carts, Ekspedisi } = require('../models');
const { Op } = require('sequelize');
const moment = require("moment");
const { io } = require("../src/index")

const checkExpiredOrders = async () => {
    try {
        const expiredOrders = await Transaction.findAll({
            where: {
                status: 'Waiting For Payment',
                expired: {
                    [Op.lte]: moment().toDate(), // Find orders with expired date less than or equal to the current date and time
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

        console.log(`ini expired order`, expiredOrders);
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

            // Find the nearest warehouse using the Haversine formula
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

            // Calculate the expiration date
            const expirationDate = new Date();
            expirationDate.setSeconds(expirationDate.getSeconds() + 10); // Set expiration to 30 seconds from now


            // Create the transaction (order)
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


            // Create the transactionItems for the ordered products
            const transactionItems = await Promise.all(
                cartItems.map(async (cartItem) => {
                    const { Product, quantity } = cartItem;

                    const product = await Products.findByPk(Product.id);

                    if (!product) {
                        return res.status(404).send({ error: `Product with ID ${Product.id} not found` });
                    }

                    // Check stock availability in all warehouses
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

            const totalOrders = await Transaction.count();
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
                order: [['createdAt', 'DESC']],
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

            const totalOrders = await Transaction.count({
                where: { id_warehouse: warehouseId },
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
                where: { id_warehouse: warehouseId }, // Filter orders by warehouse ID
                order: [['createdAt', 'DESC']],
                limit,
                offset: page * limit,
            });

            res.status(200).send({ orders });
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: 'Internal server error' });
        }
    },
    getAllOrderByUser: async (req, res) => {
        try {
            const { id_user } = req.params;
            const orders = await Transaction.findAll({
                where: { id_user },
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
    uploadPaymentProof: async (req, res) => {
        try {
            console.log(req.file);
            const transactionId = req.params.id;
            // const paymentProofPath = req.file.path;

            const { file } = req
            const filepath = file ? "/" + file.filename : null

            await Transaction.update(
                { payment_proof: process.env.IMAGE_URL + filepath, status: "Waiting For Payment Confirmation" },
                { where: { id: transactionId } }
            );

            res.status(200).send({ message: 'Payment proof uploaded successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error uploading payment proof' });
        }
    },
    cancelOrder: async (req, res) => {
        try {
            const transactionId = req.params.id;

            const transaction = await Transaction.findByPk(transactionId);
            if (!transaction) {
                return res.status(404).json({ error: 'Transaction not found' });
            }

            if (transaction.status === 'Canceled') {
                return res.status(400).json({ error: 'Transaction is already canceled' });
            }

            if (transaction.status === 'Waiting For Payment Confirmation' || transaction.status === 'On Proses' || transaction.status === 'On Proses' || transaction.status === 'Shipped') {
                return res.status(400).json({ error: 'You can not canceled transaction' });
            }

            // Update the transaction status to "Canceled"
            await transaction.update({ status: 'Canceled' });

            res.status(200).json({ message: 'Transaction canceled successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error canceling transaction' });
        }
    },

    getPaymentProof: async (req, res) => {
        const { id } = req.params;

        try {
            const transaction = await Transaction.findByPk(id, {
                attributes: ['payment_proof'],
            });

            if (!transaction) {
                return res.status(404).json({ message: 'Transaction not found' });
            }

            if (!transaction.payment_proof) {
                return res.status(404).json({ message: 'Payment proof not found' });
            }

            res.json({ payment_proof: transaction.payment_proof });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    rejectOrder: async (req, res) => {
        try {
            const transactionId = req.params.id;
            const transaction = await Transaction.findByPk(transactionId);

            if (!transaction) {
                return res.status(404).json({ error: 'Transaction not found' });
            }

            // Update the transaction status to "Waiting For Payment"
            await transaction.update({ status: 'Waiting For Payment' });

            // Calculate the expiration date as the current date + 30 seconds
            const expirationDate = moment().add(30, 'seconds');
            await transaction.update({ expired: expirationDate });

            // Start the timer to automatically cancel the order if not paid within the given deadline
            setTimeout(async () => {
                const updatedTransaction = await Transaction.findByPk(transaction.id);
                if (updatedTransaction.status === 'Waiting For Payment') {
                    await updatedTransaction.update({ status: 'Canceled' });
                }
            }, 30000); // 30 seconds

            res.status(200).json({ message: 'Transaction rejected successfully', transaction: updatedTransaction });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error rejecting transaction' });
        }
    },
}
