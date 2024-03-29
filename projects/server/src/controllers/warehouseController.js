const { Op } = require("sequelize");
const db = require("..//models");
const User = db.User;
const { Warehouse, Stocks, Products, Transaction } = db;
const axios = require("axios");

module.exports = {
  getAllWarehouses: async (req, res) => {
    try {
      const search = req.query.search || "";
      const site = req.query.site || null;
      let page = req.query.page || 0;
      const sort = req.query.sort || "DESC";
      const limit = 10;

      let allRows = [];
      let allCount = 0;
      let result;
      if (site === "manageW") {
        result = await Warehouse.findAndCountAll({
          where: {
            warehouse: {
              [db.Sequelize.Op.like]: `%${search}%`,
            },
          },
          order: [["createdAt", sort]],
          limit,
          offset: page * limit,
        });

        allRows = result.rows;
        allCount = result.count;
      } else {
        allRows = await Warehouse.findAll();
      }

      const totalPage = Math.ceil(allCount / limit);
      if (parseInt(page) >= totalPage && totalPage > 0) {
        page = totalPage - 1;
        if (site === "manageW") {
          result = await Warehouse.findAndCountAll({
            where: {
              warehouse: {
                [db.Sequelize.Op.like]: `%${search}%`,
              },
            },
            order: [["createdAt", sort]],
            limit,
            offset: page * limit,
          });

          allRows = result.rows;
          allCount = result.count;
        } else {
          allRows = await Warehouse.findAll();
        }
      }
      res.status(200).send({ result: allRows, totalPage, search });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  createWarehouse: async (req, res) => {
    try {
      const { warehouse, province, city, warehouse_city_id, subdistrict, zip } =
        req.body;

      if (
        !warehouse ||
        !province ||
        !city ||
        !warehouse_city_id ||
        !subdistrict ||
        !zip
      ) {
        throw new Error("Please input all data!");
      }
      const sameWarehouse = await Warehouse.findOne({
        paranoid: true,
        where: { warehouse },
      });
      const sameData = await Warehouse.findOne({
        paranoid: true,
        where: {
          province,
          city,
          warehouse_city_id,
          subdistrict,
          zip,
        },
      });

      if (sameWarehouse) throw new Error("Warehouse name already exist!");
      if (sameData)
        throw new Error("Warehouse with exact same place already exist!");

      const query = `${subdistrict}%20${city}%20${province}%20${zip}`;
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${query}&key=e115d475b4d64403bef4b85a159facaf`
      );
      if (response.status === 200 && response.data.results.length > 0) {
        const { geometry } = response.data.results[0];
        const { lat: latitude, lng: longitude } = geometry;

        const newWarehouse = await Warehouse.create({
          warehouse,
          province,
          city,
          warehouse_city_id,
          subdistrict,
          zip,
          latitude,
          longitude,
        });

        res.status(200).send({ newWarehouse });
      } else {
        throw new Error("Geocoding error");
      }
    } catch (error) {
      res.status(400).send({
        message: error.message,
      });
    }
  },

  editeWareHouse: async (req, res) => {
    try {
      const {
        warehouse,
        province,
        city,
        warehouse_city_id,
        subdistrict,
        zip,
        id,
      } = req.body;

      if (
        !warehouse ||
        !province ||
        !city ||
        !warehouse_city_id ||
        !subdistrict ||
        !zip ||
        !id ||
        warehouse.length < 1
      ) {
        throw new Error("please insert your data");
      }

      const cekWarehouse = await Warehouse.findAll({
        paranoid: true,
        where: { warehouse, id: { [Op.ne]: id } },
      });
      const sameData = await Warehouse.findOne({
        paranoid: true,
        where: {
          province,
          city,
          warehouse_city_id,
          subdistrict,
          zip,
        },
      });

      if (cekWarehouse.length > 0) {
        throw new Error("Warehouse name already exist!!");
      }
      if (sameData) {
        throw new Error("Warehouse with exact same place already exist!!");
      }

      const query = `${subdistrict}%20${city}%20${province}%20${zip}`;
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${query}&key=e115d475b4d64403bef4b85a159facaf`
      );
      if (response.status === 200 && response.data.results.length > 0) {
        const { geometry } = response.data.results[0];
        const { lat: latitude, lng: longitude } = geometry;

        const newWarehouse = await Warehouse.update(
          {
            warehouse,
            province,
            city,
            warehouse_city_id,
            subdistrict,
            zip,
            latitude,
            longitude,
          },
          {
            where: {
              id,
            },
          }
        );

        res.status(200).send({ newWarehouse });
      } else {
        throw new Error("Geocoding error");
      }
    } catch {
      res.status(400).send({
        message: error.message,
      });
    }
  },

  deleteWareHouse: async (req, res) => {
    try {
      const { id } = req.params;
      const cekAdmin = await User.findAll({
        where: { id_warehouse: id },
      });

      const cekTransactionOngoing = await Transaction.findAll({
        where: {
          id_warehouse: id,
          status: {
            [Op.notIn]: ["Order Confirmed", "Canceled"],
          },
        },
      });

      if (cekTransactionOngoing.length > 0)
        throw new Error("failed, this warehouse is still has a transaction!");

      if (cekAdmin && cekAdmin.length > 0)
        throw new Error("There is still admin warehouse in this warehouse!");
      const stockIsAvailable = await Stocks.findOne({
        where: {
          id_warehouse: id,
          stock: { [db.Sequelize.Op.gt]: 0 },
        },
      });
      if (stockIsAvailable)
        throw new Error(
          "Stock in this warehouse is still available. you need to do migration to make the stock is empty!!!!"
        );
      const result = await Warehouse.destroy({
        where: {
          id,
        },
      });

      const data = await Stocks.destroy({
        where: {
          id_warehouse: id,
        },
      });

      res.status(200).send({
        message: "delete success",
      });
    } catch (error) {
      res.status(400).send({
        message: error.message,
      });
    }
  },

  changeWarehouse: async (req, res) => {
    try {
      const { id, currentWarehouse, id_warehouse } = req.body;
      const dataRole = req.dataToken;

      const findUser = await User.findOne({
        where: { id: dataRole.id },
      });

      const findUserId = await User.findOne({
        where: { id: id },
      });

      if (findUser.role === "adminWarehouse" || findUser.role === "user") {
        throw new Error("You don't have permission!");
      }

      if (currentWarehouse === id_warehouse) {
        throw new Error("You select the same warehouse, please select another");
      }

      const result = await User.update(
        { id_warehouse },
        {
          where: {
            id: findUserId.id,
          },
        }
      );
      res.status(200).send({
        message: "Update admin warehouse success",
        data: result,
        findUser,
      });
    } catch (error) {
      res.status(400).send({
        message: "Update admin warehouse fail!",
      });
    }
  },
};
