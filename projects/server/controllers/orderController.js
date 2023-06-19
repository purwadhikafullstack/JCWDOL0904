const { Transaction, Warehouse, Products, Stocks, TransactionItem, Address, sequelize, Carts, Ekspedisi } = require('../models');
const { Op } = require('sequelize');

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
            // Find the address
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

            // Create the transaction (order)
            const transaction = await Transaction.create({
                total_price: totalAmount,
                transaction_date: new Date(),
                status: 'Waiting For Payment',
                id_address: addressId,
                id_ekspedisi: ekspedisiId,
                id_user: userId,
                id_warehouse: nearestWarehouse.id,
            });

            // Create the transactionItems for the ordered products
            const transactionItems = await Promise.all(
                cartItems.map(async (cartItem) => {
                    const { Product, quantity } = cartItem;

                    // Find the product
                    const product = await Products.findByPk(Product.id);

                    if (!product) {
                        return res.status(404).json({ error: `Product with ID ${Product.id} not found` });
                    }

                    // Check stock availability in all warehouses
                    const totalStock = await Stocks.sum('stock', {
                        where: { id_product: Product.id },
                    });

                    if (totalStock <= 0) {
                        return res.status(400).json({ error: `Product with ID ${Product.id} is out of stock` });
                    }

                    // Calculate the price for the transactionItem
                    // const price = product.price * quantity;

                    // Create the transactionItem
                    return TransactionItem.create({
                        quantity,
                        price: product.price,
                        id_product: Product.id,
                        id_transaction: transaction.id,
                    });
                })
            );

            let deleteCart = await Carts.destroy({
                where: {
                    id_user: userId,
                },
            });

            setTimeout(async () => {
                const updatedTransaction = await Transaction.findByPk(transaction.id);
                if (updatedTransaction.status === 'Waiting For Payment') {
                    await updatedTransaction.update({ status: 'Canceled' });
                    console.log('Order canceled due to missing payment proof');
                }
            }, 30 * 1000)

            console.log(deleteCart);

            return res.status(201).send({ transaction, transactionItems });
        } catch (error) {
            console.error(error);
            return res.status(500).send({ error: 'Internal server error' });
        }
    },

    getAllOrders: async (req, res) => {
        try {
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
                order: [['createdAt', 'DESC']],
            });

            res.status(200).send({ orders });
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: 'Internal server error' });
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
    getOrdersByWarehouse: async (req, res) => {
        try {
            const { warehouseId } = req.params;

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
            });

            res.status(200).send({ orders });
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: 'Internal server error' });
        }
    },
};
