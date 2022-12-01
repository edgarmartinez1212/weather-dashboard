// global variables
// divs on other side of html
let searchCityBtn = document.querySelector("#search-city-btn");
let searchCityInput = document.querySelector("#search-city-input");
let selectCityDiv = document.querySelector("#select-city-div");

let currentCity = document.querySelector("#current-city");
let currentImage = document.querySelector("#current-image");
let currentTemp = document.querySelector("#current-temp");
let currentWind = document.querySelector("#current-wind");
let currentHumidity = document.querySelector("#current-humidity");

let fiveDayTitle = document.querySelector("#five-day-title");
let fiveDayCards = document.querySelector("#five-day-cards");

let keyName = "cities";

// functions
function init() {
  // grab last search result from local storage // display on page
  let citiesArr;
  if (localStorage.getItem(keyName) === null) {
    citiesArr = [];
    localStorage.setItem(keyName, citiesArr);
  } else {
    citiesArr = JSON.parse(localStorage.getItem(keyName));

    if (citiesArr !== null) {
      if (citiesArr.length > 8) {
        createCityOption(8, citiesArr);
        // for (let i = 0; i < 8; i++) {
        //   let optionEl = document.createElement("button");
        //   optionEl.setAttribute("class", "py-2 px-4 bg-gray-400 text-center rounded");
        //   optionEl.innerHTML = citiesArr[i];
        //   optionEl.addEventListener("click", search);
        //   selectCityDiv.append(optionEl);
        // }
      } else {
        createCityOption(citiesArr.length, citiesArr);
        // for (let i = 0; i < citiesArr.length; i++) {
        //   let optionEl = document.createElement("button");
        //   optionEl.setAttribute("class", "py-2 px-4 bg-gray-400 text-center rounded");
        //   optionEl.innerHTML = citiesArr[i];
        //   optionEl.addEventListener("click", search);
        //   selectCityDiv.append(optionEl);
        // }
      }
    }
  }
}

function createCityOption(length, citiesArr) {
  for (let i = 0; i < length; i++) {
    let optionEl = document.createElement("button");
    optionEl.setAttribute("class", "py-2 px-4 bg-gray-400 text-center rounded");
    optionEl.innerHTML = citiesArr[i];
    optionEl.addEventListener("click", search);
    selectCityDiv.append(optionEl);
  }
}

function search(event) {
  // set assign variable to value of text box on html page
  let city = "";

  if (event.target.textContent === "Search") {
    city = searchCityInput.value;
  } else {
    city = event.target.textContent;
  }

  if (city !== "") {
    let requestUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=17bd19e7810b6efddc6ff67891c18a92`;
    fetch(requestUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);

        let kelvin = data.list[0].main.temp;
        let fahrenheit = (kelvin - 273.15) * (9 / 5) + 32;
        console.log(kelvin);
        console.log(fahrenheit);

        currentCity.innerHTML = `${data.city.name} ${data.list[0].dt_txt.split(" ")[0]}`;
        currentImage.setAttribute("src", `https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png`);
        currentTemp.innerHTML = `Temp: ${Math.round(fahrenheit)} &#8457;`;
        currentWind.innerHTML = `Wind: ${data.list[0].wind.speed} MPH`;
        currentHumidity.innerHTML = `Humidity: ${data.list[0].main.humidity} %`;

        let citiesArr;
        if (localStorage.getItem(keyName) === "") {
          citiesArr = [];
          citiesArr.push(data.city.name);
          localStorage.setItem(keyName, JSON.stringify(citiesArr));
        } else {
          citiesArr = JSON.parse(localStorage.getItem(keyName));
          if (!citiesArr.includes(data.city.name)) {
            citiesArr.unshift(data.city.name);
            localStorage.setItem(keyName, JSON.stringify(citiesArr));
          } else {
            let tempArr = [];
            for (let i = 0; i < citiesArr.length; i++) {
              if (citiesArr[i] !== data.city.name) {
                tempArr.push(citiesArr[i]);
              }
            }
            citiesArr = tempArr;
            citiesArr.unshift(data.city.name);
            localStorage.setItem(keyName, JSON.stringify(citiesArr));
          }
        }

        fiveDayTitle.innerHTML = "5-Day Forecast:";
        fiveDayCards.innerHTML = "";
        for (let i = 0; i < 5; i++) {
          let day = dayjs()
            .add(i + 1, "day")
            .unix();
          let dayFormat = dayjs.unix(day).format("YYYY-MM-DD 00:00:00");
          console.log(dayFormat);
          for (let j = 0; j < data.list.length; j++) {
            if (dayFormat == data.list[j].dt_txt) {
              let futureForecast = document.createElement("div");
              futureForecast.setAttribute("class", "h-48 w-1/6 bg-slate-500 text-white p-3");

              let futureDate = document.createElement("p");
              futureDate.textContent = `(${dayjs.unix(day).format("M/DD/YYYY")})`;

              let futureImg = document.createElement("img");
              futureImg.setAttribute("src", `https://openweathermap.org/img/wn/${data.list[j].weather[0].icon}@2x.png`);

              let futureTemp = document.createElement("p");
              let futureKelvin = data.list[j].main.temp;
              let futureFahrenheit = (futureKelvin - 273.15) * (9 / 5) + 32;
              futureTemp.innerHTML = `Temp: ${Math.round(futureFahrenheit)} &#8457;`;

              let futureWind = document.createElement("p");
              futureWind.textContent = `Wind: ${data.list[j].wind.speed} MPH`;

              let futureHumidity = document.createElement("p");
              futureHumidity.textContent = `Humidity: ${data.list[j].main.humidity} %`;

              futureForecast.append(futureDate, futureImg, futureTemp, futureWind, futureHumidity);
              fiveDayCards.append(futureForecast);
            }
          }
        }
      });
  }
}

// function calls
// event listeners
init();

// search button event listener
searchCityBtn.addEventListener("click", search);
// click on past results // same as search button
