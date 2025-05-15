// Подключаем модели Book, Author и Category из папки models
const { Book, Author, Category } = require("../models");

const axios = require("axios");

const importBooks = async () => {
  // Создаём список категорий, которые мы хотим загрузить (например, "fiction" — художественная литература)
  const categories = ["fiction", "fantasy", "history", "romance", "mystery"];

  // Оборачиваем весь код в try-catch, чтобы увидеть ошибки
  try {
    // Проходим по каждой категории из списка (fiction, fantasy и т.д.)
    for (const subject of categories) {
      const [category] = await Category.findOrCreate({     // ждём, пока база данных ответит и ищет категорию
        where: { name: subject }, // Ищем категорию с таким именем
      });

      // Делаем запрос к Open Library, чтобы получить книги по этой категории
      const res = await axios.get(
        `https://openlibrary.org/subjects/${subject}.json?limit=5` // мы берём только 5 книг, чтобы не перегружать
      );

      // Из ответа от Open Library берём список книг
      const works = res.data.works;

      // Проходим по каждой книге из списка
      for (const work of works) {
        // Пытаемся найти книгу в базе или создать новую
        // Ищем по названию (title) и году издания (publicationYear)
        const [book] = await Book.findOrCreate({
          where: {
            title: work.title, // Название книги из Open Library
            publicationYear: work.first_publish_year || null, // Год издания (если года нет, ставим null)
          },
          defaults: {
            categoryId: category.categoryId, // Привязываем книгу к категории (например, "fiction")
          },
        });

        // Проверяем, есть ли у книги авторы
        if (work.authors) {
          // Проходим по каждому автору книги
          for (const authorData of work.authors) {
            // Разделяем имя автора на части (например, "J.K. Rowling" → ["J.K.", "Rowling"])
            // "trim()" убирает лишние пробелы, "split(" ")" разбивает строку по пробелам
            const nameParts = authorData.name.trim().split(" ");

            // Берём последнее слово как фамилию (например, "Rowling")
            const lastName = nameParts.pop();

            // Остальные слова объединяем как имя (например, "J.K.")
            const firstName = nameParts.join(" ");

            // Ищем автора в базе или создаём нового
            // Проверяем по имени и фамилии
            const [author] = await Author.findOrCreate({
              where: {
                firstName, // Имя автора
                lastName,  // Фамилия автора
              },
            });

            // Связываем книгу с автором
            // "addAuthor" автоматически создаёт запись в этой таблице
            await book.addAuthor(author);
          }
        }
      }
    }

    console.log("Данные успешно импортированы!");
  } catch (error) {
    console.error("Ошибка при импорте:", error.message);
  }
};

// Запускаем функцию importBooks, чтобы она начала загружать данные
importBooks();