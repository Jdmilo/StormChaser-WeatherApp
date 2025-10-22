
async function fetchWeather() {
    let searchInput = document.getElementById("search").value;
    const weatherDataSection = document.getElementById("weather-data");
    weatherDataSection.style.display = "block";
    const apiKey = "API Key"; // Replace with your OpenWeather API key

    // Handle empty input
    if (searchInput === "") {
        weatherDataSection.innerHTML = `
        <div>
            <h2>Empty Input!</h2>
            <p>Please try again with a valid <u>city name</u>.</p>
        </div>`;
        return;
    }

    // Function to get longitude and latitude
    async function getLonAndLat() {
        const countryCode = 1; // US
        const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(searchInput)},${countryCode}&limit=1&appid=${apiKey}`;

        const response = await fetch(geocodeURL);
        if (!response.ok) {
            console.log("Bad response! ", response.status);
            return;
        }

        const data = await response.json();
        if (data.length === 0) {
            weatherDataSection.innerHTML = `
            <div>
                <h2>Invalid Input: "${searchInput}"</h2>
                <p>Please try again with a valid <u>city name</u>.</p>
            </div>`;
            return;
        } else {
            return data[0]; // Return first result
        }
    }

    // Function to get weather data based on lon/lat
    async function getWeatherData(lon, lat) {
        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        const response = await fetch(weatherURL);
        if (!response.ok) {
            console.log("Bad response! ", response.status);
            return;
        }

        const data = await response.json();

        weatherDataSection.innerHTML = `
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}" width="100" />
            <div>
                <h2>${data.name}</h2>
                <p><strong>Temperature:</strong> ${Math.round(data.main.temp)}°C</p>
                <p><strong>Description:</strong> ${data.weather[0].description}</p>
            </div>
        `;
    }

    // Clear input box
    document.getElementById("search").value = "";

    // Fetch coordinates and then weather data
    const geocodeData = await getLonAndLat();
    if (geocodeData) {
        await getWeatherData(geocodeData.lon, geocodeData.lat);
    }
}
