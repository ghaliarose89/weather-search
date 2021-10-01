
var today = new Date();
var weatherCardholder = $("#weatherCards");
var temp = document.getElementById("temp");
var humidity = document.getElementById("humidity");
var wind = document.getElementById("wind");
var uv = document.getElementById("uv");
var cityName = document.getElementById("date-title");
var cardBox = document.getElementById("weatherCards");
var citySearch = document.getElementById("text-iput");
var cityname = citySearch.value.trim();
var historyBox = document.getElementById("searchHistory");
var weatherarr = [];



function saveCity() {
    var cityname = citySearch.value.trim();
    if (cityname) {
        weatherarr = JSON.parse(localStorage.getItem("cityName")) || [];
        weatherarr.push(cityname);
        console.log(weatherarr);

        localStorage.setItem("cityName", JSON.stringify(weatherarr));
        var histBtn = document.createElement("button");
        histBtn.setAttribute("id", cityname);
        histBtn.classList = "btn btn-secondary gap-2 col-8 mx-auto mb-3";
        histBtn.innerHTML = cityname;
        historyBox.append(histBtn);
        //comment

    }
    else {
        alert("please enter a city name");
        return;
    }

};

function loadHistory() {
    weatherarr = JSON.parse(localStorage.getItem("cityName"))|| [];
    for (var i = 0; i < weatherarr.length; i++) {
        var histBtn = document.createElement("button");
        histBtn.setAttribute("id", weatherarr[i]);
        histBtn.classList = "btn btn-secondary gap-2 col-8 mx-auto mb-3";
        histBtn.innerHTML = weatherarr[i];
        historyBox.append(histBtn);
        console.log(weatherarr[i]);
        historyBox.addEventListener("click", function (event) {
            var cityname = event.target.getAttribute("id");
            if (cityname) {
                getCityInfo(cityname);

            }
        });
    }
};



function getCityInfo(cityname) {
    var citySearch = document.getElementById("text-iput").value;

    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + cityname + " &units=imperial&appid=d9941e83b4286a556931774882f29cd7")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            cityName.innerHTML = cityname.toUpperCase() +
                " (" + (today.getMonth() + 1) + '/' + (today.getDate()) + '/' + today.getFullYear() + ")"
                + "<img src='http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png'/>"
            
            var lat = (data.coord.lat);
            var lon = (data.coord.lon);
            
            

            fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=d9941e83b4286a556931774882f29cd7"
            )

                .then(function (d) {
                    return d.json();
                })
                .then(function (weathersearch) {
                    console.log (weathersearch);
                    weatherinfo(weathersearch);

                });
        });
};


function weatherinfo(weather) {
    $("#locationCity").removeClass("hidden");
    $("#weatherCards").removeClass("hidden");
    //current city weather
    temp.textContent = "Temp: " + weather.current.temp.toFixed(1) + "°F";
    humidity.textContent = "Humidity: " + weather.current.humidity.toFixed(1) + "%";
    wind.textContent = "Wind: " + weather.current.wind_speed.toFixed(1) + " MPH";
    var uvi = weather.current.uvi.toFixed(1);
    if (uvi >= 0) {
        uv.className = "uv-index-green";
    }
    if (uvi >= 3) {
        uv.className = "uv-index-yellow";
    }
    if (uvi >= 8) {
        uv.className = "uv-index-red";
    }
    uv.textContent = "UV: " + weather.current.uvi.toFixed(1);

    //weather for 5 days
    var weather5Days = weather.daily;
    for (var i = 0; i < 5; i++) {
        console.log(weather5Days[i].weather[0].icon);
        var bodyCardholder = document.createElement('div');
        bodyCardholder.classList = "card m-2 others bkg";
        bodyCardholder.style = "width: 16rem; height: 15rem;"
        var date = (today.getMonth() + 1) + '/' + (today.getDate() + i + 1) + '/' + today.getFullYear()
        + "<img src='http://openweathermap.org/img/wn/" + weather5Days[i].weather[0].icon +"@2x.png'/>";
        //
        bodyCardholder.innerHTML = "<h4>" + date + "</h5>" +
            "<p> Temp: " + weather5Days[i].temp.day.toFixed(1) + "°F" + "</p>"
            + "<p> Humidity: " + weather5Days[i].humidity.toFixed(1) + "%" + "</p>"
            + "<p> Wind Speed: " + weather5Days[i].wind_speed.toFixed(1) + " MPH" + "</p>"
        cardBox.append(bodyCardholder);
        console.log( "<img src='http://openweathermap.org/img/wn/'" + weather5Days[i].weather[0].icon +"@2x.png'/>");
    }

};
loadHistory();
$("#search-btn").click(function (event) {
    event.preventDefault();
    var cityname = citySearch.value.trim();
    getCityInfo(cityname);
    saveCity();
});

