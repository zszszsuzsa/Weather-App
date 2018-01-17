var app = {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
});

/**
 * Shows current GPS position
 * @param {number} position
 */
function showPosition(position) {
  // inserting location data into browser URL for api request--------------------
  var lat = position.coords.latitude;
  var lon = position.coords.longitude;
  var URLtemplate =
    "https://fcc-weather-api.glitch.me/api/current?lon=:longitude&lat=:latitude";
  var URLready = URLtemplate.replace(":longitude", lon).replace(
    ":latitude",
    lat
  );

  // api request---------------------------------------------------------------
  $.get(
    URLready,

    function(data) {
      var celsius = data["main"]["temp"];
      // inserting location name--------------------------------------------
      $(".location").append(data["name"].replace(/ue/gi, "ü"));
      // inserting weather icon---------------------------------------------
      document.getElementById("weatherIcon").src = data.weather[0].icon;
      // inserting temperature in celsius-----------------------------------
      $(".temperature").prepend(Math.round(data["main"]["temp"]));
      //  inserting description--------------------------------------------
      $(".description").append(data["weather"][0]["description"]);
      
      //  converting celsius to fahrenheit---------------------------------
      var fahrenheit = 1.8 * celsius + 32;
      $("p.fahrenheitSymbol").click(function(celsius) {
        $(".temperature") /* removes current temperature*/
          .empty()
          .append(Math.round(fahrenheit) + "°");
        $("p.celsiusSymbol").removeClass("active");
        var detached = $(
          "p.celsiusSymbol"
        ).detach(); /* removes "C" unit Symbol*/
        $("p.fahrenheitSymbol").addClass("active");
        detached.appendTo(
          ".unitSymbolContainer"
        ); /* reattaches "F" unit Symbol to the bottom */
      });
      
      //  Converting back to celsius---------------------------------------
      $("p.celsiusSymbol").click(function(data) {
        $(".temperature") /* removes current temperature*/
          .empty()
          .append(Math.round(celsius) + "°");
        $("p.fahrenheitSymbol").removeClass("active");
        var detached = $(
          "p.fahrenheitSymbol"
        ).detach(); /* removes "F" unit Symbol*/
        $("p.celsiusSymbol").addClass("active");
        detached.appendTo(
          ".unitSymbolContainer"
        ); /* reattaches "C" unit Symbol to the bottom */
      });
    }
  );
}

// background-image by season----------------------------------------------
var today = new Date();
var mm = today.getMonth() + 1;

if (2 < mm && mm < 6) {
  $("body").addClass("spring");
} else if (5 < mm && mm < 9) {
  $("body").addClass("summer");
} else if (8 < mm && mm < 12) {
  $("body").addClass("autumn");
} else {
  $("body").addClass("winter");
}
