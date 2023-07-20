module.exports = {
  getOrderWarehouseAvailable: async (longitude, latitude) => {
    const orderWarehouseAvailable = [
      [
        sequelize.literal(`ST_Distance_Sphere(
            POINT(${longitude}, ${latitude}),
            POINT(Warehouse.longitude, Warehouse.latitude)
          )`),
      ],
    ];
    return orderWarehouseAvailable;
  },
};
