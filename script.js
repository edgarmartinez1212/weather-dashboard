// global variables
// divs on other side of html
let searchCityBtn = document.querySelector("#search-city-btn");
let searchCityInput = document.querySelector("#search-city-input");
let selectCityDiv = document.querySelector("#select-city-div");

let todayCity = document.querySelector("#today-city");
let todayImage = document.querySelector("#today-image");
let todayTemp = document.querySelector("#today-temp");
let todayWind = document.querySelector("#today-wind");
let todayHumidity = document.querySelector("#today-humidity");

let fiveDay1 = document.querySelector("#five-day-1");
let fiveDay2 = document.querySelector("#five-day-2");
let fiveDay3 = document.querySelector("#five-day-3");
let fiveDay4 = document.querySelector("#five-day-4");
let fiveDay5 = document.querySelector("#five-day-5");
let fiveDayArr = [fiveDay1, fiveDay2, fiveDay3, fiveDay4, fiveDay5];

let keyName = "cities";

// functions
function init() {
  // grab last search result from local storage // display on page
  let citiesArr;
  if (localStorage.getItem(keyName) === null) {
    citiesArr = "";
    localStorage.setItem(keyName, citiesArr);
  } else {
    citiesArr = JSON.parse(localStorage.getItem(keyName));

    // if (citiesArr !== "") {
    if (citiesArr !== "") {
      if (citiesArr.length > 8) {
        for (let i = 0; i < 8; i++) {
          let optionEl = document.createElement("button");
          optionEl.setAttribute("class", "py-2 px-4 bg-gray-400 text-center");
          optionEl.innerHTML = citiesArr[i];
          optionEl.addEventListener("click", search);
          selectCityDiv.append(optionEl);
        }
      } else {
        for (let i = 0; i < citiesArr.length; i++) {
          let optionEl = document.createElement("button");
          optionEl.setAttribute("class", "py-2 px-4 bg-gray-400 text-center");
          optionEl.innerHTML = citiesArr[i];
          optionEl.addEventListener("click", search);
          selectCityDiv.append(optionEl);
        }
      }
    }
    // console.log(citiesArr);
    // }
    // let testArr = [1, 2, 3];
    // localStorage.setItem(keyName, JSON.stringify(testArr));
    // console.log(JSON.parse(localStorage.getItem(keyName)));
  }
}

function optionButton() {}

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
        // let optionEl = document.createElement("button");
        // optionEl.setAttribute("class", "py-2 px-4 bg-gray-400 text-center");
        // optionEl.innerHTML = `${data.city.name}`;
        // optionEl.addEventListener("click", search);
        // selectCityDiv.append(optionEl);

        let kelvin = data.list[0].main.temp;
        let fahrenheit = (kelvin - 273.15) * (9 / 5) + 32;
        console.log(kelvin);
        console.log(fahrenheit);

        todayCity.innerHTML = `${data.city.name} ${data.list[0].dt_txt}`;
        todayImage.setAttribute("src", "broken_link");
        todayTemp.innerHTML = `Temp: ${Math.round(fahrenheit)} &#8457;`;
        todayWind.innerHTML = `Wind: ${data.list[0].wind.speed} MPH`;
        todayHumidity.innerHTML = `Humidity: ${data.list[0].main.humidity} %`;

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
          }
        }

        for (let i = 0; i < fiveDayArr.length; i++) {
          let date = document.createElement("p");
          let img = document.createElement("img");
          let temp = document.createElement("p");
          let wind = document.createElement("p");
          let humidity = document.createElement("p");
        }

        //   all code goes here
        //   build card
        //   temp, wind, humidity
      });
  }
}

// function calls
// event listeners
init();

// search button event listener
searchCityBtn.addEventListener("click", search);
// click on past results // same as search button
