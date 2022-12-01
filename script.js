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

// let fiveDay1 = document.querySelector("#five-day-1");
// let fiveDay2 = document.querySelector("#five-day-2");
// let fiveDay3 = document.querySelector("#five-day-3");
// let fiveDay4 = document.querySelector("#five-day-4");
// let fiveDay5 = document.querySelector("#five-day-5");
// let fiveDayArr = [fiveDay1, fiveDay2, fiveDay3, fiveDay4, fiveDay5];
let fiveDayCards = document.querySelector("#five-day-cards");

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

        fiveDayCards.innerHTML = "";
        for (let i = 0; i < 5; i++) {
          let day = dayjs()
            .add(i + 1, "day")
            .unix();
          let dayFormat = dayjs.unix(day).format("YYYY-MM-DD HH:00:00");
          // console.log(`printing: ${dayFormat}`);
          for (let j = 0; j < data.list.length; j++) {
            if (dayFormat == data.list[j].dt_txt) {
              let futureForecast = document.createElement("div");
              futureForecast.setAttribute("class", "h-24 w-24 bg-slate-500 text-white");

              let futureDate = document.createElement("p");
              futureDate.textContent = `(${dayjs.unix(day).format("M/DD/YYYY")})`;

              let futureImg = document.createElement("img");
              futureImg.setAttribute("src", "broken_link");

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

// test();
function test() {
  let unix = dayjs().unix();
  let unixFormt = dayjs.unix(unix).format("YYYY-MM-DD HH:00:00");
  console.log(unixFormt);

  let addDay1 = dayjs().add(1, "day").unix();
  let addDayUnixFormat = dayjs.unix(addDay1).format("YYYY-MM-DD HH:00:00");
  console.log(addDayUnixFormat);
}
