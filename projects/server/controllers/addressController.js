const db = require("../models");
const address = db.Address;
const axios = require("axios");
const { sequelize } = require("../models");
const OpenCageGeocoder = require("opencage-api-client");

module.exports = {
  getAddressByUser: async (req, res) => {
    try {
      const { id } = req.dataToken;
      const addresses = await address.findAll({ where: { id_user: id } });
      res.status(200).send(addresses);
    } catch (error) {
      console.error(error);
    }
  },

  // Get an address by ID
  getAddressById: async (req, res) => {
    try {
      const id = req.params.id;
      const addressResult = await address.findByPk(id);
      if (addressResult) {
        res.json(addressResult);
      } else {
        res.status(404).json({ error: "Address not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  createAddress: async (req, res) => {
    try {
      const { id } = req.dataToken;
      const {
        recipient_name,
        phone_number,
        province,
        city,
        address_city_id,
        subdistrict,
        zip,
      } = req.body;

      if (
        !recipient_name ||
        !phone_number ||
        !province ||
        !city ||
        !subdistrict ||
        !zip
      ) {
        return res.status(400).send({ message: "Please complete your data" });
      }
      const zipRegex = /^\d{5}$/;
      if (!zipRegex.test(zip)) {
        return res.status(400).send({ message: "ZIP code should be 5 digits" });
      }
      const query = `${subdistrict}%20${city}%20${province}%20${zip}`;
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${query}&key=e115d475b4d64403bef4b85a159facaf`
      );

      if (response.status === 200 && response.data.results.length > 0) {
        const { geometry } = response.data.results[0];
        const { lat: latitude, lng: longitude } = geometry;

        const newAddress = await address.create({
          recipient_name,
          phone_number,
          is_default: false,
          province,
          city,
          address_city_id,
          subdistrict,
          zip,
          latitude,
          longitude,
          id_user: id,
        });

        res.status(200).send({
          message: "New address created successfully",
          newAddress,
        });
      } else {
        console.error("No results found");
        res.status(500).json({ error: "Geocoding error" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Delete an address
  deleteAddress: async (req, res) => {
    try {
      const id = req.params.id;
      const deletedRows = await address.destroy({ where: { id: id } });

      if (deletedRows > 0) {
        res.json({ message: "Address deleted successfully" });
      } else {
        res.status(404).json({ error: "Address not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  changeDefaultAddress: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const { id, id_user } = req.body;
      await address.update(
        { is_default: false },
        { where: { id_user: id_user } }
      );

      await address.update(
        { is_default: true },
        { where: { id: id, id_user: id_user } }
      );

      await transaction.commit();
      const addressResult = await address.findByPk(id);

      res.status(200).send(addressResult, id, id_user);
    } catch (error) {
      console.error(error);
      await transaction.rollback();
      res.status(400).send({ message: "cacacac" });
    }
  },
};
