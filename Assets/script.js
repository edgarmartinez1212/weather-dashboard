// global variables
// divs on other side of html
let searchCityBtn = document.querySelector("#search-city-btn");
let searchCityInput = document.querySelector("#search-city-input");
let selectCityDiv = document.querySelector("#select-city-div");

let forecastDiv = document.querySelector("#forecast-div");
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
        createRecentCity(8, citiesArr);
      } else {
        createRecentCity(citiesArr.length, citiesArr);
      }
    }
  }
}

// creates the recent city searches
function createRecentCity(length, citiesArr) {
  for (let i = 0; i < length; i++) {
    let optionEl = document.createElement("button");
    optionEl.setAttribute("class", "py-2 px-4 bg-gray-400 text-center rounded");
    optionEl.innerHTML = citiesArr[i];
    optionEl.addEventListener("click", search);
    selectCityDiv.append(optionEl);
  }
}

// populates current city data on large div
function populateCurrentCity(data) {
  let fahrenheit = (data.list[0].main.temp - 273.15) * (9 / 5) + 32;
  let currentDate = dayjs.unix(data.list[0].dt).format("M/DD/YYYY");
  // console.log(dayjs.unix(dayjs().unix()).format("M/DD/YYYY"));
  // console.log("current:");
  // console.log(dayjs.unix(data.list[0].dt).format("M/DD/YYYY"));
  // console.log(data.list[0].wind.speed);

  // console.log("tomorrow");
  // let test = dayjs.unix(dayjs().add(1, "day").unix()).format("M/DD/YYYY");
  // console.log(test);
  // for (let i = 0; i < data.list.length; i++) {
  //   if (dayjs.unix(data.list[i].dt).format("M/DD/YYYY") === test) {
  //     console.log(dayjs.unix(data.list[i].dt).format("M/DD/YYYY") + " = " + data.list[i].dt_txt + " " + data.list[i].wind.speed);
  //     console.log();
  //   }
  // }

  // test = dayjs.unix(dayjs().add(2, "day").unix()).format("M/DD/YYYY");
  // console.log(test);
  // for (let i = 0; i < data.list.length; i++) {
  //   if (dayjs.unix(data.list[i].dt).format("M/DD/YYYY") === test) {
  //     console.log(dayjs.unix(data.list[i].dt).format("M/DD/YYYY") + " = " + data.list[i].dt_txt + " " + data.list[i].wind.speed);
  //     console.log();
  //   }
  // }

  currentCity.innerHTML = `${data.city.name} ${currentDate}`;
  currentImage.setAttribute("src", `https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png`);
  currentTemp.innerHTML = `Temp: ${Math.round(fahrenheit)} &#8457;`;
  currentWind.innerHTML = `Wind: ${data.list[0].wind.speed} MPH`;
  currentHumidity.innerHTML = `Humidity: ${data.list[0].main.humidity} %`;
}

function updateLocalStorage(data) {
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
}

function createFiveDayForecast(data) {
  fiveDayTitle.innerHTML = "5-Day Forecast:";
  fiveDayCards.innerHTML = "";
  for (let i = 0; i < 5; i++) {
    // console.log(dayjs.unix(dayjs().add(i+1, "day").unix()).format("MM/DD/YYYY"));
    let day = dayjs()
      .add(i + 1, "day")
      .unix();
    // let dayFormat = dayjs.unix(day).format("YYYY-MM-DD 00:00:00");
    let dayFormat = dayjs.unix(day).format("YYYY-MM-DD 00:00:00");
    // console.log(dayFormat);
    for (let j = 0; j < data.list.length; j++) {
      // if (dayFormat == data.list[j].dt_txt) {
      if (dayFormat == dayjs.unix(data.list[j].dt).format("YYYY-MM-DD HH:mm:ss")) {
        let futureForecast = document.createElement("div");
        futureForecast.setAttribute("class", "h-48 w-min bg-slate-500 text-white p-3");

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
}

function search(event) {
  // will use city for rest of code
  let city = "";

  // checks where searched city comes from and assigns to city variable
  if (event.target.textContent === "Search") {
    city = searchCityInput.value;
  } else {
    city = event.target.textContent;
  }

  // if (city !== "") {
  let requestUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=17bd19e7810b6efddc6ff67891c18a92`;
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      populateCurrentCity(data);
      updateLocalStorage(data);
      createFiveDayForecast(data);
      // test(data);
      forecastDiv.removeAttribute("class", "hidden");
    });
  // }
}

// function calls
// event listeners
init();
function test(data) {
  //   let day = dayjs()
  //   .add(i + 1, "day")
  //   .unix();
  // let dayFormat = dayjs.unix(day).format("YYYY-MM-DD 00:00:00");

  // get today and find in data
  let day = dayjs().unix();
  let currentDay = dayjs.unix(day).format("YYYY-MM-DD 00:00:00");
  // console.log(currentDay);
  for (let i = 0; i < data.list.length; i++) {
    console.log(data.list[i].dt_txt);
  }
  // console.log(data.list);
  // get next 5 days
}

// search button event listener
searchCityBtn.addEventListener("click", search);
// click on past results // same as search button
