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
