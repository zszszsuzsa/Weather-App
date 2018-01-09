

$("document").ready(function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
});

function showPosition(position) {
  // inserting location data into browser URL for api request------------------------------------
  var lat = position.coords.latitude;
  var lon = position.coords.longitude;
  var requestURL =
    "https://fcc-weather-api.glitch.me/api/current?lon=:longitude&lat=:latitude";
  var res = requestURL.replace(":longitude", lon).replace(":latitude", lat);

  // api request---------------------------------------------------------------
  $.get(
    res,

    function(data) {
      var c = data["main"]["temp"];
      // location name:-------------------------------------------------
      $(".location").append(data["name"].replace(/ue/gi, "ü"));
      // weather icon---------------------------------------------------
      document.getElementById("weatherIcon").src = data.weather[0].icon;
      w = $("p.degree").css("height");
      $("img")
        .css("height", w)
        .css("max-width", w);
      console.log(w);
      // celsius---------------------------------------------------------
      $(".degree").prepend(Math.round(data["main"]["temp"]));
      //  description-------------------------------------------------------
      $(".description").append(data["weather"][0]["description"]);
      //  Converting to fahrenheit-----------------------------------------
      var f = 1.8 * c + 32;
      $("p.unitF").click(function(c) {
        $(".degree")
          .empty()
          .append(Math.round(f) + "°");
        var celsius = $("p.unitC").detach(); //juhúúúúúúúúúúúúúúúúúúúú :)
        $("p.unitF").addClass("unitBold");
        celsius.appendTo(".switch"); //juhúúúúúúúúúúúúúúúúúúúú :)
        $("p.unitC").removeClass("unitBold");
      });
      //  Converting back to celsius---------------------------------------
      $("p.unitC").click(function(data) {
        $(".degree")
          .empty()
          .append(Math.round(c) + "°");
        var fahrenheit = $("p.unitF").detach();
        $("p.unitC").addClass("unitBold");
        fahrenheit.appendTo(".switch");
        $("p.unitF").removeClass("unitBold");
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
