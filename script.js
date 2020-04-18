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
    //if its not already in the array then we push it
    if (storeCity.indexOf(inputCity)===-1){
        storeCity.push(inputCity);
        localStorage.setItem("locallyStoreCities",JSON.stringify(storeCity));

        $("#listOfCities").prepend($("<button>").text(inputCity).addClass("buttonWithCity btn btn-primary btn-lg btn-block"));
    }
    
    currentWeatherAPI(inputCity);

});

//click event for the btns to display weather based on the city on that button.
$("#listOfCities").on("click", ".buttonWithCity", function(event) {
var cityName = $(this).text();
currentWeatherAPI(cityName);
});

var storeCity = [];

function displayStoredCities() {
var citiesFromLocalStorage=JSON.parse(localStorage.getItem("locallyStoreCities"));
 if(citiesFromLocalStorage) {
     storeCity=citiesFromLocalStorage;
     var lastCityStored = citiesFromLocalStorage[citiesFromLocalStorage.length-1]
     currentWeatherAPI(lastCityStored);
     for (var i=0;i<citiesFromLocalStorage.length;i++) {
         $("#listOfCities").prepend($("<button>").text(citiesFromLocalStorage[i]).addClass("buttonWithCity btn btn-primary btn-lg btn-block"));
     }
 }
 
};

displayStoredCities();

function currentWeatherAPI(city) {
    var apiKey = "b5f99557449b2cb08a71cf26f5946efb";
    var currentWeatherURL="https://api.openweathermap.org/data/2.5/weather?q="+city+"&APPID="+apiKey;

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
        $("#weatherIcon").attr("src", "https://openweathermap.org/img/wn/" + response.weather[0].icon +".png")

        //new ajax call for uv index
        var lat=response.coord.lat;
        var lon=response.coord.lon;

        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/uvi?appid="+apiKey+"&lat="+lat+"&lon="+lon,
            method: "GET"
        }).then(function(uvresponse) {
           console.log(uvresponse);
            //link to UV text on screen
            var uvIndexDisplayed =$("#uvIndex").text(uvresponse.value);

            if (uvresponse.value <=2) {
                uvIndexDisplayed.removeClass("uvyellow uvred");
                uvIndexDisplayed.addClass("uvgreen");
            } else if (uvresponse.value >=2.1 && uvresponse.value <=5 ) {
                uvIndexDisplayed.removeClass("uvgreen uvred");
                uvIndexDisplayed.addClass("uvyellow");
            } else{
                uvIndexDisplayed.removeClass("uvyellow uvgreen");
                uvIndexDisplayed.addClass("uvred");
            };
        });
        //connecting 5 day forcast api: date,icon, temp,hummidity
        var fiveDayForcastURL="https://api.openweathermap.org/data/2.5/forecast?q="+city+"&appid="+apiKey;

        $.ajax({
            url: fiveDayForcastURL,
            method: "GET"
        }).then(function(fiveDayResponse){
            var index = 1;

            for (var i=0;i<fiveDayResponse.list.length;i++) {
                var timeAndDate=fiveDayResponse.list[i].dt_txt;

                if (timeAndDate.includes("12:00:00")) {
                    var date = moment(timeAndDate).format("MM/DD/YYYY");
                    var icon = fiveDayResponse.list[i].weather[0].icon;
                    var temp =fiveDayResponse.list[i].main.temp;
                    var humidity =fiveDayResponse.list[i].main.humidity;
                    
                    temp=parseInt((temp - 273.15) * 9/5 + 32);
                    
                    $("#day"+index).text(date);
                    $("#weatherIcon"+index).attr("src", "https://openweathermap.org/img/wn/" + icon +".png");
                    $("#temp"+index).text(temp+" °F");
                    $("#humidity"+index).text(humidity);
                    index++;

                };
            };
        });
        $("#weatherSection").show();
    });
};


