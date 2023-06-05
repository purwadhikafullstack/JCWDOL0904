const db = require("../models");
const product = db.Products;

module.exports = {
  getAllProduct: async (req, res) => {
    try {
      const smartphone = await product.findAll({ where: { id_category: 1 } });
      const watch = await product.findAll({ where: { id_category: 2 } });
      const earphone = await product.findAll({ where: { id_category: 3 } });

      res.status(200).send({message: "success",smartphone,watch,earphone,});
      
    } catch (error) {
      res.status(400).send(error);
    }
  },
  getOneProduct: async (req, res) => {
    try {
      
      const { idP } = req.body;

      const productById = await product.findOne({
        where: {
          id: idP
        }
      })

      res.status(200).send({
        message:"success",
        productById
      })

    } catch (error) {
      res.status(400).send(error)
    }
  }
};
