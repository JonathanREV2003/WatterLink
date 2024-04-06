const timeElement = document.getElementById('time');
const dateElement = document.getElementById('date');
const currentWeatherItemsElement = document.getElementById('current-weather');
const timeZone = document.getElementById('time-zone');
const countryElement = document.getElementById('country');
const weatherForecastElement = document.getElementById('weather-forecast');
const currentTempElement = document.getElementById('current-temp');

var cityid;

const days =['Sunday', 'Monday', 'Tuesday','Wednesday','Friday','Thursday',
'Friday','Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 
'Sep', 'Oct', 'Nov', 'Dec'];

const API_KEY = '664f855485a79428ecf25f52fc7f6709'
//Posible Obtención del id de la cuidad: https://api.openweathermap.org/data/2.5/weather?q=London
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

getWeatherData()
function getWeatherData(){
    navigator.geolocation.getCurrentPosition((succes) =>{
        console.log(succes);

        let{latitude, longitude} =succes.coords;

        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).
        then(res => res.json()).then(dataActual => {

          console.log(dataActual)
          cityid = dataActual.id;
          console.log(cityid)
          showWeatherData(dataActual);
          getAirPollutionData(latitude, longitude); 
        })
    })
    
}

function showWeatherData(dataActual) {
  var humidity = dataActual.main.humidity;
  var pressure = dataActual.main.pressure;
  var wind_Speed = dataActual.wind.speed;
  currentWeatherItemsElement.innerHTML = `
    <div class="weather-item">
      <div>Humidity</div>
      <div>${humidity}</div>
    </div>
    <div class="weather-item">
      <div>Pressure</div>
      <div>${pressure}</div>
    </div>
    <div class="weather-item">
      <div>Wind Speed</div>
      <div>${wind_Speed}</div>
    </div>
  `;
}

function getAirPollutionData(latitude, longitude) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      
      console.log(data);
      
    })
    .catch(error => {
      console.error('Error al obtener los datos de contaminación del aire:', error);
    });
}

function getAirPollutionData(latitude, longitude) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const airPollutionDataElement = document.getElementById('air-pollution-data');
      airPollutionDataElement.innerHTML = `
        <p>Índice de calidad del aire: ${data.list[0].main.aqi}</p>
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



