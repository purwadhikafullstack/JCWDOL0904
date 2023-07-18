const db = require("../models");
const categor = db.Category;
const product = db.Products;

module.exports = {
  getAllCategory: async (req, res) => {
    try {
      const site = req.query.site;
      const limit = 3;
      const sort = req.query.sort || "DESC";
      let page = req.query.page;
      const search = req.query.search || "";
      let allRows = [];
      let allCounts = 0;

      if (search) page = 0;

      if (site === "home") {
        allRows = await categor.findAll({
          where: {
            category: {
              [db.Sequelize.Op.ne]: "no category",
            },
          },
        });
      } else if (site === "manageC") {
        const result = await categor.findAndCountAll({
          where: {
            category: {
              [db.Sequelize.Op.like]: `%${search}%`,
              [db.Sequelize.Op.ne]: "no category",
            },
          },
          limit,
          order: [["category", sort]],
          offset: page * limit,
        });
        allRows = result.rows;
        allCounts = result.count;
      } else {
        allRows = await categor.findAll();
      }

      let totalpage = Math.ceil(allCounts / limit);

      res.status(200).send({
        result: allRows,
        totalpage,
      });
    } catch (error) {
      res.status(400).send({
        message: "Something went wrong",
      });
    }
  },
  addCategory: async (req, res) => {
    try {
      const { cate } = req.body;
      const allCate = await categor.findAll();

      let isSame = [];
      allCate.forEach((el) => {
        if (el.category === cate) {
          isSame.push(el.category);
        }
      });

      if (isSame.length > 0) {
        return res.status(400).send({
          message: "Category name already exist",
        });
      }

      const result = await categor.create({
        category: cate,
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
      res.status(400).send({
        message: "Something went wrong",
      });
    }
  },
  editeCategory: async (req, res) => {
    try {
      const { id, cate } = req.body;

      const data = await categor.findAll({
        where: {
          category: cate,
        },
      });

      if (data.length > 0) {
        return res.status(400).send({
          message: "category already exist!",
        });
      }

      const result = await categor.update(
        {
          category: cate,
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
    } catch (error) {}
  },
};
