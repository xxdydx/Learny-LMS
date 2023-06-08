const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn(
      "chapters", // name of the table to add the column to
      "created_at", // name of the new column
      {
        type: DataTypes.DATE,
      },
      {
        ifNotExists: true, // add the column only if it does not exist
      }
    );
    await queryInterface.addColumn(
      "chapters", // name of the table to add the column to
      "updated_at", // name of the new column
      {
        type: DataTypes.DATE,
      },
      {
        ifNotExists: true, // add the column only if it does not exist
      }
    );
    await queryInterface.addColumn(
      "sections", // name of the table to add the column to
      "created_at", // name of the new column
      {
        type: DataTypes.DATE,
      },
      {
        ifNotExists: true, // add the column only if it does not exist
      }
    );
    await queryInterface.addColumn(
      "sections", // name of the table to add the column to
      "updated_at", // name of the new column
      {
        type: DataTypes.DATE,
      },
      {
        ifNotExists: true, // add the column only if it does not exist
      }
    );
    await queryInterface.addColumn(
      "files", // name of the table to add the column to
      "created_at", // name of the new column
      {
        type: DataTypes.DATE,
      },
      {
        ifNotExists: true, // add the column only if it does not exist
      }
    );
    await queryInterface.addColumn(
      "files", // name of the table to add the column to
      "updated_at", // name of the new column
      {
        type: DataTypes.DATE,
      },
      {
        ifNotExists: true, // add the column only if it does not exist
      }
    );
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn("chapters", "created_at");
    await queryInterface.removeColumn("chapters", "updated_at");
    await queryInterface.removeColumn("sections", "created_at");
    await queryInterface.removeColumn("sections", "updated_at");
    await queryInterface.removeColumn("files", "created_at");
    await queryInterface.removeColumn("files", "updated_at");
  },
};
