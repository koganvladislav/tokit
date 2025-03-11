const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=Shorts&chart=top&maxResults=100&regionCode=RU&key=AIzaSyAajvPaSxDC8NMm1Yn50W2V2Ym_TIcm4x8`;

let videos = []; // Массив для хранения ссылок

fetch(url)
  .then(response => response.json())
  .then(data => {
    videos = data.items
      .filter(item => item.id.kind === "youtube#video") // Фильтруем только видео
      .map(item => `https://www.youtube.com/embed/${item.id.videoId}?autoplay=1&controls=0&modestbranding=1&showinfo=0&rel=0&fs=0&iv_load_policy=3&disablekb=1`); // Формируем ссылки с параметрами

    console.log("Массив ссылок:", videos); // Проверка результата

    // Загружаем первое видео сразу
    if (videos.length > 0) {
      document.querySelector("iframe").src = videos[0];
    }
  })
  .catch(error => console.error("Ошибка:", error));

let currentIndex = 0;

function nextVideo() {
  currentIndex = (currentIndex + 1) % videos.length;
  document.querySelector("iframe").src = videos[currentIndex];
}

function prevVideo() {
  currentIndex = (currentIndex - 1 + videos.length) % videos.length;
  document.querySelector("iframe").src = videos[currentIndex];
}
