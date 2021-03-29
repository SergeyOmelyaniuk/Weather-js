import './reset.scss';
import './style.scss';

import { dateList, translate } from './constants';
import {
  getDayForNextDay,
  getDate,
  getRandomNumber,
  getTemperature,
  getStateFromLocalStorage,
  saveStateToLocalStorage,
} from './helpers';
import { createMap, updateMap } from './map';

const refreshButton = document.querySelector('.controls__refresh');

const langMenu = document.querySelector('.controls__lang-menu');
const temperatureMenu= document.querySelector('#temperature');

const searchForm = document.querySelector('.search');
const searchInput = document.querySelector('.search__input');
const searchButton = document.querySelector('.search__button');

const weatherLocation = document.querySelector('.weather__location');
const date = document.querySelector('.weather__date');
const temperatureValue = document.querySelector('.temperature__value');
const temperatureIcon = document.querySelector('.temperature__icon');
const temperatureProperty = document.querySelector('.temperature__property');
const forecast = document.querySelector('.forecast-wrap');

const mapCoordinates = document.querySelector('.map__coordinates');

let state = {
  lang: 'en',
  temperatureType: 'C',
  random: 0,
  city: 'Moscow'
};

function renderLocation(city, country) {
  weatherLocation.textContent = `${city}, ${country}`;
}

function renderTemperature(list, language) {
  const temperature = list[0].main.temp;
  const iconMain = list[0].weather[0].main;
  const weather = list[0].weather[0].description;
  const feelLike = list[0].main.feels_like;
  const wind = list[0].wind.speed;
  const humidity = list[0].main.humidity;

  const currentTemperature = getTemperature(temperature, state.temperatureType);

  temperatureValue.textContent = currentTemperature;
  temperatureIcon.setAttribute('src', `./images/icon/${iconMain}.png`);
  temperatureProperty.innerHTML = `
    <li>${weather}</li>
    <li>${translate[language].weather.feelsLike}: ${Math.round(feelLike)}°</li>
    <li>${translate[language].weather.wind}: ${Math.round(wind)} ${translate[language].weather.speed}</li>
    <li>${translate[language].weather.humidity}: ${Math.round(humidity)}%</li>
  `;
}

function renderForecast(list, language) {
  const forecastFirst = list[8].main.temp;
  const forecastSecond = list[16].main.temp;
  const forecastThird = list[24].main.temp;

  const forecastFirstCurrent = getTemperature(forecastFirst, state.temperatureType);
  const forecastSecondCurrent = getTemperature(forecastSecond, state.temperatureType);
  const forecastThirdCurrent = getTemperature(forecastThird, state.temperatureType);
  
  const iconFirst = list[8].weather[0].main;
  const iconSecond = list[16].weather[0].main;
  const iconThird = list[24].weather[0].main;

  const dayWeekLang = dateList[language].dayOfWeek;

  const today = new Date();
  const nextFirstDay = getDayForNextDay(today, 1);
  const nextSecondDay = getDayForNextDay(today, 2);
  const nextThirdDay = getDayForNextDay(today, 3);

  forecast.innerHTML = `
    <div class="forecast">
        <p class="forecast__day">${dayWeekLang[nextFirstDay]}</p>
        <p class="forecast__temperature">${forecastFirstCurrent}</p>
        <img src="./images/icon/${iconFirst}.png" alt="#" class="forecast__icon">
    </div>
    <div class="forecast">
        <p class="forecast__day">${dayWeekLang[nextSecondDay]}</p>
        <p class="forecast__temperature">${forecastSecondCurrent}</p>
        <img src="./images/icon/${iconSecond}.png" alt="#" class="forecast__icon">
    </div>
    <div class="forecast">
        <p class="forecast__day">${dayWeekLang[nextThirdDay]}</p>
        <p class="forecast__temperature">${forecastThirdCurrent}</p>
        <img src="./images/icon/${iconThird}.png" alt="#" class="forecast__icon">
    </div>
  `;
}

function renderForm(language){
  searchInput.placeholder = translate[language].queryString;
  searchButton.textContent = translate[language].search;
}

function renderMap(language, coord) {
  updateMap(coord);
  mapCoordinates.innerHTML = `
    <p>${translate[language].coordinates.lat}: ${coord.lat}</p>
    <p>${translate[language].coordinates.lon}: ${coord.lon}</p>
  `;
}

function renderPage(data){
  const { city: { name: city, country, coord }, list } = data;
  const { lang: language } = state;

  langMenu.value = language;

  for(let i = 0; i < temperatureMenu.children.length; i++){
    if(temperatureMenu.children[i].value == state.temperatureType){
      temperatureMenu.children[i].classList.add("active");
    } else {
      temperatureMenu.children[i].classList.remove("active");
    }
  }

  renderLocation(city, country);
  renderTemperature(list, language);
  renderForecast(list, language);
  renderForm(language);
  renderMap(language, coord);
}


function getAPIWeather(){
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${state.city}&lang=${state.lang}&units=metric&APPID=c1069da4db0653ed8ebfab62bf57ed6d`, {
    method : 'GET'
  })
  .then(data => data.json())
  .then(data => {
    renderPage(data);
  })
  .catch(err => {
    console.log('error', err);
    searchInput.classList.add('error');
    state.city = 'Брест';
    saveStateToLocalStorage(state);
  });
}

function refreshPicture(){
  const random = getRandomNumber();
  const wrapper = document.querySelector('.wrapper');
  wrapper.style.backgroundImage = `url('./images/background-${random}.jpg')`;
}

document.addEventListener('DOMContentLoaded', ()=> {
  const stateFromLocalStorage = getStateFromLocalStorage();

  if (stateFromLocalStorage) {
    state = stateFromLocalStorage;
  } else {
    saveStateToLocalStorage(state)
  }

  getAPIWeather();
  createMap();
});

refreshButton.addEventListener('click', function(){
  refreshPicture();
})

langMenu.addEventListener('change', function(e){
  state.lang = e.target.value;
  saveStateToLocalStorage(state);
  getAPIWeather();
})

temperatureMenu.addEventListener('click', function(e){
  state.temperatureType = e.target.value;
  saveStateToLocalStorage(state);
  getAPIWeather();
});

searchForm.addEventListener('submit', function(e){
  e.preventDefault();

  if(e.target.city.value.length < 2){
      searchInput.classList.add('error');
      console.log('Меньше 2 символов');
  } else {
      searchInput.classList.remove('error');
      state.city = e.target.city.value;
      saveStateToLocalStorage(state);
      getAPIWeather();
  }

  e.target.city.value = '';
});

setInterval(() => getDate(date, state.lang), 1000);