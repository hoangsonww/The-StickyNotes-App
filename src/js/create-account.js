document.getElementById('createAccountForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const email = document.getElementById('newEmail').value;
  const password = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (!isValidPassword(password)) {
    alert('Password does not meet the security requirements.\n\n' +
      'Your password must include:\n' +
      '- At least 8 characters\n' +
      '- At least one uppercase letter\n' +
      '- At least one lowercase letter\n' +
      '- At least one number\n' +
      '- At least one special character (e.g., !@#$%^&*)');
    return;
  }

  if (password !== confirmPassword) {
    alert('Passwords do not match.');
    return;
  }

  const accounts = JSON.parse(localStorage.getItem('accountsStickyNotes')) || [];
  if (accounts.some(account => account.email === email)) {
    alert('An account with this email already exists.');
    return;
  }

  accounts.push({ email, password });
  localStorage.setItem('accountsStickyNotes', JSON.stringify(accounts));
  alert('Account created successfully! Now please sign in on the sign in page to proceed.');
  window.location.href = 'sign-in.html';
});

function isValidPassword(password) {
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return (
    password.length >= minLength &&
    hasUppercase &&
    hasLowercase &&
    hasNumbers &&
    hasSpecialChar
  );
}

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
const code = '593309284d3eb093ee96647eb294905b';

async function fetchWeather(city) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${code}&units=metric`);
    const data = await response.json();
    displayWeather(data);
  }
  catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

function fetchWeatherByCoords(lat, lon) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${code}&units=metric`)
    .then(response => response.json())
    .then(data => displayWeather(data))
    .catch(error => {
      console.error('Error fetching weather data:', error);
      weatherDisplay.innerHTML = '<p>Error loading weather data</p>';
    });
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