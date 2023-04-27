const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.renameColumn("files", "fileName", "name");
    await queryInterface.renameColumn("files", "fileLink", "link");
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.renameColumn("files", "name", "fileName");
    await queryInterface.renameColumn("files", "link", "fileLink");
  },
};
