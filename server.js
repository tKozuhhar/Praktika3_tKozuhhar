const express = require("express");
const { authenticateToken } = require("./middleware/auth");
const logger = require("./middleware/logger");
const db = require("./config/database");
const authRoutes = require("./routes/auth");
const bookRoutes = require("./routes/books");
const commentRoutes = require("./routes/comments");
const { importBooks } = require("./config/InsertFromOL");
// Создаём приложение (сервер) с помощью express
// app — это сервер, который будет обрабатывать запросы

const app = express();

app.post("/import", async (req, res) => {
  try {
    // Запускаем процесс импорта книг
    await importBooks();
    res.status(200).send("Книги успешно импортированы!");
  } catch (error) {
    res.status(500).send("Ошибка при импорте книг: " + error.message);
  }
});

// Настраиваем сервер, чтобы он понимал JSON
// Это нужно, чтобы сервер мог принимать данные в формате JSON, например, { "username": "student123", "password": "123" }
app.use(express.json());

// Все запросы, которые начинаются с /auth (например, /auth/register), будут обрабатываться кодом из authRoutes
app.use("/auth", authRoutes);

app.use("/books", authenticateToken, logger, bookRoutes);
//app.use("/books", authenticateToken, bookRoutes);

app.use("/comments", authenticateToken, logger, commentRoutes);

// Указываем порт, на котором будет работать сервер
const PORT = 3000;

// Синхронизируем базу данных и запускаем сервер
// db.sync({ force: true }) — синхронизирует модели (таблицы) с базой данных
// force: true означает, что таблицы будут пересозданы (все данные удалятся!)
// Если не хочешь удалять данные, убери { force: true }
db.sync()
  .then(() => {
  // После успешной синхронизации запускаем сервер
  // app.listen(PORT, ...) — запускает сервер на указанном порту (3000)
  app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
  });
}).catch((err) => {
  console.error("Ошибка подключения к БД: ", err);
});