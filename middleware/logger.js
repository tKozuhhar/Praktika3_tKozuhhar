// Подключаем библиотеку file system, чтобы работать с файлами на компьютере
// Мы будем использовать её, чтобы записывать действия пользователей в файл activity.log
const fs = require("fs");
const path = require("path");

// Создаём функцию logger — она будет записывать, что делают пользователи
const logger = (req, res, next) => {
  const logFilePath = path.join(process.cwd(), "activity.log");

  // req.method — это тип запроса
  // Если пользователь неизвестен (например, токен не прошёл проверку), пишем "неизвестен"
  res.on("finish", () => {
    const log = `${new Date().toISOString()} - ${req.method} ${req.originalUrl} - User: ${req.user?.username || "неизвестен"}\n`;
    // fs.appendFile добавляет текст в конец файла
    fs.appendFile(logFilePath, log, (err) => {
      // Если произошла ошибка, выводим её
      if (err) console.error("Ошибка логирования:", err);
    });
  });
  
  next();
};

module.exports = logger;