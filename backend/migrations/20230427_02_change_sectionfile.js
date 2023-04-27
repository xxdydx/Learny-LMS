const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.changeColumn("sections", "chapter_id", {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "chapters",
        key: "id",
      },
      onDelete: "CASCADE",
    });
    await queryInterface.changeColumn("files", "section_id", {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "sections",
        key: "id",
      },
      onDelete: "CASCADE",
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.changeColumn("sections", "chapter_id", {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "chapters",
        key: "id",
      },
    });
    await queryInterface.changeColumn("files", "section_id", {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "sections",
        key: "id",
      },
    });
  },
};
