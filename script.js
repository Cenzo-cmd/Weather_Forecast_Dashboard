var date = moment().format("L");
$("#displayDate").text(date);

var cityArray = [];
// localStorage.setItem("City", cities);
var APIKey = "dd90d41f6269d68aa74cd38310554e8a";

function renderCities() {
    console.log(cityArray);
    if (cityArray.length >= 1) {
        $("#addCitiesHere").empty();
        for (var i = 0; i < cityArray.length; i++) {
            var liEl = $("<li>")
                // var deleteButton = $("<button>").addClass("deleteButton").text("Remove");
            liEl.attr("data-name", cityArray[i]);
            liEl.addClass("city list-group-item");
            if (i === 0) {
                liEl.addClass("active");
            }
            liEl.text(cityArray[i]);
            // liEl.append(deleteButton);
            $("#addCitiesHere").append(liEl);
        }
    } else {
        return;
    }
}

$(document).on("click", ".city", clickedCity);

function updateClass(cityValueClass) {
    console.log(cityValueClass);
    removeActive();


    cityValueClass.addClass("active");
    console.log("HHHHHHHHHHH", cityValueClass.attr("class"));
}

function removeActive() {
    for (var j = 0; j < cityArray.length; j++) {
        $(".city").removeClass("active");
    }
}

// $(".deleteButton").on("click", function(event) {
//     event.preventDefault();
//     event.stopPropagation();
//     console.log("hi");
//     cityValue = $(this).parent().attr("data-name");
//     console.log("the value is" + cityValue);
// })

function clickedCity(event) {
    event.stopPropagation();
    event.preventDefault();
    var cityValue = event.target.innerHTML;
    var cityValueClass = $(this);
    searchCity(cityValue);
    updateClass(cityValueClass);
}

$("#citySubmit").on("click", function(event) {
    event.preventDefault();
    event.stopPropagation();
    var findNewCity = $("#citySearch").val().trim();
    console.log(findNewCity);
    if (findNewCity === undefined || findNewCity === NaN || findNewCity === "") {
        return;
    };
    cityArray.unshift(findNewCity);
    searchCity(findNewCity);
    renderCities();
})

function searchCity(findNewCity) {

    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${findNewCity}&units=imperial&appid=${APIKey}`;
    if (findNewCity === undefined || findNewCity === NaN || findNewCity === "") {
        return;
    };
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {

        $("#displayCityName").text(findNewCity);
        $("#humidity").text("Humidity: " + response.main.humidity + "%");
        $("#temp").text("Temperature: " + response.main.temp + "\u00B0F");
        $("#maxTemp").text("Max Temp: " + response.main.temp_max + "\u00B0F");
        $("#windSpeed").text("Wind Speed: " + response.wind.speed + " MPH");
        $("#feelsLike").text("Feels Like: " + response.main.feels_like + "\u00B0F");
        $("#uvIndex").text("UV Index: " + "")

        var lat = response.coord.lat;
        var lon = response.coord.lon;
        var latLong = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${APIKey}`;
        $.ajax({
            url: latLong,
            method: "GET"
        }).then(function(result) {
            $("#forecast").empty();
            $("#emptyDiv").empty();

            let uvIndexValue = result.current.uvi;
            if (uvIndexValue < 4) {
                $("#uvIndex").attr("style", "background-color: green");;
            } else if (uvIndexValue > 4 && uvIndexValue < 6) {
                $("#uvIndex").attr("style", "background-color: yellow");
            } else { $("#uvIndex").attr("style", "background-color: red"); };
            $("#uvIndex").text("UV Index: " + uvIndexValue);
            let mainIcon = result.current.weather[0].icon;
            let mainIconImg = "http://openweathermap.org/img/wn/" + mainIcon + ".png";
            let mainIconImg2 = $("<img>").attr("src", mainIconImg).addClass("mainIcon");

            $("#emptyDiv").append(mainIconImg2);
            for (var x = 1; x < 6; x++) {
                // console.log(result);
                let fiveDayTemp = result.daily[x].temp.day.toFixed(1);
                let fiveDayHumidity = result.daily[x].humidity;
                let fiveDayDate = result.daily[x].sunrise;
                let fiveDayWind = result.daily[x].wind_speed.toFixed(1);
                let fiveDayPic = result.daily[x].weather[0].icon;
                let fiveDayIcon = "http://openweathermap.org/img/wn/" + fiveDayPic + ".png";
                fiveDayDate = fiveDayDate * 1000;
                // console.log(fiveDayDate);
                let dateObject = new Date(fiveDayDate);
                let humanDate = dateObject.toLocaleDateString();
                // console.log(humanDate);
                let divEl = $("<div>").addClass("card fiveDayCard").attr("style", "background-color: dodgerblue");
                let imageEl = $("<img>").addClass("fiveDayImage").attr("src", fiveDayIcon);
                $(divEl).append("<h5>" + humanDate + "</h5>");
                $(divEl).append(imageEl);
                $(divEl).append("<p>" + "Temp: " + fiveDayTemp + "\u00B0F" + "</p>");
                $(divEl).append("<p>" + "Wind " + fiveDayWind + " MPH" + "</p>");
                $(divEl).append("<p>" + "Humidity: " + fiveDayHumidity + "%" + "</p>");
                $("#forecast").append(divEl);
            }
            // $("#citySearch").empty();
        })

    })

}