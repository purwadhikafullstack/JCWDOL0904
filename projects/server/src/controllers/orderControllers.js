const {
  Transaction,
  Warehouse,
  Products,
  Stocks,
  TransactionItem,
  Address,
  sequelize,
  Carts,
  Ekspedisi,
} = require("..//models");
const db = require("..//models");
const moment = require("moment");
const { io } = require("..//index");
const { createNotification } = require("./notificationController");

module.exports = {
  createOrder: async (req, res) => {
    try {
      const { id } = req.dataToken;
      const {
        cartItems,
        addressId,
        ekspedisiId,
        totalAmount,
        courier,
        ongkir,
      } = req.body;
      if (!ekspedisiId) {
        return res
          .status(400)
          .send({ error: "An expedition must be selected" });
      }

      let cart = await Carts.count();
      if (cart == 0) {
        return res
          .status(400)
          .send({ error: "The product in the cart is empty" });
      }
      const address = await Address.findByPk(addressId);
      if (!address) {
        return res.status(404).send({ error: "Address not found" });
      }
      const nearestWarehouse = await Warehouse.findOne({
        order: [
          [
            sequelize.literal(`ST_Distance_Sphere(
              POINT(${address.longitude}, ${address.latitude}),
              POINT(Warehouse.longitude, Warehouse.latitude)
            )`),
          ],
        ],
        limit: 1,
      });

      const expirationDate = new Date();
      expirationDate.setTime(expirationDate.getTime() + 60 * 60 * 1000);
      const transaction = await Transaction.create({
        total_price: totalAmount,
        ongkir: ongkir,
        transaction_date: new Date(),
        status: "Waiting For Payment",
        id_address: addressId,
        id_ekspedisi: ekspedisiId,
        id_user: id,
        id_warehouse: nearestWarehouse.id,
        expired: expirationDate,
        courier,
      });

      let unavailableProduct = false;
      const transactionItems = await Promise.all(
        cartItems.map(async (cartItem) => {
          const { Product, quantity } = cartItem;
          const product = await Products.findByPk(Product.id);
          if (!product) {
            unavailableProduct = true;
            return res.status(404).send({
              error: `A few items in your cart are currently unavailable. Please update your order.`,
            });
          }
          const stocks = await Stocks.findAll({
            where: { id_product: Product.id },
          });
          const totalStock = stocks.reduce(
            (total, stock) => total + stock.stock,
            0
          );
          if (totalStock < quantity) {
            return res.status(400).send({
              error: `${Product.product_name} is out of stock`,
            });
          }

          if (unavailableProduct) {
            await Carts.destroy({
              where: {
                id_user: id,
              },
            });
            return;
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
          id_user: id,
        },
      });
      const timeoutDuration = 3600000;
      setTimeout(async () => {
        const expiredOrders = await Transaction.findAll({
          where: {
            status: "Waiting For Payment",
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
          order: [["createdAt", "DESC"]],
        });

        for (const order of expiredOrders) {
          await order.update({ status: "Canceled" });

          // io.emit("transaction-update", order.toJSON());

          await createNotification(
            `Invoice ${order.invoice_number}`,
            "Your order is canceled, the payment time is expired.",
            order.id_user,
            "admin"
          );
        }
      }, timeoutDuration);
      await createNotification(
        `Invoice ${transaction.invoice_number}`,
        "New order",
        id,
        "user"
      );
      return res.status(201).send({ transaction, transactionItems });
    } catch (error) {
      res.status(400).send({
        message: "failed create order!",
      });
    }
  },
  cancelOrder: async (req, res) => {
    try {
      const transactionId = req.params.id;
      const transaction = await Transaction.findByPk(transactionId, {
        include: [{ model: TransactionItem, include: [Products] }],
      });
      if (!transaction) {
        return res.status(404).send({ message: "Transaction not found" });
      }
      if (transaction.status === "Canceled") {
        return res
          .status(400)
          .send({ message: "Transaction is already canceled" });
      }
      if (
        transaction.status === "Waiting For Payment Confirmation" ||
        transaction.status === "On Process" ||
        transaction.status === "Order Confirmed" ||
        transaction.status === "Shipped"
      ) {
        return res
          .status(400)
          .send({ message: "You cannot cancel the transaction" });
      }

      await createNotification(
        `Invoice ${transaction.invoice_number}`,
        "Canceled by the user",
        transaction.id_user,
        "user"
      );
      await transaction.update({ status: "Canceled" });
      res.status(200).send({ message: "Transaction canceled successfully" });
    } catch (error) {
      res.status(500).send({ message: "Error canceling transaction" });
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

      if (transaction.status === "Order Confirmed") {
        return res
          .status(400)
          .send({ message: "Transaction is already confirmed" });
      }

      if (transaction.status !== "Shipped") {
        return res
          .status(404)
          .send({ message: "Transaction not eligible for confirmation" });
      }

      await transaction.update({ status: "Order Confirmed" });
      await createNotification(
        `Invoice ${transaction.invoice_number}`,
        "The order has been received by the user",
        transaction.id_user,
        "user"
      );
      res.status(200).send({ message: "Transaction confirmed successfully" });
    } catch (error) {
      res.status(400).send({
        message: "failed accept order user!",
      });
    }
  },
};
