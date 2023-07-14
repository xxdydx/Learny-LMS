const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn(
      "courses", // name of the table to add the column to
      "zoom_name", // name of the new column
      {
        type: DataTypes.TEXT,
      },
      {
        ifNotExists: true, // add the column only if it does not exist
      }
    );
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn("courses", "zoom_name");
  },
};
