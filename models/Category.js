const { DataTypes, Model } = require("sequelize");
const db = require("../config/database");

class Category extends Model {}
Category.init(
  {
    categoryId: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Главный ключ
      autoIncrement: true, // ID будет увеличиваться автоматически (1, 2, 3 и т.д.)
      field: "category_id",
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "Category",
    tableName: "categories",
    timestamps: false,
  }
);

module.exports = Category;