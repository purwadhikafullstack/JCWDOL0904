const db = require("../models");
const { Warehouse } = db;
const axios = require("axios")

module.exports = {
    getAllWarehouses: async (req, res) => {
        try {
            const result = await Warehouse.findAll();
            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    createWarehouse: async (req, res) => {
        try {
            const {
                warehouse,
                province,
                city,
                subdistrict,
                zip,
            } = req.body;

            const query = `${subdistrict}%20${city}%20${province}%20${zip}`;
            const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${query}&key=e115d475b4d64403bef4b85a159facaf`);
            console.log(response);
            if (response.status === 200 && response.data.results.length > 0) {
                const { geometry } = response.data.results[0];
                const { lat: latitude, lng: longitude } = geometry;

                const newWarehouse = await Warehouse.create({
                    warehouse,
                    province,
                    city,
                    subdistrict,
                    zip,
                    latitude,
                    longitude,
                });

                res.status(201).json(newWarehouse);
            } else {
                console.error('No results found');
                res.status(500).json({ error: 'Geocoding error' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
}