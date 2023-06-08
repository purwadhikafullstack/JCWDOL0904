'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Products', [{
      product_name: 'Galaxy A54 5G',
      product_image: 'http://localhost:8000/Galaxy_A54_5G.png',
      price: 6399000,
      description: "Mulai dari Rp 533.250/bln. Kalkulator Finansial",
      id_category:1,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      product_name: 'Galaxy S23 Ultra',
      product_image: 'http://localhost:8000/Galaxy_S23_Ultra.png',
      price: 21999000,
      description: "Epic night shots that beg to be shared",
      id_category:1,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      product_name: 'Galaxy S23+',
      product_image: 'http://localhost:8000/Galaxy_S23+.png',
      price: 17999000,
      description: "Snap your best night selfies yet",
      id_category:1,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      product_name: 'Galaxy S23',
      product_image: 'http://localhost:8000/Galaxy_S23.png',
      price: 13999000,
      description: "Snap your best night selfies yet",
      id_category:1,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      product_name: 'Galaxy S22+',
      product_image: 'http://localhost:8000/Galaxy_S22+.png',
      price: 13749000,
      description: "The biggest leap in our video technology",
      id_category:1,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      product_name: 'Galaxy S22 Ultra',
      product_image: 'http://localhost:8000/Galaxy_S22_Ultra.png',
      price: 15999000,
      description: "The biggest leap in our video technology",
      id_category:1,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      product_name: 'Galaxy S21 FE 5G',
      product_image: 'http://localhost:8000/Galaxy_S21_FE_5G.png',
      price: 7999000,
      description: "Our smoothest scrolling screen with Super Smooth 120 Hz",
      id_category:1,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      product_name: 'Galaxy A24',
      product_image: 'http://localhost:8000/Galaxy_A24.png',
      price: 3499000,
      description: "Layar 6,5 inci Full HD+, Main Camera 50MP, Baterai tahan hingga 2 hari",
      id_category:1,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      product_name: 'Galaxy A34 5G',
      product_image: 'http://localhost:8000/Galaxy_A34_5G.png',
      price: 5399000,
      description: "Layar FHD+ Super AMOLED berukuran 6,6 inci",
      id_category:1,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      product_name: 'Galaxy A14',
      product_image: 'http://localhost:8000/Galaxy_A14.png',
      price: 2399000,
      description: "Layar 6,6 inci, Kamera 50MP, Prosesor Octa-core",
      id_category:1,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      product_name: 'Galaxy Watch5 Bluetooth (40mm)',
      product_image: 'http://localhost:8000/Galaxy_Watch5_Bluetooth_(40mm).png',
      price: 3499000,
      description: "Monitor your health around the clock even at night",
      id_category:2,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      product_name: 'Galaxy Watch5 Bluetooth (44mm)',
      product_image: 'http://localhost:8000/Galaxy_Watch5_Bluetooth_(44mm).png',
      price: 3999000,
      description: "Monitor your health around the clock even at night",
      id_category:2,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      product_name: 'Galaxy Buds2 Pro',
      product_image: 'http://localhost:8000/Galaxy_Buds2_Pro.png',
      price: 2799000,
      description: "24bit Hi-Fi sound for quality listening experience",
      id_category:3,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      product_name: 'Galaxy Buds2',
      product_image: 'http://localhost:8000/Galaxy_Buds2.png',
      price: 1699000,
      description: "Well-balanced Sound, Battery Life, ANC",
      id_category:3,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      product_name: 'Galaxy Buds Live',
      product_image: 'http://localhost:8000/Galaxy_Buds_Live.png',
      price: 1599000,
      description: "Suara yang dalam & kaya dengan bass boost yang bertenaga",
      id_category:3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Products', null, {});

  }
};
