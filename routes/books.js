const express = require("express");
const { Book, Author, Category } = require("../models");
// Подключаем функции authenticateToken и isAdmin из middleware/auth.js
const { authenticateToken, isAdmin } = require("../middleware/auth");
const logger = require("../middleware/logger");
const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  // include: [Author, Category] говорит, что нужно достать книги вместе с их авторами и категориями
  const books = await Book.findAll({ include: [Author, Category] });

  res.json(books);
});

// isAdmin проверяет, что пользователь — админ (только админы могут обновлять книги)
router.put("/:id", authenticateToken, isAdmin, logger, async (req, res) => {
  const { title, publicationYear, categoryId } = req.body;

  const book = await Book.findByPk(req.params.id);

  // Если книга не найдена, отправляем ошибку с кодом 404
  if (!book) return res.status(404).json({ message: "Книга не найдена" });

  // Обновляем книгу с новыми данными (title, publicationYear, categoryId)
  // Если какое-то поле не указано, оно останется без изменений
  await book.update({ title, publicationYear, categoryId });

  // Отправляем обновлённую книгу в ответе
  res.json(book);
});

// Создаём маршрут DELETE /books/:id — он нужен, чтобы удалить книгу с определённым ID
router.delete("/:id", authenticateToken, isAdmin, logger, async (req, res) => {
  const book = await Book.findByPk(req.params.id);

  if (!book) return res.status(404).json({ message: "Книга не найдена" });

  // Удаляем книгу из базы данных
  await book.destroy();

  // Отправляем сообщение об успешном удалении
  res.json({ message: "Книга удалена" });
});

// Создаём маршрут GET /books/:id для получения информации по книге по ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await Book.findOne({
      where: { id: bookId },
      include: [Author, Category], 
    });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(book);
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;