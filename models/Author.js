const { DataTypes, Model } = require("sequelize");

const db = require("../config/database");

// Создаём класс Author — это будет наша модель для авторов
class Author extends Model {}

// Определяем, как должна выглядеть таблица authors в базе данных
Author.init(
  {
    // allowNull: false означает, что имя нельзя оставить пустым
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    // Указываем, к какой базе данных подключаемся (из config/database.js)
    sequelize: db,
    modelName: "Author",
    tableName: "authors",
    // Не добавляем автоматические поля даты создания и изменения
    timestamps: false,
  }
);

module.exports = Author;