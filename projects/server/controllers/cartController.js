const { Op } = require("sequelize");
const db = require("../models");
const { Carts, Products, User, Category, Stocks, Warehouse } = db;

module.exports = {
  addToCart: async (req, res) => {
    try {
      const { id } = req.dataToken;
      const { productId, quantity } = req.body;

      if (!productId) {
        return res.status(404).send({ message: "Product not found" });
      }

      const cartItem = await Carts.findOne({
        where: { id_user: id, id_product: productId },
      });

      if (cartItem) {
        const product = await Products.findByPk(productId);
        const totalStock = await Stocks.sum("stock", {
          where: { id_product: productId },
        });

        if (!product || totalStock === null) {
          return res.status(404).send({ message: "Product not found" });
        }
        const totalQuantity = cartItem.quantity + quantity;

        if (totalQuantity > totalStock) {
          return res.status(200).send({ message: "Insufficient stock" });
        }
        cartItem.quantity = totalQuantity;

        await cartItem.save();
      } else {
        await Carts.create({
          id_user: id,
          id_product: productId,
          quantity,
        });
      }

      return res
        .status(200)
        .send({ message: "Product added to cart successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: "Unable to add product to cart" });
    }
  },
  updateCartQty: async (req, res) => {
    try {
      const { cartItemId, action, quantity } = req.body;

      const cartItem = await Carts.findByPk(cartItemId);

      if (cartItem) {
        const product = await Products.findByPk(cartItem.id_product);
        const totalStock = await Stocks.sum('stock', {
          include: [{
            model: Warehouse,
            attributes: []
          }],
          where: { id_product: cartItem.id_product }
        });

        if (!product || !totalStock) {
          return res.status(404).send({ message: "Product not found" });
        }

        if (action === "increase") {
          const newQuantity = cartItem.quantity + 1;
          if (newQuantity > totalStock) {
            return res.status(400).send({ message: "Insufficient stock" });
          }
          cartItem.quantity = newQuantity;
        } else if (action === "decrease") {
          if (cartItem.quantity > 1) {
            cartItem.quantity -= 1;
          }
        } else if (action === "input") {
          if (quantity > totalStock) {
            return res.status(400).send({ message: "Insufficient stock" });
          }
          cartItem.quantity = quantity;
        }

        const cartItems = await Carts.findOne({
          where: { id: cartItemId },
          include: [{ model: Products }],
        });

        const subtotal = cartItems.Product.price * cartItems.quantity;

        await cartItem.save();
        return res.status(200).send({
          message: "Cart item updated successfully",
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
  getCartItemByUser: async (req, res) => {
    try {
      const { id } = req.dataToken;

      const cartItems = await Carts.findAndCountAll({
        where: {
          id_user: id
        },
        include: [
          {
            model: Products,
            include: [
              {
                model: Category
              },
              {
                model: Stocks
              }
            ]
          },
          { model: User },
        ],
      });

      return res.status(200).send({ cartItems: cartItems.rows });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: 'Unable to fetch cart items' });
    }
  },
  deleteCart: async (req, res) => {
    try {
      const { cartItemId } = req.params;
      const cartItem = await Carts.findByPk(cartItemId);
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
  removeCartItem: async (req, res) => {
    try {
      const { cartItemIds } = req.body;
      console.log(`ini cart itemIds`, cartItemIds);
      const cartItems = await Carts.findAll({
        where: {
          id: cartItemIds
        }
      });

      if (cartItems.length > 0) {
        await Carts.destroy({
          where: {
            id: cartItemIds
          }
        });
        return res.status(200).send({ message: "Cart items deleted successfully" });
      }

      return res.status(400).send({ message: "Cart items not found" });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: "Unable to remove cart items" });
    }
  }
};
