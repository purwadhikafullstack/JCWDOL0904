const db = require("../models");
const { Carts, Products, User } = db;

module.exports = {
  addToCart: async (req, res) => {
    try {
      const { userId, productId, quantity } = req.body;
      console.log(userId);

      // cek produk ada atau tidak
      const cartItem = await Carts.findOne({
        where: { id_user: userId, id_product: productId },
      });
      const totalCart = await Carts.count();
      console.log(totalCart);

      if (cartItem) {
        // jika produknya sudah ada update hanya qty nya
        cartItem.quantity += quantity;
        await cartItem.save();
      } else {
        await Carts.create({
          id_user: userId,
          id_product: productId,
          quantity,
        });
      }

      return res
        .status(200)
        .send({ message: "Product added to cart successfully", totalCart });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: "Unable to add product to cart" });
    }
  },
  updateCartProduct: async (req, res) => {
    try {
      const { cartItemId, action } = req.body;
      let quantity = 0;

      const cartItem = await Carts.findByPk(cartItemId);
      console.log(cartItem);

      if (cartItem) {
        if (action === "increase") {
          // Increase the quantity by 1
          cartItem.quantity += 1;
          quantity = cartItem.quantity;
        } else if (action === "decrease") {
          // Decrease the quantity by 1
          if (cartItem.quantity > 1) {
            cartItem.quantity -= 1;
            quantity = cartItem.quantity;
          } else {
            // If the quantity is 1, delete the cart item
            await Carts.destroy({ where: { id: cartItemId } });
            return res
              .status(200)
              .send({ message: "Cart item deleted successfully" });
          }
        }

        const cartItems = await Carts.findOne({
          where: { id: cartItemId },
          include: [{ model: Products }],
        });

        const subtotal = cartItems.Product.price * cartItems.quantity;

        await cartItem.save();
        return res.status(200).send({
          message: "Cart item updated successfully",
          quantity,
          cartItems,
          subtotal,
        });
      }

      return res.status(404).send({ message: "Cart item not found" });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: "Unable to update cart item" });
    }
  },
  getAllCartItems: async (req, res) => {
    try {
      const { userId } = req.query;
      return res.status(404).send({ message: "Cart item not found" });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: "Unable to update cart item" });
    }
  },
  getAllCartItems: async (req, res) => {
    try {
      let page = Number(req.query.page);
      const limit = 8;
      const userId = req.query.userId;
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

      const cartItems = await Carts.findAll({
        where: { id_user: userId },
        include: [
          { model: Products },
          { model: User }
        ]
      });
      return res.status(200).send(cartItems);
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: 'Unable to fetch cart items' });
    }
  },
  deleteCart: async (req, res) => {
    try {
      const { cartItemId } = req.params;
      const cartItem = await Carts.findByPk(cartItemId);
      console.log(cartItem);
      if (cartItem) {
        await Carts.destroy({ where: { id: cartItemId } });
        return res.status(200).send({ message: "Cart item deleted successfully" });
      }

      return res.status(404).send({ message: "Cart item not found" });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: "Unable to delete cart item" });
    }
  },
};
