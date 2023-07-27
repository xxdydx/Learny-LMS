const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable("assignments", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      link: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      section_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "sections",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      awskey: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      visibledate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      instructions: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      deadline: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      marks: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
      },
      updated_at: {
        type: DataTypes.DATE,
      },
    });

    await queryInterface.createTable("submissions", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      assignment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "assignments",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      student_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        allowNull: false,
        onDelete: "CASCADE",
      },

      submitted_link: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      marked_link: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      submitted_aws_key: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      marked_aws_key: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      comments: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      grade: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
      },
      updated_at: {
        type: DataTypes.DATE,
      },
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable("assignments");
    await queryInterface.dropTable("submissions");
  },
};
