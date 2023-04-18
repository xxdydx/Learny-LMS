const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn("sections", "chapter_id", {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "chapters",
        key: "id",
      },
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn("sections", "chapter_id");
  },
};
