import OpenWeatherMap from "openweathermap-ts";
import { createApi } from "unsplash-js";
import { Random } from "unsplash-js/dist/methods/photos/types";
// import "whatwg-fetch"

const openWeather = new OpenWeatherMap({
  apiKey: "48c35fc9bf8a18960ac191e236105942",
});

const unsplash = createApi({
  accessKey: "tg10Lza0tJU-atjYY5XUSQxGACuLEBkPcgEiEBR2wRk",
});

type Weather = {
  cityName: string;
  description: string;
  temp: number;
  feelsLike: number;
  icon: string;
  windSpeed: number;
  humidity: number;
  img?: string;
};

//Elements
const searchForm = document.querySelector(".search-form") as HTMLFormElement;
const weatherContainer = document.querySelector(
  ".current-weather-container"
) as HTMLDivElement;

// Data
const savedWeathers: Array<Weather> = [];

const Init = () => {
  let storageRes: string | null = localStorage.getItem("currentWeather");
  if (!storageRes) return;
  let weather = JSON.parse(storageRes) as Weather;
  renderNewWeather(weather);
};

//Event Handlers
const weatherSubmitHandler = async (e: SubmitEvent) => {
  e.preventDefault();
  const searchInput = document.querySelector(".search-bar") as HTMLInputElement;
  const value = searchInput.value;
  const weather = await getWeatherData(value);
  if (!weather) return;
  localStorage.setItem("currentWeather", JSON.stringify(weather));
  searchInput.value = "";
  renderNewWeather(weather);
};

const favoriteButtonClickHandler = () => {};

const savedWeathersClickHandler = () => {};

//Fetchers
const getWeatherData = async (cityName: string) => {
  try {
    const weatherRes = await openWeather.getCurrentWeatherByCityName({
      cityName: cityName,
    });
    const imgRes = await unsplash.photos.getRandom({
      query: cityName,
    });

    let imgURL = "";

    if (imgRes.response && !Array.isArray(imgRes.response)) {
      imgURL = imgRes.response.urls.full;
    }
    console.log(imgRes);
    let weather: Weather = {
      cityName: cityName,
      description: weatherRes.weather[0].description,
      temp: weatherRes.main.temp,
      windSpeed: weatherRes.wind.speed,
      feelsLike: weatherRes.main.feels_like,
      icon: weatherRes.weather[0].icon,
      humidity: weatherRes.main.humidity,
      img: imgURL,
    };
    return weather;
  } catch (err) {
    console.error(err);
  }
};

// Data Handlers
const addNewWeatherToFavorites = () => {
  const localStorageRes = localStorage.getItem("currentWeather");
  const currentWeather = localStorageRes
    ? (JSON.parse(localStorageRes) as Weather)
    : null;
  if (!currentWeather) return;
  savedWeathers.push(currentWeather);
  console.log(savedWeathers);
};

//Render Functions

const renderNewWeather = (weather: Weather) => {
  clearContainer(weatherContainer);

  let weatherTitle = document.createElement("h1");
  let weatherTemp = document.createElement("h2");
  let weatherIcon = document.createElement("img");
  let weatherDesc = document.createElement("div");
  let weatherSpeed = document.createElement("div");
  let weatherHumidity = document.createElement("div");
  let favBtn = document.querySelector(".fav-btn") as HTMLButtonElement;

  favBtn.addEventListener("click", addNewWeatherToFavorites);

  weatherTitle.classList.add("city");
  weatherTemp.classList.add("temp");
  weatherDesc.classList.add("description");
  weatherSpeed.classList.add("wind");
  weatherHumidity.classList.add("humidity");

  weatherTitle.innerText =
    weather.cityName.charAt(0).toUpperCase() + weather.cityName.slice(1);
  weatherTemp.innerText = `${weather.temp} °F`;
  weatherIcon.src = `https://openweathermap.org/img/wn/${weather.icon}.png`;
  weatherDesc.innerText = weather.description;
  weatherSpeed.innerText = `Wind Speed: ${weather.windSpeed}Mph`;
  weatherHumidity.innerText = `Humidity: ${weather.humidity}%`;
  document.body.style.backgroundImage = `url(${weather.img})`;

  weatherContainer.appendChild(weatherTitle);
  weatherContainer.appendChild(weatherTemp);
  weatherContainer.appendChild(weatherIcon);
  weatherContainer.appendChild(weatherSpeed);
  weatherContainer.appendChild(weatherDesc);
  weatherContainer.appendChild(weatherHumidity);
};

const clearContainer = (container: HTMLElement) => {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

const renderFavoriteWeathers = () => {};

searchForm.addEventListener("submit", weatherSubmitHandler);

// let weather = {
//   apiKey: "48c35fc9bf8a18960ac191e236105942",
//   fetchWeather: function (city: string) {
//     fetch(
//       "https://api.openweathermap.org/data/2.5/weather?q=" +
//         city +
//         "&units=imperial&appid=" +
//         this.apiKey
//     )
//       .then((response) => response.json())
//       .then((data) => this.displayWeather(data));
//   },
//   displayWeather: function (data) {
//     const { name } = data;
//     const { icon, description } = data.weather[0];
//     const { temp, humidity } = data.main;
//     const { speed } = data.wind;

//     console.log(name, icon, description, temp, humidity, speed);

//     document.querySelector(".city").innerText = "Weather in " + name;
//     document.querySelector(".icon").src =
//       "https://openweathermap.org/img/wn/" + icon + ".png";

//     document.querySelector(".description").innerText = description;
//     document.querySelector(".temp").innerText = temp + " °F";
//     document.querySelector(".humidity").innerText =
//       "Humidity: " + humidity + "%";

//     document.querySelector(".wind").innerText = "Wind speed: " + speed + " Mph";
//     document.querySelector(".weather").classList.remove("loading");

// document.body.style.backgroundImage =
//   "url('https://source.unsplash.com/2560x1440/? " + name + "')";
//   },
//   search: function () {
//     this.fetchWeather(document.querySelector(".search-bar").value);
//     this.fetchWeather((document.querySelector(".search-bar").value = ""));
//   },
// };

// document.querySelector(".search button").addEventListener("click", function () {
//   weather.search();
// });

// document
//   .querySelector(".search-bar")
//   .addEventListener("keyup", function (event) {
//     if (event.key == "Enter") {
//       weather.search();
//     }
//   });

// weather.fetchWeather("Maine");

Init();
