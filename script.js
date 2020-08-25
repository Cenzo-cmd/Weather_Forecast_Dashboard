$(document).ready(function() {
    var date = moment().format("L");
    $("#displayDate").text(date);

    var cities = ["Austin", "New York", "Los Angeles", "Las Vegas", "Orlando"];

    var APIKey = "dd90d41f6269d68aa74cd38310554e8a";
    renderCities();
    updateClass();


    function renderCities() {
        $("#addCitiesHere").empty();
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
        cities.unshift(newCity);
        // console.log(newCity);
        searchCity(newCity);
        renderCities();
    })

    function searchCity(newCity) {
        var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${newCity}&units=imperial&appid=${APIKey}`;
        console.log(newCity);
        if (newCity === undefined || newCity === NaN) {
            return;
        }
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {

            $("#displayCityName").text(newCity);
            $("#humidity").text("Humidity: " + response.main.humidity + "%");
            $("#temp").text("Temperature: " + response.main.temp + " degrees F");
            $("#windSpeed").text("Wind Speed: " + response.wind.speed + " MPH");
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
                var fiveDay = result.daily;
                $("#uvIndex").text(result.current.uvi);
                for (var x = 1; x < 6; x++) {
                    let fiveDayTemp = result.daily[x].temp.day;
                    let fiveDayHumidity = result.daily[x].humidity;
                    let fiveDayDate = result.daily[x].sunrise;
                    fiveDayDate = fiveDayDate * 1000;
                    // console.log(fiveDayDate);
                    let dateObject = new Date(fiveDayDate);
                    let humanDate = dateObject.toLocaleDateString();
                    // console.log(humanDate);

                    let divEl = $("<div>");
                    divEl.addClass("card fiveDayCard");
                    $(divEl).append("<h5>" + humanDate + "</h5>");
                    $(divEl).append("<p>" + "Temp: " + fiveDayTemp + " degrees F" + "</p>");
                    $(divEl).append("<p>" + "Humidity: " + fiveDayHumidity + "%" + "</p>");


                    $("#forecast").append(divEl);


                }

            })

        })

    }

    $(document).on("click", ".city", updateClass);

})