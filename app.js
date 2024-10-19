const apiKey = '1361c7e5347c00565c6ef2844677833f';
const weatherInfo = document.getElementById('weatherInfo');
const error = document.getElementById('error');
const loading = document.getElementById('loading');
const cityInput = document.getElementById('cityInput');

// Get weather for current location on page load
window.addEventListener('load', () => {
    getCurrentLocation();
});

// Allow search with Enter key
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getWeather();
    }
});

// Get current location
function getCurrentLocation() {
    if (navigator.geolocation) {
        loading.style.display = 'block';
        navigator.geolocation.getCurrentPosition(position => {
            getWeatherByCoords(position.coords.latitude, position.coords.longitude);
        }, () => {
            showError("Unable to get your location");
            loading.style.display = 'none';
        });
    } else {
        showError("Geolocation is not supported by your browser");
    }
}

// Get weather by coordinates
async function getWeatherByCoords(lat, lon) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );
        if (!response.ok) throw new Error('Weather data not available');
        const data = await response.json();
        displayWeather(data);
    } catch (err) {
        showError(err.message);
    }
}

// Get weather by city name
async function getWeather() {
    const city = cityInput.value.trim();
    if (!city) return;

    loading.style.display = 'block';
    error.style.display = 'none';
    weatherInfo.innerHTML = '';

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        if (!response.ok) throw new Error('City not found');
        const data = await response.json();
        displayWeather(data);
    } catch (err) {
        showError(err.message);
    } finally {
        loading.style.display = 'none';
    }
}

// Display weather data
function displayWeather(data) {
    const temp = Math.round(data.main.temp);
    const weatherBox = document.createElement('div');
    weatherBox.className = 'weather-box';
    
    weatherBox.innerHTML = `
        <div class="location">
            <i class="fas fa-map-marker-alt"></i>
            ${data.name}, ${data.sys.country}
        </div>
        <div class="main-info">
            <div class="temperature">${temp}°C</div>
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather icon">
            <div class="description">${data.weather[0].description}</div>
        </div>
        <div class="details">
            <div class="detail-item">
                <i class="fas fa-temperature-high"></i>
                <div>Feels like</div>
                <div>${Math.round(data.main.feels_like)}°C</div>
            </div>
            <div class="detail-item">
                <i class="fas fa-tint"></i>
                <div>Humidity</div>
                <div>${data.main.humidity}%</div>
            </div>
            <div class="detail-item">
                <i class="fas fa-wind"></i>
                <div>Wind Speed</div>
                <div>${Math.round(data.wind.speed * 3.6)} km/h</div>
            </div>
            <div class="detail-item">
                <i class="fas fa-compass"></i>
                <div>Pressure</div>
                <div>${data.main.pressure} hPa</div>
            </div>
        </div>
    `;

    weatherInfo.innerHTML = '';
    weatherInfo.appendChild(weatherBox);
    loading.style.display = 'none';
    error.style.display = 'none';
}

// Show error message
function showError(message) {
    error.textContent = message;
    error.style.display = 'block';
}