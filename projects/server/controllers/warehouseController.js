const db = require("../models");
const { Warehouse, Stocks } = db;
const axios = require("axios");

module.exports = {
  getAllWarehouses: async (req, res) => {
    try {
      const result = await Warehouse.findAll();
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  createWarehouse: async (req, res) => {
    try {
      const { warehouse, province, city, warehouse_city_id, subdistrict, zip } =
        req.body;

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

        res.status(201).json(newWarehouse);
      } else {
        console.error("No results found");
        res.status(500).json({ error: "Geocoding error" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
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
  deleteWareHouse: async (req, res) => {
    try {
      const { id } = req.params;
      //   console.log(id);
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
    }
  },
};
