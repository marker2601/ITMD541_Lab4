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
    // Clear previous data
    document.getElementById('data-display').innerHTML = '';

    for (let i = 0; i < 7; i++) {
        // Using setTimeout to respect the API rate limit
        setTimeout(() => {
            let date = new Date();
            date.setDate(date.getDate() + i);
            fetchDataForDate(latitude, longitude, date.toISOString().split('T')[0], i);
        }, i * 500); // 500ms delay between each request
    }
}

function fetchDataForDate(latitude, longitude, date, dayIndex) {
    const url = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&date=${date}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'OK') {
                updateUI(data.results, dayIndex, date);
            } else {
                showError("Error fetching data.");
            }
        })
        .catch(() => showError("Error fetching data."));
}

function updateUI(data, dayIndex, date) {
    let display = document.getElementById('data-display');
    let dayData = `<div class="day-data">
        <h3>Day ${dayIndex + 1} (${date}):</h3>
        <p><img src="logos/sunrise-today.png" alt="Sunrise Today Logo"><strong>Sunrise:</strong>  ${data.sunrise}</p>
        <p><img src="logos/sunset-today.png" alt="Sunset Today Logo"><strong>Sunset:</strong>  ${data.sunset}</p>
        <p><img src="logos/dawn-today.png" alt="Dawn Today Logo"><strong>Dawn:</strong>  ${data.dawn}</p>
        <p><img src="logos/dusk-today.png" alt="Dusk Today Logo"><strong>Dusk:</strong>  ${data.dusk}</p>
        <p><img src="logos/daylength-today.png" alt="Day Length Today Logo"> <strong>Day Length:</strong> ${data.day_length}</p>
        <p><img src="logos/solarnoon-today.png" alt="Solar Noon Today Logo"><strong>Solar Noon:</strong>  ${data.solar_noon}</p>
    </div>`;
    display.innerHTML += dayData;
}



function showError(error) {
    const display = document.getElementById('data-display');
    display.innerText = error;
}

function updateTime() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    document.getElementById('current-time').innerText = now.toLocaleDateString('en-US', options) + ' | ' + now.toLocaleTimeString('en-US');
}
setInterval(updateTime, 1000);
