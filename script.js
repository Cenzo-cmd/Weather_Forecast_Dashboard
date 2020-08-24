$(document).ready(function() {
    var date = moment().format("L");
    $("#displayDate").text(date);

    var cities = ["Austin", "New York", "Los Angeles", "Las Vegas", "Orlando"];



    var APIKey = "dd90d41f6269d68aa74cd38310554e8a";
    renderCities();


    function renderCities() {
        $("#addCitiesHere").empty();
        for (var i = 0; i < cities.length; i++) {
            var liEl = $("<li>")
            liEl.attr("data-name", cities[i]);
            liEl.addClass("city list-group-item");

            liEl.text(cities[i]);
            $("#addCitiesHere").append(liEl);
            // console.log(cities);
        }
        // firstCity = cities[0].addClass("active");


        // console.log(lastCity)
    }

    function updateClass() {
        removeActive();
        $(this).addClass("active");

        newCity = $(this).attr("data-name");
        console.log(newCity);
        var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${newCity}&units=imperial&appid=${APIKey}`;

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

        })

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
        searchCity();

        renderCities();
    })

    function searchCity(newCity) {
        var newCity = $("#citySearch").val().trim();
        var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${newCity}&units=imperial&appid=${APIKey}`;

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


        })
    }

    $(document).on("click", ".city", updateClass);

})