// Description: This file contains the code to display the map and the weather data on it.

const API_KEY = '664f855485a79428ecf25f52fc7f6709'
var capa = "TA2"
var opacity = 0.3
let lat, lon;
var units = "metric";
var unixTimestamp = Math.floor(new Date().getTime() / 1000);
var temp_max;
var temp_min;
var pressure;
var seaLevel;
var humidity;
var groundLevel;
var sunrise;
var sunset;
var icon;


require([
    "esri/config",
    "esri/layers/WebTileLayer",
    "esri/Map",
    "esri/views/MapView",
    "esri/Graphic",
    "esri/PopupTemplate",
    "esri/rest/locator"
    ], (esriConfig, WebTileLayer, Map, MapView, Graphic, PopupTemplate, locator) => {
        esriConfig.request.corsEnabledServers
        var tiledLayer;
        const locatorUrl = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer";
        
        var map = new Map({
        basemap: "dark-gray",
        wrapAround: false,
        worldCopyJump: true,
      });

      var view = new MapView({
        container: "viewDiv",
        map: map,
        wrapAround: false,
        zoom:2,
      });

      
    
    tiledLayer = new WebTileLayer({
        urlTemplate: `https://maps.openweathermap.org/maps/2.0/weather/${capa}/{level}/{col}/{row}?date=${unixTimestamp}&opacity=${opacity}&fill_bound=true&appid=${API_KEY}`,
        wrapAround: false,
        worldCopyJump: true,
    });
      map.add(tiledLayer);

      

      // Función para eliminar la capa del mapa
    function removeLayer() {
      if (tiledLayer) {
          map.remove(tiledLayer);
      }
  }


let map1 = {
  layers: [
    { id: 'CL', name: 'Cloudiness (%)' },
    { id: 'HRD0', name: 'Relative humidity (%)' },
    { id: 'SD0', name: 'Depth of snow (m)' },
    { id: 'WND', name: 'Speed wind and direction (m/s)' }

  ]
};

let select = document.getElementById('layerSelect');

map1.layers.forEach(layer => {
  let option = document.createElement('option');
  option.value = layer.id;
  option.text = layer.name;
  select.appendChild(option);
});


select.addEventListener('change', function() {
  capa= this.value;
  removeLayer()

  tiledLayer = new WebTileLayer({
    urlTemplate: `https://maps.openweathermap.org/maps/2.0/weather/${capa}/{level}/{col}/{row}?date=${unixTimestamp}&opacity=${opacity}&fill_bound=true&appid=${API_KEY}`,
    wrapAround: false,
    worldCopyJump: true,
  });

  map.add(tiledLayer);
  // Aquí puedes agregar el código para manejar cuando se selecciona una capa
  console.log('Capa seleccionada:', capa);
  console.log(unixTimestamp)
});


        view.popupEnabled = false;
        view.on("click", function(event){
        getWeatherData()
          // Get the coordinates of the click on the view
          lat = Math.round(event.mapPoint.latitude * 1000) / 1000;
          lon = Math.round(event.mapPoint.longitude * 1000) / 1000;

          view.openPopup({
            // Set the popup's title to the coordinates of the location
            title: "Weather Data",
            location: event.mapPoint,// Set the location of the popup to the clicked location
    
          });

          const params = {
            location: event.mapPoint
          };


          // Display the popup
          // Execute a reverse geocode using the clicked location
locator
  .locationToAddress(locatorUrl, params)
  .then((response) => {
    // If an address is successfully found, show it in the popup's content
        // If an address is successfully found, show it in the popup's content
    view.popup.content = `<table style="border: 1px solid black; max-width: 300px;">
                            <tr>
                              <td style="padding: 0 5px;">Dirección</td>
                              <td style="padding: 0 5px;">${response.address}</td>
                            </tr>
                          </table>`;

    setTimeout(function() {
      // Concatenate the new content with the existing content
      view.popup.content += `<table style="border: 1px solid black; max-width: 300px;">
                                <tr>
                                  <td colspan="2" style="text-align:center; padding: 0 5px;"><img src="https://openweathermap.org/img/wn/${icon}.png" alt="weather icon" class="w-icon"></td>
                                </tr>
                                <tr>
                                  <td style="padding: 0 5px;">Max</td>
                                  <td style="padding: 0 5px;">${temp_max}</td>
                                </tr>
                                <tr>
                                  <td style="padding: 0 5px;">Min</td>
                                  <td style="padding: 0 5px;">${temp_min}</td>
                                </tr>
                                <tr>
                                  <td style="padding: 0 5px;">Pressure</td>
                                  <td style="padding: 0 5px;">${pressure}</td>
                                </tr>
                                <tr>
                                  <td style="padding: 0 5px;">Sea Level</td>
                                  <td style="padding: 0 5px;">${seaLevel}</td>
                                </tr>
                                <tr>
                                  <td style="padding: 0 5px;">Humidity</td>
                                  <td style="padding: 0 5px;">${humidity}</td>
                                </tr>
                                <tr>
                                  <td style="padding: 0 5px;">Ground Level</td>
                                  <td style="padding: 0 5px;">${groundLevel}</td>
                                </tr>
                                <tr>
                                  <td style="padding: 0 5px;">Sunrise</td>
                                  <td style="padding: 0 5px;">${window.moment(sunrise * 1000).format('HH:mm a')}</td>
                                </tr>
                                <tr>
                                  <td style="padding: 0 5px;">Sunset</td>
                                  <td style="padding: 0 5px;">${window.moment(sunset * 1000).format('HH:mm a')}</td>
                                </tr>
                              </table>`;
    }, 3000);
            })
            .catch(() => {
              // If the promise fails and no result is found, show a generic message
              view.popup.content = "No address was found for this location";
            });
            
        });

        function getWeatherData(){
            navigator.geolocation.getCurrentPosition((success) =>{
              
        
                fetch(`https://pro.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=${units}&appid=${API_KEY}`).
                then(res => res.json()).then(dataActual => {
                    console.log(dataActual);
                    temp_max = dataActual.main.temp_max;
                    temp_min = dataActual.main.temp_min;
                    pressure = dataActual.main.pressure;
                    seaLevel = dataActual.main.sea_level;
                    humidity = dataActual.main.humidity;
                    groundLevel = dataActual.main.grnd_level
                    sunrise = dataActual.sys.sunrise;
                    sunset = dataActual.sys.sunset;
                    
                    icon = dataActual.weather[0].icon

                })
            })
            
        }
});



