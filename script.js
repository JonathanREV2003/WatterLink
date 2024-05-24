const timeElement = document.getElementById('time');
const dateElement = document.getElementById('date');
const currentWeatherItemsElement = document.getElementById('current-weather');
const timeZone = document.getElementById('time-zone');
const countryElement = document.getElementById('country');
const weatherForecastElement = document.getElementById('weather-forecast');
const currentTempElement = document.getElementById('current-temp');

const outdoorActivitiesPanel = document.querySelector('.outdoor-activities-panel');
const outdoorActivitiesContent = outdoorActivitiesPanel.querySelector('.panel-content');
const outdoorActivitiesToggleButton = document.querySelector('.outdoor-activities-panel .toggle-button');

outdoorActivitiesToggleButton.addEventListener('click', () => {
    outdoorActivitiesPanel.classList.toggle('open');
});


var cityid;
var iconid;
let tempUnit = 'celsius';
let currentLanguage = 'en';

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

        fetch(`https://pro.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).
        then(res => res.json()).then(dataActual => {

          console.log(dataActual)
          cityid = dataActual.id;
          iconid = dataActual.weather[0].icon
          console.log(cityid)
          console.log(iconid)
          showWeatherData(dataActual, tempUnit);
          getAirPollutionData(latitude, longitude); 

          getWeatherDataForecast();
        })
    })
    
}
function getWeatherDataForecast(){
  fetch(`https://pro.openweathermap.org/data/2.5/forecast/daily?lat=${latitude}&lon=${longitude}&cnt=8&mode=json,minutely&units=metric&appid=${API_KEY}`).
  then(res => res.json()).then(dataForecast => {

    console.log(dataForecast)
    showWeatherDataForecast(dataForecast);
  })
}

function showWeatherData(dataActual, tempUnit) {
  timeZone.innerHTML = dataActual.sys.country + "/" + dataActual.name;
  countryElement.innerHTML = latitude + 'N&nbsp&nbsp' + longitude + 'E';
  document.querySelector('.w-icon').src = `https://openweathermap.org/img/wn/${iconid}@2x.png`;
  var temparature = convertTemperature(dataActual.main.feels_like, tempUnit).toFixed(2);
  var temparatureMax = convertTemperature(dataActual.main.temp_max, tempUnit).toFixed(2);
  var temparatureMin = convertTemperature(dataActual.main.temp_min, tempUnit).toFixed(2);
  var wind_Speed = dataActual.wind.speed;
  var clouds = dataActual.weather[0].description;
  var sunrise = dataActual.sys.sunrise;
  var sunset = dataActual.sys.sunset;
  var humidity = dataActual.main.humidity;

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
    <div>${temparature}°</div>
  </div>
  <div class="weather-item">
    <div>Max</div>
    <div>${temparatureMax}°</div>
  </div>
  <div class="weather-item">
    <div>Min</div>
    <div>${temparatureMin}°</div>
  </div>
    </div>
    <div class="weather-item">
      <div>Wind Speed</div>
      <div>${wind_Speed} m/s</div>
    </div>
    </div>
    <div class="weather-item">
      <div>Humidity</div>
      <div>${humidity}%</div>
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
  let otherDayForcast = '';
  dataForecast.list.slice(1).forEach((list) => {
    const dayTemp = convertTemperature(list.temp.day, tempUnit);
    const nightTemp = convertTemperature(list.temp.night, tempUnit);

    otherDayForcast += `
    <div class="weather-forecast" id="weather-forecast">
    <div class="weather-forecast-item">
        <div class="day">${window.moment(list.dt * 1000).format('dddd')}</div>
        <div class="day">${window.moment(list.dt * 1000).format('YYYY-MM-DD')}</div>
        <img src="https://openweathermap.org/img/wn/${list.weather[0].icon}.png" alt="weather icon" class="w-icon">
        <div class="temp">Day ${dayTemp.toFixed(2)}°</div>
        <div class="temp">Night ${nightTemp.toFixed(2)}°</div>
    </div>
</div>
    `;
  });

  weatherForecastElement.innerHTML = otherDayForcast;
}


function getAirPollutionData(latitude, longitude) {
  const apiUrl = `https://pro.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const airPollutionDataElement = document.getElementById('air-pollution-data');
      const airQualityIndex = data.list[0].main.aqi;
      let airQualityDescription;

      switch (airQualityIndex) {
        case 1:
          airQualityDescription = 'Buena';
          break;
        case 2:
          airQualityDescription = 'Justa';
          break;
        case 3:
          airQualityDescription = 'Moderada';
          break;
        case 4:
          airQualityDescription = 'Pobre';
          break;
        case 5:
          airQualityDescription = 'Muy pobre';
          break;
        default:
          airQualityDescription = 'Desconocida';
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
const settingsIcon = document.querySelector('.settings-icon');
const settingsMenu = document.createElement('div');
settingsMenu.classList.add('settings-menu');
document.body.appendChild(settingsMenu);

settingsIcon.addEventListener('click', () => {
    settingsMenu.classList.toggle('show');
});

const tempUnitSelect = document.createElement('select');
tempUnitSelect.innerHTML = `
    <option value="celsius">Celsius</option>
    <option value="fahrenheit">Fahrenheit</option>
`;
settingsMenu.appendChild(tempUnitSelect);

const languageSelect = document.createElement('select');
languageSelect.innerHTML = `
  <option value="en">English</option>
  <option value="es">Español</option>
`;
settingsMenu.appendChild(languageSelect);

tempUnitSelect.addEventListener('change', () => {
  tempUnit = tempUnitSelect.value;
  getWeatherDataForecast();
});

/*tempUnitSelect.addEventListener('change', () => {
  const tempUnit = tempUnitSelect.value;
});*/

languageSelect.addEventListener('change', () => {
  currentLanguage = languageSelect.value;
  updateLanguage();
});

const pageSizeSelect = document.createElement('select');
pageSizeSelect.innerHTML = `
    <option value="normal">Tamaño normal</option>
    <option value="large">Tamaño grande</option>
    <option value="small">Tamaño pequeño</option>
`;
settingsMenu.appendChild(pageSizeSelect);
pageSizeSelect.addEventListener('change', () => {
  const pageSize = pageSizeSelect.value;
  const elements = document.querySelectorAll('.changeable-element'); 

  elements.forEach((element) => {
    element.classList.remove('size-normal', 'size-large', 'size-small'); 
    element.classList.add(`size-${pageSize}`); 
  });
});

function convertTemperature(temp, unit) {
  if (unit === 'celsius') {
    return temp;
  } else if (unit === 'fahrenheit') {
    return (temp * 9/5) + 32;
  }
}

function updateLanguage() {
  
  document.querySelector('.future-forecast h2').textContent = translations[currentLanguage].weatherForecast;
  document.querySelector('.day').textContent = translations[currentLanguage].saturday;
  document.querySelector('.day sunday').textContent = translations[currentLanguage].sunday;
  
}

const translations = {
  en: {
    weatherForecast: 'Weather Forecast',
    day: 'Day',
    night: 'Night',
    saturday: 'Saturday',
    sunday: 'Sunday',
    
  },
  es: {
    weatherForecast: 'Pronóstico del Tiempo',
    day: 'Día',
    night: 'Noche',
    saturday: 'Sabado',
    sunday: 'Domingo',
    
  }
};