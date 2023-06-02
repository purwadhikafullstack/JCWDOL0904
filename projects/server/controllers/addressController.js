const db = require("../models");
const address = db.Address;
const axios = require("axios")

const OpenCageGeocoder = require("opencage-api-client")

module.exports = {
    getAllAddresses: async (req, res) => {
        try {
            const addresses = await address.findAll();
            res.json(addresses);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
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
                res.status(404).json({ error: 'Address not found' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Create a new address
    // e115d475b4d64403bef4b85a159facaf
    createAddress: async (req, res) => {
        try {
            const {
                recipient_name,
                phone_number,
                is_default,
                province,
                city,
                subdistrict,
                zip,
            } = req.body;

            const query = `${subdistrict}%20${city}%20${province}%20${zip}`;
            const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${query}&key=e115d475b4d64403bef4b85a159facaf`);

            if (response.status === 200 && response.data.results.length > 0) {
                const { geometry } = response.data.results[0];
                const { lat: latitude, lng: longitude } = geometry;

                const newAddress = await address.create({
                    recipient_name,
                    phone_number,
                    is_default,
                    province,
                    city,
                    subdistrict,
                    zip,
                    latitude,
                    longitude,
                });

                res.status(200).send({
                    isError: false,
                    message: "Post Address Success",
                    newAddress
                });
            } else {
                console.error('No results found');
                res.status(500).json({ error: 'Geocoding error' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    // Delete an address
    deleteAddress: async (req, res) => {
        try {
            const id = req.params.id;

            // Delete the address from the database
            const deletedRows = await address.destroy({ where: { id: id } });

            if (deletedRows > 0) {
                res.json({ message: 'Address deleted successfully' });
            } else {
                res.status(404).json({ error: 'Address not found' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}