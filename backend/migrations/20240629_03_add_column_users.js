const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn(
      "users", // name of the table to add the column to
      "disabled", // name of the new column
      {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      }
    );
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn("users", "disabled");
  },
};
