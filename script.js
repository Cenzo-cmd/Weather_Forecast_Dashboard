$(document).ready(function() {
    var date = moment().format("L");
    $("#displayDate").text(date);

    var cities = ["Austin", "New York", "Los Angeles", "Las Vegas", "Seattle"];

    var APIKey = "dd90d41f6269d68aa74cd38310554e8a";
    renderCities();
    updateClass();


    function renderCities() {
        $("#addCitiesHere").empty();
        cities = localStorage.getItem("City").split(",");
        console.log(cities);
        for (var i = 0; i < cities.length; i++) {
            var liEl = $("<li>")
            liEl.attr("data-name", cities[i]);
            liEl.addClass("city list-group-item");
            if (i === 0) {
                liEl.addClass("active");
            }
            liEl.text(cities[i]);
            $("#addCitiesHere").append(liEl);

        }
    }

    function updateClass() {
        removeActive();
        $(this).addClass("active");
        newCity = $(this).attr("data-name");
        console.log("new city is " + newCity);

        // console.log(newCity);
        searchCity(newCity);
    }

    function removeActive() {
        for (var j = 0; j < cities.length; j++) {
            $(".city").removeClass("active");
        }
    }

    $("#citySubmit").on("click", function(event) {
        event.preventDefault();
        var newCity = $("#citySearch").val().trim();
        if (newCity === undefined || newCity === NaN || newCity === "") {
            return;
        };
        cities.unshift(newCity);
        localStorage.setItem("City", cities);
        // console.log(newCity);
        searchCity(newCity);
        renderCities();
    })

    function searchCity(newCity) {
        var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${newCity}&units=imperial&appid=${APIKey}`;
        if (newCity === undefined || newCity === NaN || newCity === "") {
            return;
        };
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {

            $("#displayCityName").text(newCity);
            $("#humidity").text("Humidity: " + response.main.humidity + "%");
            $("#temp").text("Temperature: " + response.main.temp + "\u00B0F");
            $("#maxTemp").text("Max Temp: " + response.main.temp_max + "\u00B0F");
            $("#windSpeed").text("Wind Speed: " + response.wind.speed + " MPH");
            $("#feelsLike").text("Feels Like: " + response.main.feels_like + "\u00B0F");
            $("#uvIndex").text("UV Index: " + "")
            console.log(response);

            var lat = response.coord.lat;
            var lon = response.coord.lon;
            var latLong = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${APIKey}`;
            $.ajax({
                url: latLong,
                method: "GET"
            }).then(function(result) {
                console.log(result);
                $("#forecast").empty();
                $("#emptyDiv").empty();
                // var fiveDay = result.daily;
                let uvIndexValue = result.current.uvi;


                if (uvIndexValue < 4) {
                    $("#uvIndex").attr("style", "background-color: green");;
                } else if (uvIndexValue > 4 && uvIndexValue < 6) {
                    $("#uvIndex").attr("style", "background-color: yellow");
                } else { $("#uvIndex").attr("style", "background-color: red"); };


                $("#uvIndex").text("UV Index: " + uvIndexValue);
                let mainIcon = result.daily[0].weather[0].icon;
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

                    let divEl = $("<div>").addClass("card fiveDayCard").attr("style", "background-color: deepskyblue");
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

    $(document).on("click", ".city", updateClass);

})