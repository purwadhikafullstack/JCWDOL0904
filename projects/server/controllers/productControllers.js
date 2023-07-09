const db = require("../models");
const { sequelize } = require("../models");
const dotenv = require("dotenv");
dotenv.config();
const product = db.Products;
const stocks = db.Stocks;
const stockmovement = db.StockMovement;
const stockhistory = db.StockHistory;
const transactionItem = db.TransactionItem;
const transaction = db.Transaction;
const warehouse = db.Warehouse;
const user = db.User;
const categor = db.Category;

module.exports = {
  getAllProduct: async (req, res) => {
    try {
      let page = parseInt(req.query.page) || 0;
      const search = req.query.search || "";
      const order = req.query.order || "createdAt";
      const sort = req.query.sort || "ASC";
      const category = req.query.category || 1;
      const site = req.query.site;
      let limit = 4;
      let where = {
        product_name: {
          [db.Sequelize.Op.like]: `%${search}%`,
        },
        id_category: category,
      };
      let include = null;
      console.log(page);
      // if (category === "all") {
      //   where = {
      //     product_name: {
      //       [db.Sequelize.Op.like]: `%${search}%`,
      //     },
      //   };

      //   // include = [
      //   //   {
      //   //     model: categor,
      //   //     where: {
      //   //       deletedAt: true,
      //   //     },
      //   //   },
      //   // ];
      // } else {
      //   where = {
      //     product_name: {
      //       [db.Sequelize.Op.like]: `%${search}%`,
      //     },
      //     id_category: category,
      //   };
      // }

      if (site === "home") limit = 9;

      // console.log(site);
      const SORT = [[order, sort]];
      // console.log(SORT);

      if (search) page = 0;

      let result;
      const { count: allCount, rows: allSort } = await product.findAndCountAll({
        where,
        include: include,
      });

      const totalPage = Math.ceil(allCount / limit);

      if (page > totalPage - 1) {
        page = 0;
      }

      const { count: updatedCount, rows: updatedRows } =
        await product.findAndCountAll({
          where,
          include: include,
          order: SORT,
          limit: limit,
          offset: page * limit,
          // attributes: [
          //   "id",
          //   "product_name",
          //   "product_image",
          //   "price",
          //   "description",
          //   "cpu_speed",
          //   "cpu_type",
          //   "size",
          //   "resolution",
          //   "colorDept",
          //   "ram",
          //   "storage",
          //   "weight_g",
          //   "battery",
          //   "createdAt",
          //   "updatedAt",
          // ],
        });

      console.log(page);
      result = {
        data: updatedRows,
        totalProduct: updatedCount,
        totalPage,
        coba: allSort,
      };
      res.status(200).send({ message: "success", ...result });
    } catch (error) {
      console.log(error);
    }
  },

  getOneProduct: async (req, res) => {
    try {
      const { idP } = req.body;

      const productById = await product.findOne({
        where: {
          id: idP,
        },
        include: [stocks],
      });

      const stock = productById.Stocks.reduce((acc, curr) => {
        return acc + curr.stock;
      }, 0);

      res.status(200).send({
        message: "success",
        productById,
        stock,
      });
    } catch (error) {
      res.status(400).send(error);
    }
  },
  manualMutation: async (req, res) => {
    try {
      const { id, warehouse_sender_id, warehouse_receive_id, qty, status } =
        req.body;
      const getStockMovement = await stocks.findOne({
        where: {
          id_warehouse: warehouse_sender_id,
          id_product: id,
        },
      });
      if (getStockMovement.dataValues.stock < 1) {
        throw new Error("stock is unavailable!");
      }

      if (getStockMovement.dataValues.stock < qty) {
        throw new Error({
          message: "stock is too man!",
          title: "Error!",
          icon: "error",
        });
      }

      const currentTime = new Date();
      let request_number = currentTime.getTime();
      request_number = request_number.toString();
      request_number = request_number.substring(0, 5);
      request_number = parseInt(request_number);

      const result = await stockmovement.create({
        id_product: parseInt(id),
        warehouse_sender_id,
        warehouse_receive_id,
        quantity: qty,
        status,
        request_number,
      });

      res.status(200).send({
        result,
      });
    } catch (error) {
      console.log(error);

      res.status(400).send({
        message: error.message,
      });
    }
  },
  getAllMutation: async (req, res) => {
    try {
      let { sort, role, idUser } = req.query;
      let dataUser = [];
      let idWarehouse = null;
      console.log(req.query);
      if (role == "adminWarehouse") {
        dataUser = await user.findOne({
          where: {
            role,
            id: idUser,
          },
          include: [stocks],
        });

        idWarehouse = dataUser.Stocks[0].id_warehouse;
      }

      if (idWarehouse) sort = idWarehouse;

      const result = await stockmovement.findAll({
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: warehouse,
            as: "senderWarehouse",
            where: {
              id: parseInt(sort),
            },
          },
          {
            model: warehouse,
            as: "receiverWarehouse",
          },
          product,
        ],
      });

      res.status(200).send({
        result,
        idWarehouse,
      });
    } catch (error) {
      console.log(error);
    }
  },
  updateImageProduct: async (req, res) => {
    try {
      console.log(req.file);
      const picData = req.file.originalname;
      const id = req.body.id;

      const formatData = picData.split(".").reverse();
      console.log(formatData);

      if (formatData[0] != "png") {
        throw new Error("Error, your format picture is not png!");
      }

      const filePath = req.file.path;
      const fileName = process.env.IMAGE_URL + filePath.split("\\")[2];

      const productData = await product.update(
        {
          product_image: fileName,
        },
        {
          where: {
            id,
          },
        }
      );

      console.log(fileName, id);
      res.status(200).send({
        message: "success",
        fileName,
        productData,
      });
    } catch (error) {
      console.log(error.code);
      res.status(400).send({
        message: error.message,
      });
    }
  },
  updateProductData: async (req, res) => {
    try {
      const {
        id,
        product_name,
        description,
        price,
        categor,
        cpu_speed,
        cpu_type,
        size,
        resolutioin,
        colorDept,
        ram,
        storage,
        weight_g,
        battery,
      } = req.body;
      console.log(categor);
      if (
        !id ||
        !product_name ||
        !description ||
        !price ||
        !categor ||
        !cpu_speed ||
        !cpu_type ||
        !size ||
        !resolutioin ||
        !colorDept ||
        !ram ||
        !storage ||
        !weight_g ||
        !battery
      ) {
        throw new Error("Please input all data!");
      }
      const result = await product.update(
        {
          product_name,
          description,
          price,
          id_category: categor,
          cpu_speed,
          cpu_type,
          size,
          resolutioin,
          colorDept,
          ram,
          storage,
          weight_g,
          battery,
        },
        {
          where: {
            id,
          },
        }
      );

      res.status(200).send({
        message: "Data has been updated!",
        result,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        message: error.message,
      });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;

      const result = await product.destroy({
        where: {
          id,
        },
      });
      res.status(200).send({
        message: "success, deleted!",
      });
    } catch (error) {
      console.log(error);
    }
  },
  createNewProduct: async (req, res) => {
    try {
      const {
        product_name,
        price,
        category,
        cpu_speed,
        cpu_type,
        size,
        resolution,
        colorDept,
        ram,
        storage,
        weight_g,
        battery,
        description,
      } = req.body;
      const product_image = req.file.originalname;

      const formatData = product_image.split(".").reverse();

      if (formatData[0] !== "png") {
        throw new Error("Your picture is not png!");
      }

      const filePath = req.file.path;
      const fileName = process.env.IMAGE_URL + filePath.split("\\")[2];

      const result = await product.create({
        product_name,
        price: parseInt(price),
        product_image: fileName,
        id_category: parseInt(category),
        cpu_speed,
        cpu_type,
        size,
        resolution,
        colorDept,
        ram,
        storage,
        weight_g: parseInt(weight_g),
        battery,
        description,
      });

      if (!result && result.lenght < 1) {
        throw new Error("something went wrong!");
      }
      console.log(req.file);
      res.status(200).send({
        result,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        message: error.massage,
      });
    }
  },
  addInitialStock: async (req, res) => {
    try {
      const { id } = req.body;

      const allWarehouse = await warehouse.findAll();

      // allWarehouse.forEach((el) => {
      //   const idUser = el.Stocks.find((users) => el.id === users.id_warehouse);
      //   dataForStock.push({ id_warehouse: el.id, id_user: idUser.id_user });
      // });

      await Promise.all(
        allWarehouse.forEach(async (el) => {
          const dataStock = await stocks.findOne({
            where: {
              id_product: parseInt(id),
              id_warehouse: el.id,
            },
          });

          if (!dataStock) {
            await stocks.create({
              stock: 0,
              id_product: parseInt(id),
              id_warehouse: el.id,
            });
          }
        })
      );

      // const stockW1 = await stocks.create({})

      res.status(200).send({
        allWarehouse,
      });
    } catch (error) {
      console.log(error);
    }
  },
};
