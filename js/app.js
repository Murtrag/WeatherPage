import {ModuleControl, WeekForecast} from './module_control.js';

document.addEventListener("DOMContentLoaded", ()=>{

// Dodaj Miasto button
const addCity = document.querySelector("#add-city");
addCity.addEventListener("click", ()=>{
	document.querySelector('.module__form').removeAttribute('hidden');
});

document.body.addEventListener('click', el =>{
	if (
		el.srcElement.classList.contains('btn--close') ||
		el.srcElement.parentElement.classList.contains('btn--close')){
		el.target.closest('.module').setAttribute("hidden", true);
	};
});


// get ip geo location info
(async ()=>{

	let init = new ModuleControl('module__weather');
	init.toggleLoading();
	let weekWeather = new WeekForecast(); 
	let city = await weekWeather.getCurrentCity();
	const position = await weekWeather.getGeoLocation(city);
	const tdDetails = await weekWeather.getTodaysWeather(position[0], position[1]);
	init.changeInfo(city, tdDetails.temperature);
	init.changeDetails(tdDetails.pressure, tdDetails.humidity, tdDetails.windSpeed);
	init.changeForecast(
			await weekWeather.getForecast(position[0], position[1])
		);
	init.toggleLoading();
})();

const form = document.querySelector('.find-city')
form.querySelector('button').addEventListener('click', el => {
	el.preventDefault();
	const city = form.querySelector('#search').value;

(async ()=>{
	let init = new ModuleControl();
	init.toggleLoading();
	let weekWeather = new WeekForecast(); 
	const position = await weekWeather.getGeoLocation(city);
	const tdDetails = await weekWeather.getTodaysWeather(position[0], position[1]);
	init.changeInfo(city, tdDetails.temperature);
	init.changeDetails(tdDetails.pressure, tdDetails.humidity, tdDetails.windSpeed);
	init.changeForecast(
			await weekWeather.getForecast(position[0], position[1])
		);
	init.toggleLoading();
})();
	
});

});
