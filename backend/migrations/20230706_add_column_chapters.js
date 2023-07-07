const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn(
      "chapters", // name of the table to add the column to
      "pinned", // name of the new column
      {
        type: DataTypes.BOOLEAN,
      },
      {
        ifNotExists: true, // add the column only if it does not exist
      }
    );
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn("chapters", "pinned");
  },
};
