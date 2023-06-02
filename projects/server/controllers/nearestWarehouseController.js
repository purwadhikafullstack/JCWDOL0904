const db = require("../models");
const { Warehouse, Address } = db;
const { sequelize } = require('../models');

module.exports = {
    findNearestWarehouse: async (req, res) => {
        try {
            const { addressId } = req.params;

            // Find the address by ID
            const address = await Address.findByPk(addressId);

            if (!address) {
                return res.status(404).json({ error: 'Address not found' });
            }

            // Find the nearest warehouse using the Haversine formula
            const nearestWarehouse = await Warehouse.findOne({
                order: [
                    [
                        sequelize.literal(`ST_Distance_Sphere(
                  POINT(${address.longitude}, ${address.latitude}),
                  POINT(Warehouse.longitude, Warehouse.latitude)
                )`)
                    ]
                ],
                limit: 1
            });

            if (!nearestWarehouse) {
                return res.status(404).json({ error: 'Nearest warehouse not found' });
            }

            res.json(nearestWarehouse);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}