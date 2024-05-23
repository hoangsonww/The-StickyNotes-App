document.addEventListener('DOMContentLoaded', function () {
  const quoteContainer = document.getElementById('quote');
  const newQuoteButton = document.getElementById('new-quote');

  async function fetchQuotes() {
    try {
      quoteContainer.innerHTML = '';
      const response = await axios.get('https://type.fit/api/quotes');
      const quotes = response.data;
      for (let i = 0; i < 3; i++) {
        const quoteIndex = Math.floor(Math.random() * quotes.length);
        const quote = quotes[quoteIndex];
        const author = quote.author ? quote.author.replace(', type.fit', '') : "Unknown";
        quoteContainer.innerHTML += `
        <p>
            <span class="quote-text" style="color: black">${quote.text}</span><br>
            <span class="quote-author">— ${author}</span>
        </p>`;
      }
    }
    catch (error) {
      quoteContainer.innerHTML = `<p>Sorry, we couldn't fetch quotes right now. Please revisit later.</p>`;
    }
  }

  fetchQuotes();
  newQuoteButton.addEventListener('click', fetchQuotes);
});

const themeToggleButton = document.createElement("button");
themeToggleButton.innerText = "Toggle Dark Mode";
themeToggleButton.id = "themeToggle";
themeToggleButton.className = "button";
themeToggleButton.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark-mode");
  }
  else {
    localStorage.removeItem("theme");
  }
});

function toggleDarkMode() {
  const isDarkMode = document.body.classList.toggle('dark-mode');
  if (isDarkMode) {
    localStorage.setItem('theme', 'dark-mode');
  }
  else {
    localStorage.removeItem('theme');
  }
}

document.addEventListener("DOMContentLoaded", function() {
  function updateTime() {
    const now = new Date();
    const timeParts = now.toLocaleTimeString().split(" ");
    const timeString = timeParts[0];
    const amPm = timeParts[1];
    document.getElementById("timeContainer").innerHTML = timeString + "<br>" + amPm;
  }
  updateTime();
  setInterval(updateTime, 1000);
});

document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark-mode") {
    document.body.classList.add("dark-mode");
  }
  else {
    document.body.classList.remove("dark-mode");
  }
});

const weatherSearchContainer1 = document.getElementById('weather-search-container');
const weatherSearchInput1 = document.getElementById('weather-search-input');
const weatherSearchBtn1 = document.getElementById('weather-search-btn');
const weatherLoc = `${getWeather()}`;

async function fetchWeather(city) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherLoc}&units=metric`);
    const data = await response.json();
    displayWeather(data);
  }
  catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

function fetchWeatherByCoords(lat, lon) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherLoc}&units=metric`)
    .then(response => response.json())
    .then(data => displayWeather(data))
    .catch(error => {
      console.error('Error fetching weather data:', error);
      weatherDisplay.innerHTML = '<p>Error loading weather data</p>';
    });
}

function getWeather() {
  const weatherLoc = 'NTkzMzA5Mjg0ZDNlYjA5M2VlOTY2NDdlYjI5NDkwNWI=';
  const weatherLat = atob(weatherLoc);
  return weatherLat;
}

function handleGeoLocation(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  weatherDisplay1.innerHTML = "<p>Loading Weather...</p>";
  fetchWeatherByCoords(lat, lon);
}

weatherSearchBtn1.addEventListener('click', () => {
  const city = weatherSearchInput1.value;
  fetchWeather(city);
});

weatherSearchInput1.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const city = weatherSearchInput1.value;
    fetchWeather(city);
  }
});

const weatherDisplay1 = document.getElementById('weather-display');
weatherDisplay1.innerHTML = "<p>Loading Weather...</p>";

function displayWeather(data) {
  if (data.cod !== 200) {
    weatherDisplay1.innerHTML = '<p>Weather data not found</p>';
    return;
  }
  const temp = data.main.temp.toFixed(0);
  weatherDisplay1.innerHTML = `
        <strong style="text-align: center; margin-top: -5px">${data.name}</strong>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="Weather icon">
        <span>${temp}°C</span>
    `;
}

const isMobileDevice1 = window.innerWidth < 768;

if (!isMobileDevice1 && navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(handleGeoLocation, (error) => {
    if (error.code === error.PERMISSION_DENIED) {
      weatherDisplay1.innerHTML = "<p>Location Access Denied.</p>";
    }
    weatherSearchContainer1.classList.remove('weather-hidden');
  });
}
else {
  weatherSearchContainer1.classList.remove('weather-hidden');
}

document.addEventListener("DOMContentLoaded", () => {
  loadTasksFromLocalStorage();
});

const taskInput1 = document.getElementById("task-input");
const taskList1 = document.getElementById("task-list");

taskInput1.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    addTask(taskInput1.value);
    taskInput1.value = '';
  }
});

function addTask(task) {
  if (task.trim() === '') return;
  const li = document.createElement("li");
  li.textContent = task;
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "✖";
  deleteBtn.onclick = function() {
    this.parentElement.remove();
    updateLocalStorage();
  };
  li.appendChild(deleteBtn);
  taskList1.appendChild(li);
  updateLocalStorage();
}

function updateLocalStorage() {
  const tasks = [];
  document.querySelectorAll("#task-list li").forEach(li => {
    tasks.push(li.textContent.replace("✖", "").trim());
  });
  localStorage.setItem("quick-tasks", JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
  const tasks = JSON.parse(localStorage.getItem("quick-tasks")) || [];
  tasks.forEach(task => addTask(task));
}
