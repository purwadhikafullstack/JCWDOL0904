"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Warehouses", [
      {
        warehouse: "Warehouse 1",
        province: "Jawa Barat",
        city: "Kota Bandung",
        warehouse_city_id: 23,
        subdistrict: "Camanik",
        zip: 40294,
        latitude: "-6.9214467",
        longitude: "107.6770159",
        id_user: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        warehouse: "Warehouse 2",
        province: "Jawa Timur",
        city: "Surabaya",
        warehouse_city_id: 444,
        subdistrict: "Sukolilo",
        zip: 60111,
        latitude: "-7.2890751",
        longitude: "112.8094654",
        id_user: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        warehouse: "Warehouse 3",
        province: "DI Yogyakarta",
        city: "Gunung Kidul",
        warehouse_city_id: 135,
        subdistrict: "Gedangsari",
        zip: 78875,
        latitude: "-7.837118",
        longitude: "110.5916244",
        id_user: 7,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Warehouses", null, {});
  },
};
