// Description: This file contains the code to display the map and the weather data on it.

const API_KEY = '664f855485a79428ecf25f52fc7f6709'
var capa = "TA2"
var opacity = 0.3
let lat, lon;
var units;
var unixTimestamp = Math.floor(new Date().getTime() / 1000);
var temp_max;
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
        urlTemplate: `http://maps.openweathermap.org/maps/2.0/weather/${capa}/{level}/{col}/{row}?date=${unixTimestamp}&opacity=${opacity}&fill_bound=true&appid=${API_KEY}`,
        wrapAround: false,
        worldCopyJump: true,
    });
      map.add(tiledLayer);

      view.popupEnabled = false;
        view.on("click", (event) => {
        getWeatherData()
          // Get the coordinates of the click on the view
          lat = Math.round(event.mapPoint.latitude * 1000) / 1000;
          lon = Math.round(event.mapPoint.longitude * 1000) / 1000;

          view.openPopup({
            // Set the popup's title to the coordinates of the location
            title: "Weather Data",
            location: event.mapPoint, // Set the location of the popup to the clicked location
    
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
                                  <td style="padding: 0 5px;">${temp_max}</td>
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
                    temp_max = dataActual.main.temp_max;
                    icon = dataActual.weather[0].icon

                })
            })
            
        }
});