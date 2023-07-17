"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Warehouses", [
      {
        warehouse: "Bandung",
        province: "Jawa Barat",
        city: "Kota Bandung",
        warehouse_city_id: 23,
        subdistrict: "Camanik",
        zip: 40294,
        latitude: "-6.9214467",
        longitude: "107.6770159",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        warehouse: "Surabaya",
        province: "Jawa Timur",
        city: "Surabaya",
        warehouse_city_id: 444,
        subdistrict: "Sukolilo",
        zip: 60111,
        latitude: "-7.2890751",
        longitude: "112.8094654",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        warehouse: "DI Yogyakarta",
        province: "DI Yogyakarta",
        city: "Gunung Kidul",
        warehouse_city_id: 135,
        subdistrict: "Gedangsari",
        zip: 78875,
        latitude: "-7.837118",
        longitude: "110.5916244",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Warehouses", null, {});
  },
};
