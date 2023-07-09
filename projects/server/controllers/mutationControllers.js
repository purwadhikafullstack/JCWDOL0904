const db = require("../models");
const { sequelize } = require("../models");
const product = db.Products;
const stocks = db.Stocks;
const stockmovement = db.StockMovement;
const stockhistory = db.StockHistory;
const transactionItem = db.TransactionItem;
const transaction = db.Transaction;
const warehouse = db.Warehouse;
const user = db.User;

module.exports = {
  rejectMutation: async (req, res) => {
    try {
      const { id } = req.body;

      const getStockmovementData = await stockmovement.findOne({
        where: {
          id,
        },
      });

      if (getStockmovementData.status !== "pending") {
        return res.status(400).send({
          message: "action already run!",
          title: "Error!",
          icon: "error",
        });
      }

      const result = await stockmovement.update(
        {
          status: "rejected",
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
      // res.status(400).send({
      //   message: error.message,
      // });
    }
  },
  proceedMutation: async (req, res) => {
    try {
      const { id, warehouse_sender_id, warehouse_receive_id, qty, id_product } =
        req.body;

      const getStockmovementData = await stockmovement.findOne({
        where: {
          id,
        },
      });

      if (getStockmovementData.status !== "pending") {
        throw new Error("action already run!");
      }

      const WarehouseSender = await stocks.findOne({
        where: {
          id_warehouse: warehouse_sender_id,
          id_product,
        },
      });
      const WarehouseReceive = await stocks.findOne({
        where: {
          id_warehouse: warehouse_receive_id,
          id_product,
        },
      });

      if (WarehouseSender.stock < qty) {
        throw new Error("stock is unavailable");
      }

      const stockInWarehouseSender = WarehouseSender.stock - qty;
      const stockInWarehouseReceive = WarehouseReceive.stock + qty;

      const stockInWarehouseSenderUpdate = await stocks.update(
        {
          stock: stockInWarehouseSender,
        },
        {
          where: {
            id_warehouse: warehouse_sender_id,
            id_product,
          },
        }
      );
      const stockInWarehouseReceiveUpdate = await stocks.update(
        {
          stock: stockInWarehouseReceive,
        },
        {
          where: {
            id_warehouse: warehouse_receive_id,
            id_product,
          },
        }
      );
      const updateStockMovement = await stockmovement.update(
        {
          status: "approved",
        },
        {
          where: {
            id,
          },
        }
      );

      const stockHistoryAddedIn = await stockhistory.create({
        quantity: qty,
        status: "in",
        id_product,
        id_warehouse: warehouse_receive_id,
      });
      const stockHistoryAddedOut = await stockhistory.create({
        quantity: qty,
        status: "out",
        id_product,
        id_warehouse: warehouse_sender_id,
      });

      res.status(200).send({
        stockInWarehouseSenderUpdate,
        stockInWarehouseReceiveUpdate,
        updateStockMovement,
        getStockmovementData,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        message: error.message,
      });
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
      if (getStockMovement.dataValues.stock < qty) {
        throw new Error("Your request is too many!");
      }
      if (getStockMovement.dataValues.stock < 1) {
        throw new Error("Stock is unavailable!");
      }

      // const currentTime = new Date();
      // let request_number = currentTime.getTime();
      // request_number = request_number.toString();
      // request_number = request_number.substring(0, 5);
      // request_number = parseInt(request_number);

      const result = await stockmovement.create({
        id_product: parseInt(id),
        warehouse_sender_id,
        warehouse_receive_id,
        quantity: qty,
        status,
        // request_number,
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
      let page = req.query.page || 0;
      const site = req.query.site || undefined;
      let status = req.query.status || null;
      let arrange = req.query.arrange || "DESC";
      const search = parseInt(req.query.search) || undefined;
      let request_number;
      if (search && search.lenght > 0) {
        request_number = {
          request_number: {
            [db.Sequelize.Op.like]: `%${search}%`,
          },
        };
      } else {
        request_number = null;
      }

      let limit = null;
      let allRows = [];
      let allCount = 0;

      if (status === "all")
        status = { [db.Sequelize.Op.or]: ["pending", "rejected", "approved"] };

      if (site === "mutationList") limit = 4;
      console.log(sort, role, idUser);
      let idWarehouse = null;
      console.log(req.query);

      if (role == "adminWarehouse") {
        const dataUser = await user.findOne({
          where: {
            role,
            id: idUser,
          },
          include: [warehouse],
        });

        sort = dataUser.Warehouse.id;
      }

      const result = await stockmovement.findAndCountAll({
        where: search
          ? {
              status,
              request_number: {
                [db.Sequelize.Op.like]: `%${search}%`,
              },
            }
          : {
              status,
            },
        order: [["createdAt", arrange]],
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
        limit,
        offset: page * limit,
      });

      allRows = result.rows;
      allCount = result.count;

      const totalPage = Math.ceil(allCount / limit);

      res.status(200).send({
        result: allRows,
        idWarehouse,
        totalPage,
        search,
      });
    } catch (error) {
      console.log(error);
    }
  },
};
