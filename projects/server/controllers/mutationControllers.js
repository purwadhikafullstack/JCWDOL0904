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

      if (
        getStockmovementData.status === "approved" ||
        getStockmovementData.status === "rejected"
      ) {
        return res.status(400).send({
          message: "Your partner already done this!",
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

      if (
        getStockmovementData.status === "approved" ||
        getStockmovementData.status === "rejected"
      ) {
        return res.status(400).send({
          message: "Your partner already done this!",
          title: "Error!",
          icon: "error",
        });
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

      let stockInWarehouseReceiveUpdate;
      // let stockInWarehouseReceive;
      if (!WarehouseReceive || WarehouseReceive.lenght < 0) {
        stockInWarehouseReceiveUpdate = await stocks.create({
          stock: qty,
          id_warehouse: warehouse_receive_id,
          id_product,
        });
        const stockHistoryAddedIn = await stockhistory.create({
          quantity: qty,
          status: "in",
          id_product,
          id_warehouse: warehouse_receive_id,
          current_stock: qty,
        });
      } else {
        const stockInWarehouseReceive = WarehouseReceive.stock + qty;
        stockInWarehouseReceiveUpdate = await stocks.update(
          { stock: stockInWarehouseReceive },
          { where: { id_warehouse: warehouse_receive_id, id_product } }
        );
        const stockHistoryAddedIn = await stockhistory.create({
          quantity: qty,
          status: "in",
          id_product,
          id_warehouse: warehouse_receive_id,
          current_stock: stockInWarehouseReceive,
        });
      }

      const stockInWarehouseSender = WarehouseSender.stock - qty;

      const stockInWarehouseSenderUpdate = await stocks.update(
        { stock: stockInWarehouseSender },
        { where: { id_warehouse: warehouse_sender_id, id_product } }
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

      const stockHistoryAddedOut = await stockhistory.create({
        quantity: qty,
        status: "out",
        id_product,
        id_warehouse: warehouse_sender_id,
        current_stock: stockInWarehouseSender,
      });

      res.status(200).send({
        stockInWarehouseSenderUpdate,
        stockInWarehouseReceiveUpdate,
        updateStockMovement,
        getStockmovementData,
      });
    } catch (error) {
      console.log(error);
      // res.status(400).send({
      //   message: error.message,
      // });
    }
  },
  manualMutation: async (req, res) => {
    try {
      const { id, warehouse_sender_id, warehouse_receive_id, qty, status } =
        req.body;
      if (!warehouse_sender_id)
        throw new Error("Please enter warehouse sender");

      if (qty === 0) throw new Error("You can't request 0 stock");
      const getStockMovement = await stocks.findOne({
        where: {
          id_warehouse: warehouse_sender_id,
          id_product: id,
        },
      });

      if (getStockMovement.dataValues.stock < qty)
        throw new Error("Your request is too many!");

      if (getStockMovement.dataValues.stock < 1)
        throw new Error("Stock is unavailable!");

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
      let { sort, role } = req.query;
      const idUser = req.dataToken;
      let page = req.query.page || 0;
      const site = req.query.site || undefined;
      let status = req.query.status || null;
      let arrange = req.query.arrange || "DESC";
      const search = req.query.search || "";
      const request = req.query.request || "in";
      console.log(idUser);
      let request_number;
      let product_name;
      if (search && search.lenght > 0) {
        product_name = {
          product_name: {
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
        status = {
          [db.Sequelize.Op.or]: [
            "pending",
            "rejected",
            "approved",
            "migration",
          ],
        };

      if (site === "mutationList") limit = 10;
      console.log(sort, role, idUser);
      let idWarehouse = null;
      console.log(req.query);

      if (role == "adminWarehouse") {
        const dataUser = await user.findOne({
          where: {
            role,
            id: idUser.id,
          },
          include: [warehouse],
        });

        sort = dataUser.Warehouse.id;
      }
      let result;
      result = await stockmovement.findAndCountAll({
        where: {
          status,
        },
        order: [["createdAt", arrange]],
        include: [
          {
            model: warehouse,
            as: "senderWarehouse",
            where: {
              ...(request === "out" ? { id: parseInt(sort) } : {}),
            },

            // where: { id: parseInt(sort) },
          },
          {
            model: warehouse,
            as: "receiverWarehouse",
            where: {
              ...(request === "in" ? { id: parseInt(sort) } : {}),
            },
          },
          {
            model: product,
            where: {
              ...(search
                ? {
                    product_name: {
                      [db.Sequelize.Op.like]: `%${search}%`,
                    },
                  }
                : {}),
            },
          },
        ],
        limit,
        offset: page * limit,
      });

      allCount = result.count;

      const totalPage = Math.ceil(allCount / limit);
      if (parseInt(page) >= totalPage && totalPage > 0) {
        page = totalPage - 1;
        console.log("hai");
        result = await stockmovement.findAndCountAll({
          where: {
            status,
          },
          order: [["createdAt", arrange]],
          include: [
            {
              model: warehouse,
              as: "senderWarehouse",
              where: {
                ...(request === "out" ? { id: parseInt(sort) } : {}),
              },

              // where: { id: parseInt(sort) },
            },
            {
              model: warehouse,
              as: "receiverWarehouse",
              where: {
                ...(request === "in" ? { id: parseInt(sort) } : {}),
              },
            },
            {
              model: product,
              where: {
                ...(search
                  ? {
                      product_name: {
                        [db.Sequelize.Op.like]: `%${search}%`,
                      },
                    }
                  : {}),
              },
            },
          ],
          limit,
          offset: page * limit,
        });
      }
      allRows = result.rows;

      res.status(200).send({
        result: allRows,
        idWarehouse,
        totalPage,
        search,
        page,
      });
    } catch (error) {
      console.log(error);
    }
  },
};
