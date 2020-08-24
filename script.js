var cities = ["Austin", "New York", "Los Angeles", "Las Vegas", "Orlando"];

function renderCities() {
    $("#addCitiesHere").empty();
    for (var i = 0; i < cities.length; i++) {
        var liEl = $("<li>")
        liEl.attr("data-name", cities[i]);
        liEl.addClass("city list-group-item");

        liEl.text(cities[i]);
        $("#addCitiesHere").append(liEl);
        console.log(cities);


    }

    var lastCity = (cities.length - 1);
    console.log(lastCity)
}

function updateClass() {
    removeActive();
    $(this).addClass("active");
}

function removeActive() {
    for (var j = 0; j < cities.length; j++) {
        $(".city").removeClass("active");
    }
}


$("#citySubmit").on("click", function(event) {
    event.preventDefault();
    var newCity = $("#citySearch").val().trim();
    cities.push(newCity);
    console.log(newCity)

    renderCities();
})

$(document).on("click", ".city", updateClass);