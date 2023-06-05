'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Categories', [{
      category: 'smartphone',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      category: 'watch',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      category: 'earphone',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Categories', null, {});

  }
};
