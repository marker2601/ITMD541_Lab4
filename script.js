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
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];

    fetchDataForDate(latitude, longitude, today, 'today');
    fetchDataForDate(latitude, longitude, tomorrow, 'tomorrow');
}

function fetchDataForDate(latitude, longitude, date, prefix) {
    const url = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&date=${date}`;
    fetch(url)
    .then(response => response.json())
    .then(data => {
        if (data.status === 'OK') {
            updateUI(data.results, prefix);
        } else {
            showError("Error fetching data.");
        }
    })
    .catch(() => showError("Error fetching data."));
}

function updateUI(data, prefix) {
    document.getElementById(`sunrise-${prefix}`).innerText = data.sunrise;
    document.getElementById(`sunset-${prefix}`).innerText = data.sunset;
    document.getElementById(`dawn-${prefix}`).innerText = data.dawn;
    document.getElementById(`dusk-${prefix}`).innerText = data.dusk;
    document.getElementById(`daylength-${prefix}`).innerText = data.day_length;
    document.getElementById(`solarnoon-${prefix}`).innerText = data.solar_noon;
    if (prefix === 'today') {
        document.getElementById('timezone').innerText = data.timezone;
    }

}

function showError(error) {
    const display = document.getElementById('data-display');
    display.innerText = error;
}
