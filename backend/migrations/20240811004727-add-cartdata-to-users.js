module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('orders', 'address', {
      type: Sequelize.JSONB,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('orders', 'address', {
      type: Sequelize.STRING, 
      allowNull: false,
    });
  },
};
