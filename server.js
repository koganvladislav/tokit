const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Путь к папке с видео
const videoDir = path.join(__dirname, 'videos');

// Маршрут для получения списка видео по теме
app.get('/api/videos', (req, res) => {
    const topic = req.query.topic; // Получаем параметр темы
    if (!topic) {
        return res.status(400).send('Не указана тема');
    }

    const topicFolder = path.join(videoDir, topic);
    
    // Проверяем, существует ли такая папка
    if (!fs.existsSync(topicFolder)) {
        return res.status(404).send('Тема не найдена');
    }

    // Читаем все файлы в папке и отбираем только .mp4 файлы
    fs.readdir(topicFolder, (err, files) => {
        if (err) {
            return res.status(500).send('Ошибка при чтении файлов');
        }

        const mp4Files = files.filter(file => file.endsWith('.mp4'));
        res.json(mp4Files); // Отправляем список mp4 файлов
    });
});

// Статическая отдача видео файлов
app.use('/videos', express.static(videoDir));

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
