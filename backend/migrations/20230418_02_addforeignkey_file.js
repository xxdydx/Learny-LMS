const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn("files", "section_id", {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "sections",
        key: "id",
      },
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn("files", "section_id");
  },
};
