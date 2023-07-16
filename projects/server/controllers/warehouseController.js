const db = require("../models");
const User = db.User;
const { Warehouse, Stocks } = db;
const axios = require("axios");

module.exports = {
  // Get All Warehouse
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
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Create Warehouse
  createWarehouse: async (req, res) => {
    try {
      const { warehouse, province, city, warehouse_city_id, subdistrict, zip } =
        req.body;

      const sameWarehouse = await Warehouse.findOne({ where: { warehouse } });
      const sameData = await Warehouse.findOne({
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
      console.log(response);
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
        // console.error("No results found");
        // res.status(500).send({ message: "Geocoding error" });
        throw new Error("Geocoding error");
      }
    } catch (error) {
      console.error(error);
      res.status(400).send({
        message: error.message,
      });
      // res.status(500).json({ error: "Internal server error" });
    }
  },

  // Edit Warehouse
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
        return res.status(400).send({
          message: "please insert your data",
        });
      }

      const query = `${subdistrict}%20${city}%20${province}%20${zip}`;
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${query}&key=e115d475b4d64403bef4b85a159facaf`
      );
      console.log(response);
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

        res.status(201).json(newWarehouse);
      } else {
        console.error("No results found");
        res.status(500).json({ error: "Geocoding error" });
      }
    } catch {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Delete Warehouse
  deleteWareHouse: async (req, res) => {
    try {
      const { id } = req.params;
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
      console.log(error);
      res.status(400).send({
        message: error.message,
      });
    }
  },

  // Change Admin Warehouse

  changeWarehouse: async (req, res) => {
    try {
      const { currentWarehouse, id_warehouse, id } = req.body;

      const findUser = await User.findOne({
        where: { id },
      });

      if (findUser.role === "adminWarehouse" || findUser.role === "user") {
        return res.status(400).send({
          message: "You don't have permission!",
        });
      }

      if (currentWarehouse === id_warehouse) {
        res.status(400).send({
          message: "You select the same warehouse, please select another",
        });
      }

      const result = await User.update(
        { id_warehouse },
        {
          where: {
            id: findUser.dataValues.id,
          },
        }
      );
      res.status(200).send({
        message: "Update admin warehouse success",
        data: result,
        findUser,
      });
    } catch (error) {
      console.log(error);
    }
  },
};
