const { DataTypes, Model } = require("sequelize");

const db = require("../config/database");

class Book extends Model {}

Book.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    publicationYear: {
      type: DataTypes.INTEGER,
      field: "publication_year", // В базе это поле будет называться publication_year (а не publicationYear)
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "category_id",
      references: {
        model: "categories", // Ссылается на таблицу categories
        key: "category_id",  // Ссылается на поле category_id
      },
    },
  },
  {
    sequelize: db,
    modelName: "Book",
    tableName: "books",
    timestamps: false,
  }
);

module.exports = Book;