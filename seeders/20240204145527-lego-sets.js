const { faker } = require('@faker-js/faker');
('use strict');

const theme = [
  'Star Wars',
  'Batman',
  'Harry Potter',
  'Disney',
  'Marvel',
  'Lord of the Rings',
  'Indiana Jones',
  'Jurassic World',
  'NINJAGO',
  'Minecraft',
  'Classic',
  'City',
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert(
      'LegoSets',
      [...Array(100)].map(() => ({
        theme: theme[Math.floor(Math.random() * theme.length)],
        price: faker.random.numeric(3),
        name: faker.lorem.sentence(2),
        description: faker.lorem.sentence(10),
        images: JSON.stringify(
          [...Array(7)].map(
            () => `${faker.image.urlLoremFlickr({ category: 'lego' })}`,
          ),
        ),
        vendor_code: faker.internet.password(),
        in_stock: faker.random.numeric(1),
        bestseller: faker.datatype.boolean(),
        new: faker.datatype.boolean(),
        popularity: faker.datatype.boolean(3),
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('LegoSets', null, {});
  },
};
