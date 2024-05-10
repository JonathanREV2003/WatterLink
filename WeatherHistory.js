// API URL
const API_KEY = '664f855485a79428ecf25f52fc7f6709'
let latitude, longitude;


//https://history.openweathermap.org/data/2.5/history/city?lat={lat}&lon={lon}&type=hour&start={start}&end={end}&appid={API key}
//COMBERTIR LA VARIABLE TIEMPO A UNIT

fetchWeatherData();
// Función para obtener los datos de la API
function fetchWeatherData() {
    navigator.geolocation.getCurrentPosition((success) =>{
        console.log(success);
    
        latitude = success.coords.latitude;
        longitude = success.coords.longitude;
    
        fetch(`https://history.openweathermap.org/data/2.5/history/city?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
          displayWeatherData(data);
        })
        .catch(error => {
          console.error('Error:', error);
        });
        })
}

// Función para mostrar los datos del clima en la página
function displayWeatherData(data) {
  const weatherDataContainer = document.getElementById('weather-data');
  weatherDataContainer.innerHTML = '';

  if (data.cod === '200') {
    const list = data.list;
    list.forEach(item => {
      const weatherItem = document.createElement('div');
      weatherItem.innerHTML = `
        <p>Fecha: ${item.dt_txt}</p>
        <p>Temperatura: ${item.main.temp}°C</p>
        <p>Descripción: ${item.weather[0].description}</p>
        <hr>
      `;
      weatherDataContainer.appendChild(weatherItem);
    });
  } else {
    const errorMessage = document.createElement('p');
    errorMessage.textContent = 'Error al obtener los datos del clima.';
    weatherDataContainer.appendChild(errorMessage);
  }
}

// Llamar a la función para obtener los datos del clima
