const apiKey = "383a6b9c6e9ea765db06dd9559238bfe";
const apiurl = "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";

const searchbox = document.querySelector(".search input");
const searchbtn = document.querySelector(".search button");
const weathericon = document.querySelector(".icon");
const weatherSection = document.querySelector(".weather");
const errorSection = document.querySelector(".error");

// Loading spinner element (create one in HTML or inject it)
const loader = document.createElement("p");
loader.innerText = "Loading...";
loader.style.textAlign = "center";
loader.style.color = "#555";

async function checkweather(city) {
    // Show loader
    weatherSection.style.display = "none";
    errorSection.style.display = "none";
    searchbox.parentElement.appendChild(loader);

    try {
        const response = await fetch(apiurl + city + `&appid=${apiKey}`);
        if (response.status == 404) {
            errorSection.style.display = "block";
            weatherSection.style.display = "none";
        } else {
            const data = await response.json();

            document.querySelector(".city").innerHTML = data.name;
            document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
            document.querySelector(".humidity").innerHTML = data.main.humidity + " %";
            document.querySelector(".wind").innerHTML = data.wind.speed + " Km/H";

            // Set icon
            switch (data.weather[0].main) {
                case "Clouds":
                    weathericon.src = "required/img/clouds.png";
                    break;
                case "Clear":
                    weathericon.src = "required/img/clear.png";
                    break;
                case "Rain":
                    weathericon.src = "required/img/rain.png";
                    break;
                case "Drizzle":
                    weathericon.src = "required/img/drizzle.png";
                    break;
                case "Mist":
                    weathericon.src = "required/img/mist.png";
                    break;
                case "Snow":
                    weathericon.src = "required/img/snow.png";
                    break;
                default:
                    weathericon.src = "required/img/clear.png";
                    break;
            }

            weatherSection.style.display = "block";
            errorSection.style.display = "none";

            // Save last searched city
            localStorage.setItem("lastCity", city);
        }
    } catch (error) {
        errorSection.style.display = "block";
        weatherSection.style.display = "none";
    } finally {
        loader.remove(); // Hide loading text
    }
}

// Search by button click
searchbtn.addEventListener("click", () => {
    const city = searchbox.value.trim();
    if (city) checkweather(city);
});

// Search by pressing Enter key
searchbox.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        const city = searchbox.value.trim();
        if (city) checkweather(city);
    }
});

// Load last searched city on page load
window.addEventListener("load", () => {
    const lastCity = localStorage.getItem("lastCity");
    if (lastCity) {
        searchbox.value = lastCity;
        checkweather(lastCity);
    }
});

// Theme toggle logic
const themeSwitch = document.getElementById("theme-switch");
const themeLabel = document.getElementById("theme-label");

// Load from localStorage on page load
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeSwitch.checked = true;
  themeLabel.textContent = "🌙 Dark Mode";
}

// On toggle click
themeSwitch.addEventListener("change", () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
    themeLabel.textContent = "🌙 Dark Mode";
  } else {
    localStorage.setItem("theme", "light");
    themeLabel.textContent = "🌞 Light Mode";
  }
});
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

// Function to update language
function updateLanguage(lang) {
  const t = translations[lang];
  document.querySelector(".container h1").textContent = t.title;
  document.querySelector(".search input").placeholder = t.placeholder;
  document.querySelector(".error h5").textContent = t.error;
  document.querySelectorAll(".details .col")[0].querySelector("p:last-child").textContent = t.humidity;
  document.querySelectorAll(".details .col")[1].querySelector("p:last-child").textContent = t.wind;

  // Update theme label too
  const currentTheme = document.body.classList.contains("dark") ? "dark" : "light";
  document.getElementById("theme-label").textContent = t[currentTheme];
}

// Store selected language
langSelect.addEventListener("change", (e) => {
  const lang = e.target.value;
  localStorage.setItem("lang", lang);
  updateLanguage(lang);
});

// Load saved language
window.addEventListener("load", () => {
  const savedLang = localStorage.getItem("lang") || "en";
  langSelect.value = savedLang;
  updateLanguage(savedLang);
});
