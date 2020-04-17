//hides weather section
$("#weatherSection").hide();

//storing value in var then clears when you search a city
$("#searchBtn").on("click", function(event) {
    event.preventDefault();
    var inputCity= $("#inputCity").val();
    $("#inputCity").val("");
//validate that user actually put a city
    if (inputCity==="") {
        return;
    }
    currentWeatherAPI(inputCity);

});

function currentWeatherAPI(city) {
    var apiKey = "b5f99557449b2cb08a71cf26f5946efb";
    var currentWeatherURL="http://api.openweathermap.org/data/2.5/weather?q="+city+"&APPID="+ apiKey;

    $.ajax({
        url: currentWeatherURL,
        method: "GET"
    }).then(function(response){

        //convert K to F
        var tempInF=parseInt((response.main.temp - 273.15) * 9/5 + 32);

        //link to text
        $("#cityName").text(city);
        $("#currentDate").text(" (" + moment().format("MM/DD/YYYY") + ") ");

        $("#temp").text(tempInF +" °F");
        $("#humidity").text(response.main.humidity + "%");
        $("#wind").text(response.wind.speed + " MPH");
        $("#weatherIcon").attr("src", "http://openweathermap.org/img/wn/" + response.weather[0].icon +".png")

        //new ajax call for uv index
        var lat=response.coord.lat;
        var lon=response.coord.lon;

        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/uvi?appid="+apiKey+"&lat="+lat+"&lon="+lon,
            method: "GET"
        }).then(function(response) {
            console.log(lat);
            console.log(lon);

            //link to UV text on screen
            $("#uvIndex").text(response.value);
        })
        
        //show  the weathe
        $("#weatherSection").show();

    })
    

}


