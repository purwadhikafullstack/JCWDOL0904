'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Ekspedisis', [{
      name: 'JNE',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: 'JNT',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Ekspedisis', null, {});

  }
};
