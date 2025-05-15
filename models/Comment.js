const { DataTypes, Model } = require("sequelize");
const db = require("../config/database");

class Comment extends Model {}
Comment.init(
  {
    content: { // Поле content — текст комментария
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "userAdmin",
        key: "id",
      },
    },
    bookId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "books",
        key: "id",
      },
    },
  },
  {
    sequelize: db,
    modelName: "Comment",
    tableName: "comments",
    timestamps: true,
  }
);

module.exports = Comment;