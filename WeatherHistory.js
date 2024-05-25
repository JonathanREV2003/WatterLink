// API URL
const API_KEY = '664f855485a79428ecf25f52fc7f6709'
let latitude, longitude;


//https://history.openweathermap.org/data/2.5/history/city?lat={lat}&lon={lon}&type=hour&start={start}&end={end}&appid={API key}
//COMBERTIR LA VARIABLE TIEMPO A UNIT

// Llamar a la función para obtener los datos del clima
fetchWeatherData();
// Función para obtener los datos de la API
function fetchWeatherData(date) {
  navigator.geolocation.getCurrentPosition((success) => {
    console.log(success);

    latitude = success.coords.latitude;
    longitude = success.coords.longitude;

    const startDate = date.toISOString().slice(0, 10);
    const endDate = new Date(date.getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    fetch(`https://history.openweathermap.org/data/2.5/history/city?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`)
      .then(response => response.json())
      .then(data => {
        displayWeatherData(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  });
}

// Función para mostrar los datos del clima en la página
function displayWeatherData(data) {
  const weatherDataContainer = document.getElementById('weather-data');
  weatherDataContainer.innerHTML = '';

  if (data.cod === '200') {
    const list = data.list;
    const selectedDate = new Date(bdayInput.value);

    list.forEach(item => {
      const itemDate = new Date(item.dt * 1000);

      if (itemDate.toDateString() === selectedDate.toDateString()) {
        const weatherItem = document.createElement('div');
        weatherItem.classList.add('weather-item');
        weatherItem.innerHTML = `
          <p>Fecha: ${itemDate.toLocaleString()}</p>
          <p>Temperatura: ${item.main.temp}°C</p>
          <p>Descripción: ${item.weather[0].description}</p>
          <p>Humedad: ${item.main.humidity}%</p>
          <p>Presión: ${item.main.pressure} hPa</p>
          <p>Temperatura Mínima: ${item.main.temp_min}°C</p>
          <p>Temperatura Máxima: ${item.main.temp_max}°C</p>
          <hr>
        `;
        weatherDataContainer.appendChild(weatherItem);
      }
    });
  } else {
    const errorMessage = document.createElement('p');
    errorMessage.textContent = 'Error al obtener los datos del clima.';
    weatherDataContainer.appendChild(errorMessage);
  }
}

// Calendario<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
// definimos variables
var nativePicker = document.querySelector(".nativeDatePicker");
var fallbackPicker = document.querySelector(".fallbackDatePicker");
var fallbackLabel = document.querySelector(".fallbackLabel");

var yearSelect = document.querySelector("#year");
var monthSelect = document.querySelector("#month");
var daySelect = document.querySelector("#day");

// Ocultamos el select inicialmente
fallbackPicker.style.display = "none";
fallbackLabel.style.display = "none";

// testeamos si la nueva entrada es de tipo fecha o texto
var test = document.createElement("input");

try {
  test.type = "date";
} catch (e) {
  console.log(e.description);
}

// si lo es, se ejecuta el código dentro del bloque if() {}
if (test.type === "text") {
  // oculta el nativo y muestra el fallback
  nativePicker.style.display = "none";
  fallbackPicker.style.display = "block";
  fallbackLabel.style.display = "block";

  // introduce los datos de los días y los años dinámicamente
  // (Los meses son siempre los mismos)
  populateDays(monthSelect.value);
  populateYears();
}

function populateDays(month) {
  // borra la actual muestra de elementos <option> que quedan fuera
  // del <select> para el día, listo para que los siguentes días sean inyectados
  while (daySelect.firstChild) {
    daySelect.removeChild(daySelect.firstChild);
  }

  // Crea una variable que guarda el nuevo número de días a ser inyectados.
  var dayNum;

  // 31 o 30 días
  if (
    (month === "January") |
    (month === "March") |
    (month === "May") |
    (month === "July") |
    (month === "August") |
    (month === "October") |
    (month === "December")
  ) {
    dayNum = 31;
  } else if (
    (month === "April") |
    (month === "June") |
    (month === "September") |
    (month === "November")
  ) {
    dayNum = 30;
  } else {
    // Si el mes es febrero, calcula si el año es bisiesto o no.
    var year = yearSelect.value;
    var isLeap = new Date(year, 1, 29).getMonth() == 1;
    isLeap ? (dayNum = 29) : (dayNum = 28);
  }

  // Inyecta el número adecuado de nuevos elementos <option> dentro del <select> para los días
  for (i = 1; i <= dayNum; i++) {
    var option = document.createElement("option");
    option.textContent = i;
    daySelect.appendChild(option);
  }

  // Si el día previo ya ha sido establecido, establece el valor de daySelect
  // a ese día, para evitar saltar a uno cuando el año cambie
  if (previousDay) {
    daySelect.value = previousDay;

    // Si el día anterior fue establecido en un número alto, digamos 31, y luego
    // elegimos un mes con menos días (por ejemplo febrero),
    // esta parte del código se asegura de que el día con el valor más grande sea seleccionado
    // en vez de  mostrat un daySelect en blanco.
    if (daySelect.value === "") {
      daySelect.value = previousDay - 1;
    }

    if (daySelect.value === "") {
      daySelect.value = previousDay - 2;
    }

    if (daySelect.value === "") {
      daySelect.value = previousDay - 3;
    }
  }
}

function populateYears() {
  // tomar este año como un número
  var date = new Date();
  var year = date.getFullYear();

  // Hacer que este año y los cien años anteriores estén en el <select>
  for (var i = 0; i <= 100; i++) {
    var option = document.createElement("option");
    option.textContent = year - i;
    yearSelect.appendChild(option);
  }
}

// cuando los valores del los elementos <select> del año o el mes son cambiados, vuelve a correr populateDays()
// en el caso de que el cambio afecte al número de días disponible
yearSelect.onchange = function () {
  populateDays(monthSelect.value);
};

monthSelect.onchange = function () {
  populateDays(monthSelect.value);
};

//preserva el día seleccionado
var previousDay;

// actualiza que día ha sido establecido anteriormente
// fíjate en el final de populateDays() para entender el uso
daySelect.onchange = function () {
  previousDay = daySelect.value;
};

const bdayInput = document.getElementById('bday');
bdayInput.addEventListener('change', handleDateChange);

function handleDateChange() {
  const selectedDate = new Date(bdayInput.value);
  fetchWeatherData(selectedDate);
}

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