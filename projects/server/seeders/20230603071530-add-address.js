'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Addresses', [{
      recipient_name: 'asep',
      phone_number: "080000000002",
      is_default: 1,
      province: "Jawa Barat",
      city: "Pangandaran",
      address_city_id: 103,
      subdistrict: "Cijulang",
      zip: 46394,
      latitude: "-7.6917683",
      longitude: "108.4952257",
      id_user: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      recipient_name: 'zainur',
      phone_number: "080000000001",
      is_default: 1,
      province: "Jawa Timur",
      city: "Nganjuk",
      address_city_id: 305,
      subdistrict: "Nganjuk",
      zip: 64415,
      latitude: "-7.6023595",
      longitude: "111.9010553",
      id_user: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      recipient_name: 'asep',
      phone_number: "080000000001",
      is_default: 0,
      province: "Jawa Barat",
      city: "Cimahi",
      address_city_id: 107,
      subdistrict: "Cimahi Tengah",
      zip: 40521,
      latitude: "-6.9007783",
      longitude: "107.5556959",
      id_user: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Addresses', null, {});
  }
};
