const db = require("..//models");
const { Warehouse, Address } = db;
const { sequelize } = require("..//models");

module.exports = {
  findNearestWarehouse: async (req, res) => {
    try {
      const { addressId } = req.params;
      const address = await Address.findByPk(addressId);

      if (!address) {
        return res.status(404).json({ error: "Address not found" });
      }
      const nearestWarehouse = await Warehouse.findOne({
        order: [
          [
            sequelize.literal(`ST_Distance_Sphere(
                  POINT(${address.longitude}, ${address.latitude}),
                  POINT(Warehouse.longitude, Warehouse.latitude)
                )`),
          ],
        ],
        limit: 1,
      });

      if (!nearestWarehouse) {
        return res.status(404).json({ error: "Nearest warehouse not found" });
      }

      res.json(nearestWarehouse);
    } catch (error) {
      // res.status(400).send({
      //   message: "failed get nearest warehouse!",
      // });
    }
  },
};
