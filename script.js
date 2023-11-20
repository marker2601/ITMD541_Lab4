document.getElementById('current-location').addEventListener('click', getCurrentLocation);
document.getElementById('predefined-locations').addEventListener('change', handleLocationChange);
document.getElementById('location-search').addEventListener('change', handleLocationSearch);

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            fetchSunriseSunset(latitude, longitude);
        }, showError);
    } else {
        showError("Geolocation is not supported by this browser.");
    }
}

function handleLocationChange(event) {
    const selectedValue = event.target.value;
    if (selectedValue) {
        const [latitude, longitude] = selectedValue.split(',');
        fetchSunriseSunset(latitude, longitude);
    }
}


function handleLocationSearch(event) {
    const query = event.target.value;
    fetch(`https://geocode.maps.co/search?q=${query}`)
    .then(response => response.json())
    .then(data => {
        if (data.length > 0) {
            const { lat, lon } = data[0];
            fetchSunriseSunset(lat, lon);
        } else {
            showError("Location not found.");
        }
    }).catch(() => showError("Error fetching location data."));
}

function fetchSunriseSunset(latitude, longitude) {
    const url = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}`;
    fetch(url)
    .then(response => response.json())
    .then(data => updateUI(data.results))
    .catch(() => showError("Error fetching sunrise and sunset data."));
}

function updateUI(data) {
    const display = document.getElementById('data-display');
    display.innerHTML = `Sunrise: ${data.sunrise}<br>Sunset: ${data.sunset}<br>Day Length: ${data.day_length}`;
    // Add more data fields here
}

function showError(error) {
    const display = document.getElementById('data-display');
    display.innerText = error;
}
