var app = {

  // Initializing variables that are not displayed on the web page but necessary for retrieving data and operating functions
  config: {
    lat: null,
    lon: null,
    weatherURLTemplate: "https://fcc-weather-api.glitch.me/api/current?lon=:longitude&lat=:latitude",
    // vvariables for referencing html elements
    $unit: $(".unit-container p"),
    $background: $("body"),
    $location: $(".location span"),
    $weatherImage: $("#weatherIcon"),
    $temperature: $("p.temperature span"),
    $description: $("p.description"),
    $loading: $(".loading"),
    $loaded: $(".loaded"),
  },

  // Initializing variables that store values to be displayed on the web page
  location: "",
  weatherIcon: null,
  temperature: null,
  unit: "celsius",
  description: "",

  // Requesting the current position of the user: 
  // if it is available or enabled, location data will be passed to other functions for further use,
  // if not the browser throws an alert message.  
  init: function () {
    $("document").ready(function () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(app.showPosition);
      } else {
        alert("Geolocation is not supported by this browser.");
      }

      // initClick function is called to scan the currently active temperature unit to be able to caculate and display the correct temperature value (in Celsius or Fahrenheit)
      app.initUnitClick();
    });
  },

  // This function has two purposes: 
  // to get the current temperature unit (Celsius of Fahrenheit) and 
  // to prepare certain html elements to respond to the onclick event (switching to another temperature unit)
  initUnitClick: function () {
    app.config.$unit.click(function (event) {
      // sets the value of unit variable equal to the unit on which the user clicked (if a click event happens)
      app.unit = $(this).data("unit");
      // the unit symbol on which the user clicked becomes active, the other one is being deactivated
      app.config.$unit.removeClass("active");
      $(this).addClass("active");

      // setView function is called to recalculate and display the temperatue in the right temperature unit.
      app.setView();
    });
  },

  // This function sets the values of variables got from geolocation function and passes them to the getWeathrData function
  showPosition: function (position) {
    app.config.lat = position.coords.latitude;
    app.config.lon = position.coords.longitude;

    app.getWeatherData();
  },

  //Constructing the api request url by replacing "latitude" and "longitude" with values got from showPosition function
  getWeatherData: function () {
    var url = app.config.weatherURLTemplate
      .replace(":longitude", app.config.lon)
      .replace(":latitude", app.config.lat);

    // Requesting weather data and assigning values to the variables
    $.get(url, function (data) {
      app.temperature = data["main"]["temp"];
      app.location = data["name"].replace(/ue/gi, "ü");  /*fixing the display of characher "ü" */
      app.weatherIcon = data.weather[0].icon;
      app.description = data["weather"][0]["description"];

      // After the variables got values the setView function is called to display this data on the web page
      app.setView();
    });
  },

  // Converting Celsius into Fahrenheit
  celsiusToFahrenheit: function () {
    return Math.round(1.8 * app.temperature + 32);
  },

  // Getting the current date and returning the name of the season based on the value of the actual month.
  getSeason: function () {
    var today = new Date();
    var mm = today.getMonth() + 1;

    if (2 < mm && mm < 6) {
      return "spring";
    } else if (5 < mm && mm < 9) {
      return "summer";
    } else if (8 < mm && mm < 12) {
      return "autumn";
    } else {
      return "winter";
    }
  },

  // Examining the current temperature unit and returning the temperature measured in that unit
  getTemperature: function () {
    switch (app.unit) {
      case "celsius":
        return app.temperature;
        break;
      case "fahrenheit":
        return app.celsiusToFahrenheit();
        break;
    }
  },

  // Filling html elements with data retrieved from weather api
  setView: function () {
    // When the web page is loaded, "Loading..." text is hidden
    app.config.$loading.hide();
    // The content appears only when all of the data are available
    app.config.$loaded.fadeIn("normal");
    // Adding background image based on the actual season
    app.config.$background.addClass(app.getSeason());
    // Displaying location name
    app.config.$location.html(app.location);
    // Displaying the weather icon
    app.config.$weatherImage.attr("src", app.weatherIcon);
    // Displaying the temperature. getTemperature function displays the temperature based on the chosen unit
    app.config.$temperature.html(app.getTemperature());
    // Displaying weather description
    app.config.$description.html(app.description);
  }
};

app.init();