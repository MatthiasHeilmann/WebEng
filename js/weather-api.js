//The following code gets the current weather data for Mannheim from openweathermap.org 
var city = "Mannheim";
$.getJSON(
    "https://api.openweathermap.org/data/2.5/weather?q="+city+"&units=metric&&appid=e543767cec1fc6ea03c70d7be741dcc7&lang=de",
    function(data){
        console.log(data);

        var icon = "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
        var weather = data.weather[0].description;
        var temp = Math.floor(data.main.temp);
        //The adjusted data and icon for weather type is put into the html
        $("#weather-api-icon").attr("src",icon);
        $("#weather-api-description").append(weather);
        $("#weather-api-temp").append(temp);
});