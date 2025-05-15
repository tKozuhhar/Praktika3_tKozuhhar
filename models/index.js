const Book = require("./Book");
const Author = require("./Author");
const Category = require("./Category");
const User = require("./User");
const Comment = require("./Comment");

// Указываем связи между таблицами (как они связаны друг с другом)
// Это нужно, чтобы Sequelize знал, как доставать данные из разных таблиц вместе

Book.belongsTo(Category, { foreignKey: "categoryId" });
Category.hasMany(Book, { foreignKey: "categoryId" });

Book.belongsToMany(Author, { through: "BookAuthors" });
Author.belongsToMany(Book, { through: "BookAuthors" });

Comment.belongsTo(User, { foreignKey: "userId" });
Comment.belongsTo(Book, { foreignKey: "bookId" });
User.hasMany(Comment, { foreignKey: "userId" });
Book.hasMany(Comment, { foreignKey: "bookId" });

module.exports = { Book, Author, Category, User, Comment };