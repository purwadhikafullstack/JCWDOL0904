const db = require("..//models");
const promotion = db.Promotions;

module.exports = {
  getAllPromotion: async (req, res) => {
    try {
      const wideSc = await promotion.findAll({
        where: {
          resolusi: 1,
        },
      });

      const smallSc = await promotion.findAll({
        where: {
          resolusi: 2,
        },
      });
      res.status(200).send({
        wideSc,
        smallSc,
      });
    } catch (error) {
      res.status(400).send(error);
    }
  },
};
