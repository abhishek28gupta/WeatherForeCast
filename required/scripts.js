// API Setup
const apiKey = "383a6b9c6e9ea765db06dd9559238bfe";
const apiurl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const geoApiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric";

// Hindi translations for city names
const cityNameHindiMap = {
  "Mumbai": "मुंबई", "Delhi": "दिल्ली", "Bengaluru": "बेंगलुरु", "Kolkata": "कोलकत्ता",
  "Chennai": "चेन्नई", "Ahmedabad": "अहमदाबाद", "Hyderabad": "हैदराबाद", "Pune": "पुणे",
  "Surat": "सूरत", "Kanpur": "कानपुर", "Jaipur": "जयपुर", "Lucknow": "लखनऊ",
  "Nagpur": "नागपुर", "Indore": "इंदौर", "Thane": "ठाणे", "Bhopal": "भोपाल",
  "Visakhapatnam": "विशाखापत्तनम", "Pimpri & Chinchwad": "पिंपरी चिंचवड़", "Patna": "पटना",
  "Vadodara": "वडोदरा", "Ghaziabad": "गाजियाबाद", "Ludhiana": "लुधियाना", "Agra": "आगरा",
  "Nashik": "नासिक", "Faridabad": "फरीदाबाद"
};

// UI Elements
const searchbox = document.querySelector(".search input");
const searchbtn = document.querySelector(".search button");
const weathericon = document.querySelector(".icon");
const weatherSection = document.querySelector(".weather");
const errorSection = document.querySelector(".error");

// Loader
const loader = document.createElement("p");
loader.innerText = "Loading...";
loader.style.textAlign = "center";
loader.style.color = "#555";

// Theme toggle
const themeSwitch = document.getElementById("theme-switch");
const themeLabel = document.getElementById("theme-label");

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeSwitch.checked = true;
  themeLabel.textContent = "🌙 Dark Mode";
}

themeSwitch.addEventListener("change", () => {
  document.body.classList.toggle("dark");
  const lang = localStorage.getItem("lang") || "en";
  const mode = document.body.classList.contains("dark") ? "dark" : "light";
  localStorage.setItem("theme", mode);
  themeLabel.textContent = translations[lang][mode];
});

// Language setup
const translations = {
  en: {
    title: "Weather Forecast",
    placeholder: "Enter City Name",
    error: "Invalid City Name",
    humidity: "Humidity",
    wind: "Wind Speed",
    light: "🌞 Light Mode",
    dark: "🌙 Dark Mode"
  },
  hi: {
    title: "मौसम पूर्वानुमान",
    placeholder: "शहर का नाम दर्ज करें",
    error: "अमान्य शहर का नाम",
    humidity: "नमी",
    wind: "हवा की गति",
    light: "🌞 लाइट मोड",
    dark: "🌙 डार्क मोड"
  }
};

const langSelect = document.getElementById("language-select");

function updateLanguage(lang) {
  const t = translations[lang];
  document.querySelector(".container h1").textContent = t.title;
  document.querySelector(".search input").placeholder = t.placeholder;
  document.querySelector(".error h5").textContent = t.error;
  document.querySelectorAll(".details .col")[0].querySelector("p:last-child").textContent = t.humidity;
  document.querySelectorAll(".details .col")[1].querySelector("p:last-child").textContent = t.wind;
  const currentTheme = document.body.classList.contains("dark") ? "dark" : "light";
  themeLabel.textContent = t[currentTheme];
}

langSelect.addEventListener("change", (e) => {
  const lang = e.target.value;
  localStorage.setItem("lang", lang);
  updateLanguage(lang);
});

window.addEventListener("load", () => {
  const savedLang = localStorage.getItem("lang") || "en";
  langSelect.value = savedLang;
  updateLanguage(savedLang);
});

// Display logic
function displayWeather(data) {
  const currentLang = localStorage.getItem("lang") || "en";
  let city = data.name;
  if (currentLang === "hi" && cityNameHindiMap[city]) {
    city = cityNameHindiMap[city];
  }

  document.querySelector(".city").innerHTML = city;
  document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
  document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
  document.querySelector(".wind").innerHTML = data.wind.speed + " Km/H";

  const main = data.weather[0].main;
  if (main === "Clouds") weathericon.src = "required/img/clouds.png";
  else if (main === "Clear") weathericon.src = "required/img/clear.png";
  else if (main === "Rain") weathericon.src = "required/img/rain.png";
  else if (main === "Drizzle") weathericon.src = "required/img/drizzle.png";
  else if (main === "Mist") weathericon.src = "required/img/mist.png";
  else if (main === "Snow") weathericon.src = "required/img/snow.png";

  weatherSection.style.display = "block";
  errorSection.style.display = "none";
}

// Manual search function
async function checkweather(city) {
  weatherSection.style.display = "none";
  errorSection.style.display = "none";
  searchbox.parentElement.appendChild(loader);

  try {
    const response = await fetch(apiurl + city + `&appid=${apiKey}`);
    if (response.status === 404) {
      errorSection.style.display = "block";
    } else {
      const data = await response.json();
      displayWeather(data);
    }
  } catch {
    errorSection.style.display = "block";
  } finally {
    loader.remove();
  }
}

// Events
searchbtn.addEventListener("click", () => {
  const city = searchbox.value.trim();
  if (city) checkweather(city);
});

searchbox.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const city = searchbox.value.trim();
    if (city) checkweather(city);
  }
});