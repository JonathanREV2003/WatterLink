//https://pro.openweathermap.org/data/2.5/weather?q=Guastatoya,ElProgeso,GT&appid=664f855485a79428ecf25f52fc7f6709
let selectedCountry, selectedState, selectedCity;
let city, state, country;
let latitude, longitude;
let cityid;

var config = {
    cUrl: 'https://api.countrystatecity.in/v1/countries',
    ckey: 'NHhvOEcyWk50N2Vna3VFTE00bFp3MjFKR0ZEOUhkZlg4RTk1MlJlaA=='
}


var countrySelect = document.querySelector('.country'),
    stateSelect = document.querySelector('.state'),
    citySelect = document.querySelector('.city')


function loadCountries() {

    let apiEndPoint = config.cUrl

    fetch(apiEndPoint, {headers: {"X-CSCAPI-KEY": config.ckey}})
    .then(Response => Response.json())
    .then(data => {
        // console.log(data);

        data.forEach(country => {
            const option = document.createElement('option')
            option.value = country.iso2
            option.textContent = country.name 
            countrySelect.appendChild(option)
        })
    })
    .catch(error => console.error('Error loading countries:', error))

    stateSelect.disabled = true
    citySelect.disabled = true
    stateSelect.style.pointerEvents = 'none'
    citySelect.style.pointerEvents = 'none'

    countrySelect.addEventListener('change', function() {
        selectedCountry = this.options[this.selectedIndex].textContent;
        console.log('Selected Country:', selectedCountry);
      });
}


function loadStates() {
    stateSelect.disabled = false
    citySelect.disabled = true
    stateSelect.style.pointerEvents = 'auto'
    citySelect.style.pointerEvents = 'none'

    const selectedCountryCode = countrySelect.value
    // console.log(selectedCountryCode);
    stateSelect.innerHTML = '<option value="">Select State</option>' // for clearing the existing states
    citySelect.innerHTML = '<option value="">Select City</option>' // Clear existing city options

    fetch(`${config.cUrl}/${selectedCountryCode}/states`, {headers: {"X-CSCAPI-KEY": config.ckey}})
    .then(response => response.json())
    .then(data => {
        // console.log(data);

        data.forEach(state => {
            const option = document.createElement('option')
            option.value = state.iso2
            option.textContent = state.name 
            stateSelect.appendChild(option)
        })
    })
    .catch(error => console.error('Error loading countries:', error))

    stateSelect.addEventListener('change', function() {
        selectedState = this.options[this.selectedIndex].textContent;
        console.log('Selected State:', selectedState);
      });
}


function loadCities() {
    citySelect.disabled = false
    citySelect.style.pointerEvents = 'auto'

    const selectedCountryCode = countrySelect.value
    const selectedStateCode = stateSelect.value
    // console.log(selectedCountryCode, selectedStateCode);

    citySelect.innerHTML = '<option value="">Select City</option>' // Clear existing city options

    fetch(`${config.cUrl}/${selectedCountryCode}/states/${selectedStateCode}/cities`, {headers: {"X-CSCAPI-KEY": config.ckey}})
    .then(response => response.json())
    .then(data => {

        data.forEach(city => {
            const option = document.createElement('option')
            option.value = city.iso2
            option.textContent = city.name 
            citySelect.appendChild(option)              
        })
        citySelect.addEventListener('change', function() {
            selectedCity = this.options[this.selectedIndex].textContent;
            console.log('Selected City:', selectedCity);
            });  
    })

}

function getCityID(){
    let search = selectedCity + ',' + selectedState + ',' + selectedCountry;
    console.log(search)
    fetch(`https://pro.openweathermap.org/data/2.5/weather?q=${search}&appid=664f855485a79428ecf25f52fc7f6709`).
        then(res => res.json()).then(data => {
          console.log(data)
            latitude =  data.coord.lat;
            longitude = data.coord.lon;

          fetch(`http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}8&&appid=664f855485a79428ecf25f52fc7f6709`).
          then(res => res.json()).then(data1 => {
            console.log(data1);
            city = data1[0].name
            state = data1[0].state
            country = data1[0].country
            console.log(data1[0].name)
            console.log(data1[0].state)
            console.log(data1[0].country)
  
            let search1 = city + ',' + state + ',' + country;
            fetch(`https://openweathermap.org/data/2.5/find?q=${search1}&type=like&sort=population&cnt=30&appid=439d4b804bc8187953eb36d2a8c26a02`).
            then(res => res.json()).then(data => {
              console.log(data)
              cityid = data.list[0].id
              console.log(cityid)

              setTimeout(loadWeatherWidget, 2000);
            })
            document.getElementById('1').selectedIndex = 0;
            document.getElementById('2').selectedIndex = 0;
            document.getElementById('3').selectedIndex = 0;
            
          })
        })   
}

function loadWeatherWidget() {
    removeWeatherWidget();
    window.myWidgetParam ? window.myWidgetParam : window.myWidgetParam = [];
    window.myWidgetParam.push({
        id: 1,
        cityid: cityid,
        appid: '664f855485a79428ecf25f52fc7f6709',
        units: 'metric',
        containerid: 'openweathermap-widget-1',
    });

    var script = document.createElement('script');
    script.async = true;
    script.charset = "utf-8";
    script.src = "//openweathermap.org/themes/openweathermap/assets/vendor/owm/js/weather-widget-generator.js";
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(script, s);
}

function removeWeatherWidget() {
    const widgetContainer = document.getElementById('openweathermap-widget-1');
    if (widgetContainer) {
      widgetContainer.innerHTML = '';
    }
  }

window.onload = loadCountries