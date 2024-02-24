const weatherModule = (() => {
    const searchButton = document.querySelector(".btn.btn-primary");
    const cityInput = document.getElementById("city");
    const stateInput = document.getElementById("state");
    const countryInput = document.getElementById("country");
  
    searchButton.addEventListener("click", () => {
      fetchCurrentWeather();
      fetchForecastWeather();
    });
  
    const clearDefaultIfMatch = (element, defaultValue) => {
      if (element.value === defaultValue) {
        element.value = "";
      }
    };
  
    cityInput.addEventListener("focus", () => {
      clearDefaultIfMatch(cityInput, "London");
    });
  
    stateInput.addEventListener("focus", () => {
      clearDefaultIfMatch(stateInput, "UK");
    });
  
    countryInput.addEventListener("focus", () => {
      clearDefaultIfMatch(countryInput, "UK");
    });
  
    document.querySelector(".container").addEventListener("input", (event) => {
      if (event.target.classList.contains("container")) {
        clearDefaultIfMatch(cityInput, "London");
        clearDefaultIfMatch(stateInput, "UK");
        clearDefaultIfMatch(countryInput, "UK");
      }
    });
  
    document.addEventListener("DOMContentLoaded", () => {
      cityInput.value = "London";
      stateInput.value = "UK";
      countryInput.value = "UK";
      fetchCurrentWeather();
      fetchForecastWeather();
    });
  
    async function fetchCurrentWeather() {
        try {
          const searchCity = document.getElementById("city").value;
          const searchState = document.getElementById("state").value;
          const searchCountry = document.getElementById("country").value;
      
          // Run check to see if all fields have values
          if (searchCity == "" || searchCountry == "" || searchState == "") {
            alert("All fields are required.  Please try again!");
            return;
          };
      
          console.log(searchCity);
          console.log(searchState);
          console.log(searchCountry);
      
          // Run fetch and wait for response JSON
          const response = await fetch("https://api.openweathermap.org/data/2.5/weather?q=" + searchCity + "," + searchState + "," + searchCountry + "&units=imperial&APPID=6fe02cf69a941da7f455fde210badc0f", { mode: "cors"});
          const currentData = await response.json();
          console.log("Fetching current weather data from API....", currentData);
      
          // Construct object literal from JSON data
          const currentWeather = {
            mainWeather: currentData.weather[0].main,
            iconCode: currentData.weather[0].icon, // Get the icon code here
            place: currentData.name + ", " + searchState.toUpperCase() + " " + currentData.sys.country,
            temp: Math.round(currentData.main.temp),
            humidity: currentData.main.humidity + "%",
            wind: Math.round(currentData.wind.speed * 1.60934) + " kmh" + " / " + Math.round(currentData.wind.speed) + " mph",
            feels_like: currentData.main.feels_like
          };
      
          console.log(currentWeather);
      
          displayWeather(currentWeather);
      
        } catch (err) {
          console.log("Something has went wrong. Please try again.", err);
          alert("Something has went wrong. Please try again.");
        }
      };
  
      async function fetchForecastWeather() {
        try {
          const searchCity = document.getElementById("city").value;
          const searchState = document.getElementById("state").value;
          const searchCountry = document.getElementById("country").value;
      
          // Run check for field values
          if (searchCity == "" || searchCountry == "" || searchState == "") {
            alert("All fields are required. Please try again!");
            return;
          };
      
          // Run fetch and wait for response JSON
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${searchCity},${searchState},${searchCountry}&units=imperial&APPID=6fe02cf69a941da7f455fde210badc0f`,
            { mode: "cors" }
          );

          const forecastData = await response.json();
          console.log("Fetching forecast weather data from API", forecastData);
      
          // Display forecast weather
          displayForecastWeather(forecastData);
        } catch (err) {
          console.log(
            "Something has went wrong. Please try again.",
            err
          );
          alert("Something has went wrong. Please try again.");
        }
      };
      
      function getLocalTime(timestamp, timezoneOffset) {
        const utcOffset = timestamp.getTimezoneOffset() * 60; // Get the UTC offset in seconds
        const localTime = new Date(timestamp * 1000 + (timezoneOffset + utcOffset) * 3600 * 1000);
        return localTime;
      };
  
      function displayWeather(currentWeather) {
        const city = document.getElementById("city_p");
        city.textContent = "Location: " + currentWeather.place;
      
        const status = document.getElementById("status_p");
        status.textContent = "Status: " + currentWeather.mainWeather;
      
        const cityTemp = document.getElementById("cityTemp_p");
        const fahrenheit = currentWeather.temp;
        const celzius = Math.round((fahrenheit-32)*5/9);
        cityTemp.textContent = "Temperature: " + celzius+"°C" + "/" + fahrenheit+"°F";
      
        const tempOnly = celzius + "°C" + "/" + fahrenheit + "°F";
        const todayTempBold = document.querySelector(".todayTempBold");
        todayTempBold.textContent = tempOnly;
      
        const cityHumidity = document.getElementById("cityHumidity_p");
        cityHumidity.textContent = "Humidity: " + currentWeather.humidity;
      
        const cityWind = document.getElementById("cityWind_p");
        cityWind.textContent = "Wind: " + currentWeather.wind;
      
        const cityFeelsLike = document.getElementById("feelsLike");
        cityFeelsLike.textContent = "RealFeel: "+ currentWeather.feels_like;
        const fahrenheit_FL = Math.round(currentWeather.feels_like);
        const celzius_FL = Math.round((fahrenheit_FL-32)*5/9);
        cityFeelsLike.textContent = "FeelsLike: " + celzius_FL+"°C" + "/" + fahrenheit_FL+"°F";
    
        displayWeatherIcon(currentWeather.iconCode);
        const keyword = currentWeather.mainWeather;
        updateBackgroundImage(keyword);
      };
  
      function displayForecastWeather(forecastData) {
        const forecastDetails = document.querySelector(".forecast-details");
        forecastDetails.innerHTML = "";
        
        const today = new Date();
        const todayIndex = (today.getDay() + 1) % 7; // Get tomorrow's day index
        let counter = 0;
      
        for (let i = 0; i < forecastData.list.length; i++) {
          const forecastIndex = i % 7; // Calculate the correct forecast index
      
          if (forecastData) {
            const forecastCard = document.createElement("div");
            forecastCard.classList.add("forecast-card", "square");
      
            const day = document.createElement("h5");
            day.textContent = getDayOfWeek(forecastIndex, i, forecastData.city.timezone / 3600); // Pass the forecast index, iteration number, and timezone offset
            forecastCard.appendChild(day);
      
            const status = document.createElement("p");
            status.textContent = forecastData.list[i].weather[0].main;
            forecastCard.appendChild(status);
      
            const icon = document.createElement("img");
            const iconCode = forecastData.list[i].weather[0].icon;
            icon.src = getIconUrl(iconCode); // Get the correct icon URL
            icon.classList.add("weather-icon5day");
            forecastCard.appendChild(icon);
      
            const temperatureCelsius = document.createElement("p");
            temperatureCelsius.innerHTML = '<img width="14" height="14" src="https://img.icons8.com/pastel-glyph/64/thermometer--v5.png" alt="thermometer--v5"/>' + convertToFahrenheitToCelsius(forecastData.list[i].main.temp) + "°C";
            forecastCard.appendChild(temperatureCelsius);

            const temperatureFahrenheit = document.createElement("p");
            temperatureFahrenheit.innerHTML = '<img width="14" height="14" src="https://img.icons8.com/pastel-glyph/64/thermometer--v5.png" alt="thermometer--v5"/>' + Math.round(forecastData.list[i].main.temp) + "°F";
            forecastCard.appendChild(temperatureFahrenheit);
      
            const windCardKMH = document.createElement("p");
            windCardKMH.innerHTML = '<img width="14" height="14" src="https://img.icons8.com/pastel-glyph/64/wind--v1.png" alt="wind--v1"/>' + Math.round(forecastData.list[i].wind.speed*1.60934) + " kmh";
            forecastCard.appendChild(windCardKMH);
            forecastDetails.appendChild(forecastCard);

            const windCardMPH = document.createElement("p");
            windCardMPH.innerHTML = '<img width="14" height="14" src="https://img.icons8.com/pastel-glyph/64/wind--v1.png" alt="wind--v1"/>' + Math.round(forecastData.list[i].wind.speed) + " mph";
            forecastCard.appendChild(windCardMPH);
            forecastDetails.appendChild(forecastCard);
            counter++;
      
            if (counter >= 5) {
              break;
            }
          }
      }
      };
  
      function convertToFahrenheitToCelsius(fahrenheit) {
        // Convert Fahrenheit to Celsius formula: (°F - 32) x 5/9
        return Math.round((fahrenheit - 32) * 5 / 9);
      };
  
      function getDayOfWeek(forecastIndex, i, timezoneOffset) {
        const currentDate = new Date();
        const currentUTCOffset = currentDate.getTimezoneOffset() / 60; // Get current UTC offset in hours
        const targetDate = new Date(currentDate.getTime() + (i + 1) * 24 * 60 * 60 * 1000); // Calculate the forecasted date for tomorrow based on the iteration number
      
        const year = targetDate.getFullYear();
        const month = String(targetDate.getMonth() + 1).padStart(2, '0');
        const day = String(targetDate.getDate()).padStart(2, '0');
      
        const localTargetDate = new Date(targetDate.getTime() + timezoneOffset * 3600 * 1000);
        const localDay = String(localTargetDate.getDate()).padStart(2, '0');
        const localMonth = String(localTargetDate.getMonth() + 1).padStart(2, '0');
        const localYear = localTargetDate.getFullYear();
      
        return `${localDay}.${localMonth}.${localYear}.`; // Return the forecasted date in the format dd.mm.yyyy adjusted for local time
      };
  
      function getIconUrl(iconCode) {
        const isNightIcon = iconCode.includes("n");
        const correctedIconCode = isNightIcon ? iconCode.replace("n", "d") : iconCode;
        return `https://openweathermap.org/img/wn/${correctedIconCode}.png`;
      };
  
      const weatherGifs = {
        Thunderstorm: "./bigStorm.gif",
        Drizzle: "./lightRain.gif",
        Rain: "./rain.gif",
        Snow: "./snow.gif",
        Tornado: "./tornado.gif",
        Mist: "./fog.gif",
        Fog: "./fog.gif",
        Haze: "./dustSand.gif",
        Sand: "./dustSand.gif",
        Dust: "./dustSand.gif",
        Ash: "./dustSand.gif",
        Smoke: "./dustSand.gif",
        Squall: "./heavySnow.gif",
        Clear: "./tropical.gif",
        Clouds: "./clouds.gif",
      };
  
      function updateBackgroundImage(keyword) {
        const weatherGifDisplay = document.querySelector(".container");
        weatherGifDisplay.style.backgroundImage = `url(${weatherGifs[keyword]})`;
      };
      
      function displayWeatherIcon(iconCode) {
        const weatherIcon = document.querySelector(".imgClassIconT");
        weatherIcon.setAttribute('src', getIconUrl(iconCode));
        weatherIcon.classList.add("weather-icon");
      };
  
    return {
      updateBackgroundImage,
      displayWeatherIcon
      // Add more functions to expose
    };
  })();
  
 
  