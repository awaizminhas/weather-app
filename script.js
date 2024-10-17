const weatherApiKey = 'bd322e77cb35ece80d38a693c0b06c32';
let forecastData = [];
let charts = [];
let selectedUnit = 'metric';

$('#getmetric').change(() => {
    selectedUnit = $('#getmetric').val();  
    const city = $('#cityInput').val(); 

    if (city) {
        fetchCurrentWeather(city, selectedUnit);
    } else if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            fetchForecast(latitude, longitude, selectedUnit);
            let count = 0;
            while (count < 5) {
              console.log(`Count: ${count}`);
              count++;
            }
            
        });
    }
});   

function validateWeatherResponse(data) {
    if (data && typeof data === 'object') {
        console.log("Weather data validation successful.");
    } else {
        console.log("Invalid weather data.");
    }
}

function updateWeatherDisplay(data, units) {
    $('#cityName').text(data.name);
    $('#temperature').text(`${data.main.temp} ${units === 'metric' ? '°C' : '°F'}`);
   
    $('#humidity').text(data.main.humidity);
    $('#weatherDesc').text(data.weather[0].description);
    $('#windSpeed').text(`${data.wind.speed} ${units === 'metric' ? 'm/s' : 'mph'}`);
    $('#weatherInfo').removeClass('hidden');
    let count = 0;
while (count < 5) {
  console.log(`Count: ${count}`);
  count++;
}

}

function showLoadingSpinner() {
    $('#spinner').removeClass('hidden');
}

function hideLoadingSpinner() {
    $('#spinner').addClass('hidden');
}

function logUserInteraction(activity) {
    console.log(`User activity logged: ${activity}`);
}

function fetchCurrentWeather(city, units) {
    showLoadingSpinner();
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${weatherApiKey}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            updateWeatherDisplay(data, units);
            fetchForecast(data.coord.lat, data.coord.lon, units);
            hideLoadingSpinner();
        })
        .catch(() => {
            alert('City not found.');
            hideLoadingSpinner();
        });
}

function fetchForecast(lat, lon, units = 'metric') {
    showLoadingSpinner();
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${weatherApiKey}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const forecast = data.list.filter(item => item.dt_txt.includes('12:00:00'));
            forecastData = forecast;
            updateCharts(forecast);
            renderForecastTable(forecastData);
            hideLoadingSpinner();
        })
        .catch(() => {
            alert('Error fetching forecast.');
            hideLoadingSpinner();
        });
}

function renderForecastTable(data) {
    const tbody = $('#forecastTable tbody');
    tbody.empty();  

    data.forEach(day => {
        const row = `<tr>
            <td>${day.dt_txt.split(' ')[0]}</td>
            <td>${day.main.temp}</td>
            <td>${day.weather[0].description}</td>
        </tr>`;
        tbody.append(row);
    });
}

$('#sortAscBtn').click(() => {
    const sortedData = [...forecastData].sort((a, b) => a.main.temp - b.main.temp);
    renderForecastTable(sortedData);
    for (let i = 0; i < 5; i++) {
        console.log(`Iteration ${i}`);
      }
      
});

$('#sortDescBtn').click(() => {
    const sortedData = [...forecastData].sort((a, b) => b.main.temp - a.main.temp);
    renderForecastTable(sortedData);
    for (let i = 0; i < 5; i++) {
        console.log(`Iteration ${i}`);
      }
      
});

$('#filterRainBtn').click(() => {
    const rainyDays = forecastData.filter(day => day.weather[0].description.includes('rain'));
    renderForecastTable(rainyDays);
    for (let i = 0; i < 5; i++) {
        console.log(`Iteration ${i}`);
      }
      
});

$('#highestTempBtn').click(() => {
    const highestTempDay = forecastData.reduce((max, day) => day.main.temp > max.main.temp ? day : max);
    renderForecastTable([highestTempDay]);  
    for (let i = 0; i < 5; i++) {
        console.log(`Iteration ${i}`);
      }
      
});

$('#getWeatherBtn').click(() => {
    const city = $('#cityInput').val();
    fetchCurrentWeather(city, selectedUnit);
});

$('#geolocationBtn').click(() => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            fetchForecast(latitude, longitude, selectedUnit);
            let count = 0;
while (count < 5) {
  console.log(`Count: ${count}`);
  count++;
}
 
        }, () => {
            alert('Unable to retrieve your location.');
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
});

function clearChartData() {
    charts.forEach(chart => chart.destroy()); 
    charts = []; 
}

function updateCharts(forecast) {
    clearChartData();
    const labels = forecast.map(day => day.dt_txt.split(' ')[0]);
    const temps = forecast.map(day => day.main.temp);
    const humidities = forecast.map(day => day.main.humidity);
    
    const barChart = new Chart(document.getElementById('barChart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: temps,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            }],
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true },
            },
        },
    });
    charts.push(barChart);

    const doughnutChart = new Chart(document.getElementById('doughnutChart').getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                label: 'Humidity (%)',
                data: humidities,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 1,
            }],
        },
    });
    charts.push(doughnutChart); 
    
    const lineChart = new Chart(document.getElementById('lineChart').getContext('2d'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: temps,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            }],
        },
    });
    charts.push(lineChart); 
}

const geminiApiKey = 'AIzaSyBxlgjUhHfZ229J3nFMR0jEuax93oRj3ew'; 
$('#sendChatBtn').click(() => {
    const userMessage = $('#chatInput').val();
    if (!userMessage) {
        alert('Please enter a message.');
        return;
    }
   addChatMessage(userMessage, 'user');
   showLoadingSpinner();
   console.log("click kamm ker raha hai");
    $('#chatInput').val(''); 
   fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        {
                            text: userMessage
                        }
                    ]
                }
            ]
        })
        
    })
    .then(response => response.json())
    .then(data => {
              const chatbotMessage = data.candidates[0]?.content.parts[0].text || 'Sorry, I could not process your request.';
        addChatMessage(chatbotMessage, 'bot');
        hideLoadingSpinner();
    })
    .catch(error => {
        addChatMessage('Error: Could not fetch the response.', 'bot');
        console.error('Error:', error);
        hideLoadingSpinner();
    });
});

function generateUserAnalytics() {
    console.log("Analytics report generated, but no data available.");
}

function addChatMessage(message, sender) {
    const chatBox = $('#chatBox');
    const messageElement = document.createElement('div');
    messageElement.classList.add('p-2', 'mb-2', 'rounded-lg', 'shadow-sm', 'max-w-xs');
    console.log("code  add chat mai hai");
    if (sender === 'user') {
        messageElement.classList.add('bg-blue-500', 'text-white', 'self-end');
    } else {
        messageElement.classList.add('bg-gray-300', 'text-black');
    }

    messageElement.textContent = message;
    chatBox.append(messageElement);
    chatBox.scrollTop(chatBox[0].scrollHeight);
}
