const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.changeColumn("recordings", "duration", {
      type: DataTypes.TEXT,
      allowNull: true,
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.changeColumn("recordings", "duration", {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    });
  },
};
