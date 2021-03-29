import { dateList } from './constants';

export function getDayForNextDay(today, value) {
  let tomorrow = new Date();
  tomorrow.setDate(today.getDate() + value);

  return tomorrow.getDay();
}

export function getStateFromLocalStorage() {
  return JSON.parse(localStorage.getItem('state')) ? JSON.parse(localStorage.getItem('state')) : null;
}

export function saveStateToLocalStorage(state) {
  state.random = getRandomNumber();
  localStorage.setItem('state', JSON.stringify(state));
}

export function getRandomNumber() {
  return Math.floor(Math.random() * Math.floor(6));
}

export function getDate(date, language) {
  const dayWeek = new Date().getDay();
  const day = new Date().getDate();
  const month = new Date().getMonth();
  const hour = new Date().getHours();
  let minute = new Date().getMinutes();
  let sec = new Date().getSeconds();
  
  if (sec < 10) {
      sec = "0" + sec;
  }
  
  if (minute < 10) {
      minute = "0" + minute;
  }
  
  date.innerHTML = `${dateList[language].dayOfWeek[dayWeek]} ${day} ${dateList[language].dateMonth[month]} ${hour}:${minute}:${sec}`;
}

export function getTemperature(temperature, temperatureType) {
  if (temperatureType === 'C') {
    return Math.round(temperature) + '°';
  }

  return Math.round(temperature * 9 / 5 + 32) + '°F';
}