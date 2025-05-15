const express = require("express");
const { Comment } = require("../models");
const { authenticateToken } = require("../middleware/auth");
const logger = require("../middleware/logger");
const router = express.Router();

router.post("/:bookId", authenticateToken, logger, async (req, res) => {
  try {
    const { content } = req.body;

    console.log('Authenticated user:', req.user);
    console.log('Book ID:', req.params.bookId);

    const comment = await Comment.create({
      content,
      userId: req.user.id, 
      bookId: req.params.bookId, 
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: "Error creating comment", error: error.message });
  }
});

// Создаём маршрут GET /comments/:bookId — он нужен, чтобы получить все комментарии к книге
router.get("/:bookId", authenticateToken, async (req, res) => {
  const comments = await Comment.findAll({ where: { bookId: req.params.bookId } });

  res.json(comments);
});

module.exports = router;