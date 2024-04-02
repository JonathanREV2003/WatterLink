const timeElement = document.getElementById('time');
const dateElement = document.getElementById('date');
const currentWeatherItemsElement = document.getElementById('current-weather-items');
const timeZone = document.getElementById('time-zone');
const countryElement = document.getElementById('country');
const weatherForecastElement = document.getElementById('weather-forecast');
const currentTempElement = document.getElementById('current-temp');

const days =['Sunday', 'Monday', 'Tuesday','Wednesday','Friday','Thursday',
'Friday','Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 
'Sep', 'Oct', 'Nov', 'Dec'];

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


