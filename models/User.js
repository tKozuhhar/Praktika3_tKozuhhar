const { DataTypes, Model } = require("sequelize");
const db = require("../config/database");

class User extends Model {}
User.init(
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Имена пользователей должны быть уникальными
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("Admin", "User"), // Роль может быть только одна
      defaultValue: "User", // Если роль не указана, пользователь автоматически будет "User"
    },
  },
  {
    sequelize: db,
    modelName: "User",
    tableName: "userAdmin",
    timestamps: true,
  }
);

module.exports = User;