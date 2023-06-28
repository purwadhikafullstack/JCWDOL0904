const db = require("../models");
const categor = db.Category;
const product = db.Products;

module.exports = {
  getAllCategory: async (req, res) => {
    try {
      const result = await categor.findAll();
      res.status(200).send({
        result,
      });
    } catch (error) {
      console.log(error);
    }
  },
  addCategory: async (req, res) => {
    try {
      const { categor } = req.body;

      const allCate = await categor.findAll();

      let isSame = [];
      allCate.forEach((el) => {
        if (el.category === categor) {
          isSame.push(el.category);
        }
      });

      if (isSame.length > 0) {
        return res.status(400).send({
          message: "Category name already exist",
        });
      }

      const result = await categor.create({
        category: categor,
      });
      res.status(200).send({
        result,
        message: "success add new category",
      });
    } catch (error) {
      console.log(error);
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;

      const result = await categor.destroy({
        where: {
          id,
        },
      });

      const getCategoryTmp = await categor.findOne({
        where: {
          category: "no category",
        },
      });

      const productData = await product.update(
        {
          id_category: getCategoryTmp.id,
        },
        {
          where: {
            id_category: id,
          },
        }
      );

      res.status(200).send({
        result,
        productData,
      });
    } catch (error) {
      console.log(error);
    }
  },
  editeCategory: async (req, res) => {
    try {
      const { id, categor } = req.body;

      const data = await category.findAll({
        where: {
          category: categor,
        },
      });

      if (data.length > 0) {
        return res.status(400).send({
          message: "category already exist!",
        });
      }

      const result = await category.update(
        {
          category: categor,
        },
        {
          where: {
            id,
          },
        }
      );

      res.status(200).send({
        result,
      });
    } catch (error) {
      console.log(error);
    }
  },
  getCategoryforEdite: async (req, res) => {
    try {
      const { category } = req.params;
    } catch (error) {
      console.log(error);
    }
  },
};
