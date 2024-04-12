const timeElement = document.getElementById('time');
const dateElement = document.getElementById('date');
const currentWeatherItemsElement = document.getElementById('current-weather');
const timeZone = document.getElementById('time-zone');
const countryElement = document.getElementById('country');
const weatherForecastElement = document.getElementById('weather-forecast');
const currentTempElement = document.getElementById('current-temp');

var cityid;
var iconid;

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 
'Sep', 'Oct', 'Nov', 'Dec'];

const API_KEY = '664f855485a79428ecf25f52fc7f6709'
//Posible Obtención del id de la cuidad: https://api.openweathermap.org/data/2.5/weather?q=London
// https://api.openweathermap.org/data/2.5/find?q=Chile&appid=664f855485a79428ecf25f52fc7f6709
// https://api.openweathermap.org/data/2.5/find?q=Sansare&appid=664f855485a79428ecf25f52fc7f6709
// https://api.openweathermap.org/geo/1.0/direct?q=Villa%20Nueva,GT&limit=1&appid=664f855485a79428ecf25f52fc7f6709
// https://api.openweathermap.org/data/2.5/weather?q=Toronto&appid=664f855485a79428ecf25f52fc7f6709
// https://api.openweathermap.org/data/2.5/weather?q=Jalapa,%20GT&appid=664f855485a79428ecf25f52fc7f6709
function formatMinutes(minutes) {
  return minutes < 10 ? `0${minutes}` : minutes;
}

setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  const hour12Format = hour >= 13 ? hour % 12 : hour;
  const minutes = time.getMinutes();
  const ampm = hour >= 12 ? 'PM' : 'AM';

  timeElement.innerHTML = `${hour12Format}:${formatMinutes(minutes)} <span id="am-pm">${ampm}</span>`;

  dateElement.innerHTML = days[day] + ', '+ date + ' ' + months[month]
}, 1000);

let latitude, longitude;

getWeatherData()
function getWeatherData(){
    navigator.geolocation.getCurrentPosition((success) =>{
        console.log(success);

        latitude = success.coords.latitude;
        longitude = success.coords.longitude;

        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).
        then(res => res.json()).then(dataActual => {

          console.log(dataActual)
          cityid = dataActual.id;
          iconid = dataActual.weather[0].icon
          console.log(cityid)
          console.log(iconid)
          showWeatherData(dataActual);
          getAirPollutionData(latitude, longitude); 

          getWeatherDataForecast();
        })
    })
    
}
function getWeatherDataForecast(){
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).
  then(res => res.json()).then(dataForecast => {

    console.log(dataForecast)
    showWeatherDataForecast(dataForecast);
  })
}

function showWeatherData(dataActual) {
  document.querySelector('.w-icon').src = `https://openweathermap.org/img/wn/${iconid}@2x.png`;
  var temparature = dataActual.main.feels_like;
  var temparatureMax = dataActual.main.temp_max;
  var temparatureMin = dataActual.main.temp_min;
  var wind_Speed = dataActual.wind.speed;
  var clouds = dataActual.weather[0].description;
  var sunrise = dataActual.sys.sunrise;
  var sunset = dataActual.sys.sunset;
  currentWeatherItemsElement.innerHTML = `    
    <div class="weather-item1">
    <img src="https://openweathermap.org/img/wn/${iconid}@2x.png" alt="weather icon" class="w-icon2">
    </div>
    <div class="weather-item">
      <div>Description</div>
      <div>&nbsp;&nbsp;${clouds}</div>
    </div>
    <div class="weather-item">
      <div>Feels Like</div>
      <div>${temparature}</div>
    </div>
    <div class="weather-item">
      <div>Max</div>
      <div>${temparatureMax}</div>
    </div>
    <div class="weather-item">
      <div>Min</div>
      <div>${temparatureMin}</div>
    </div>
    </div>
    <div class="weather-item">
      <div>Wind Speed</div>
      <div>${wind_Speed} m/s</div>
    </div>
    </div>
    <div class="weather-item">
      <div>Sunrise</div>
      <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
    </div>
    <div class="weather-item">
      <div>Sunset</div>
      <div>${window.moment(sunset * 1000).format('HH:mm a')}</div>
    </div>
  `;
}

function showWeatherDataForecast(dataForecast) {
  let otherDayForcast = ''
  dataForecast.list.forEach((list, idx) => {
  
    let time = list.dt_txt.split(' ')[1]; // Divide el string de fecha y hora y selecciona solo la parte de la hora
    let time1 = list.dt_txt.split(' ')[0];

    otherDayForcast += `
    <div class="weather-forecast" id="weather-forecast">
    <div class="weather-forecast-item">
        <div class="day">${window.moment.utc(list.dt * 1000).format('ddd')}</div>
        <div class="temp">${time1}</div> <!-- Muestra solo la hora -->
        <div class="temp">Time - ${time}</div> 
        <img src="https://openweathermap.org/img/wn/${list.weather[0].icon}.png" alt="weather icon" class="w-icon">
        <div class="temp">${list.weather[0].description}</div> 
        <div class="temp">Feels Like - ${list.main.feels_like}</div>
        <div class="temp">Max - ${list.main.temp_max}</div>
        <div class="temp">Min - ${list.main.temp_min}</div>
    </div>
</div>
    `
  })

  weatherForecastElement.innerHTML = otherDayForcast;
}


function getAirPollutionData(latitude, longitude) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const airPollutionDataElement = document.getElementById('air-pollution-data');
      const airQualityIndex = data.list[0].main.aqi;
      let airQualityDescription;

      switch (airQualityIndex) {
        case 1:
          airQualityDescription = 'Good';
          break;
        case 2:
          airQualityDescription = 'Fair';
          break;
        case 3:
          airQualityDescription = 'Moderate';
          break;
        case 4:
          airQualityDescription = 'Poor';
          break;
        case 5:
          airQualityDescription = 'Very Poor';
          break;
        default:
          airQualityDescription = 'Unknown';
      }

      airPollutionDataElement.innerHTML = `
        <p>Índice de calidad del aire: ${airQualityIndex} (${airQualityDescription})</p>
        <p>Componentes:</p>
        <ul>
          <li>CO: ${data.list[0].components.co} μg/m<sup>3</sup></li>
          <li>NO: ${data.list[0].components.no} μg/m<sup>3</sup></li>
          <li>NO<sub>2</sub>: ${data.list[0].components.no2} μg/m<sup>3</sup></li>
          <li>O<sub>3</sub>: ${data.list[0].components.o3} μg/m<sup>3</sup></li>
          <li>SO<sub>2</sub>: ${data.list[0].components.so2} μg/m<sup>3</sup></li>
          <li>PM<sub>2.5</sub>: ${data.list[0].components.pm2_5} μg/m<sup>3</sup></li>
          <li>PM<sub>10</sub>: ${data.list[0].components.pm10} μg/m<sup>3</sup></li>
          <li>NH<sub>3</sub>: ${data.list[0].components.nh3} μg/m<sup>3</sup></li>
        </ul>
      `;
    })
    .catch(error => {
      console.error('Error al obtener los datos de contaminación del aire:', error);
    });
}
const airPollutionPanel = document.querySelector('.air-pollution-panel');
const toggleButton = document.querySelector('.toggle-button');
const panelContent = document.querySelector('.panel-content');

toggleButton.addEventListener('click', () => {
  airPollutionPanel.classList.toggle('open');
});



