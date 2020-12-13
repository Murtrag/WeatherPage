class ModuleControl{
	constructor(elementId){
		if(elementId){
		this.element = document.querySelector(`.${elementId}`);
		}else{
		this.oldElement = document.querySelector('.module__weather');
		this.element = this.oldElement.cloneNode(true);
		document.querySelector('.container#app').insertBefore(
			this.element,
			this.oldElement,
		)
		}
		this.element.removeAttribute("hidden");
	}
	toggleLoading = ()=>{
		const bodyClass = document.body.classList;
		if (!bodyClass.length){
			document.body.classList.add('loading');
		}else{
			document.body.classList.remove('loading');
		}
	};
	changeInfo = (city, temperature) => {
		this.element.querySelector('.city__name').innerText = city;
		this.element.querySelector('.weather__info .temperature').innerText = `${temperature}°C`;
	}
	changeDetails = (presure, humidity, wind) => {
		this.element.querySelector('.weather__details .pressure__value').innerText = `${presure} hPa`;
		this.element.querySelector('.weather__details .humidity__value').innerText = `${humidity} %`;
		this.element.querySelector('.weather__details .wind-speed__value').innerText = `${wind} m/s`;
	}
	changeForecast = (forecast)=>{
		const days = this.element.querySelectorAll('.weather__forecast li');
		days.forEach((day, index) => {
			const dayForecast = forecast[index]; 
			day.querySelector('.day').innerText = dayForecast.day;
			const tempAvg = ( ( dayForecast.temperatureMax + dayForecast.temperatureMin ) / 2 ).toFixed(2);
			day.querySelector('.temperature').innerText = tempAvg;
			const urlSplit = day.querySelector('img').src.split('/');
			const newPath = urlSplit.splice(0, urlSplit.length-1).join('/')+"/"+dayForecast.icon+".svg"
			console.log(day.querySelector('img').src);
			day.querySelector('img').src = newPath; 
			day.title = `${dayForecast.title}
temp max: ${dayForecast.temperatureMax}
temp min: ${dayForecast.temperatureMin}`; 

		});

	}
}


class WeekForecast{

constructor(cityName){
	this.antiCors = "https://cors-anywhere.herokuapp.com/";
	this.antiCors = "";
};
getCurrentCity = async ()=>{
	const resp = await fetch(`${this.antiCors}http://ip-api.com/json/`);
	const curentLocation = await resp.json();
	return curentLocation.city
};
getGeoLocation = async (cityName)=>{
	const locations = await fetch(`${this.antiCors}https://graphhopper.com/api/1/geocode?key=76949e71-3a1c-417f-8914-fa1d2bfc0d07&q=${cityName}`);
	const locationsJson = await locations.json();

	const resp = await fetch(`${this.antiCors}http://ip-api.com/json/`);
	const curentLocation = await resp.json();
	const matchLocation = locationsJson.hits.find(function(el) {
	  return el.country.includes(curentLocation.country);
	});
	return [matchLocation.point.lat, matchLocation.point.lng]
};
getForecast = async (lat, lng) =>{
	const daysTrans = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] 
	const forecast = await fetch(`${this.antiCors}https://api.darksky.net/forecast/d06bda83af7b3cb2e02f64dddab41c4a/${lat},${lng}?units=si&lang=pl`);
	const forecastJson = await forecast.json();
	const forecastFormat = forecastJson.daily.data.map(day=>{
		console.log(forecastFormat);
		return { 
			day: daysTrans[(new Date(day.time*1000)).getDay()],
			temperatureMax: day.temperatureMax,
			temperatureMin: day.temperatureMin,
			title: day.summary,
			icon: day.icon,
		}
	});
	return forecastFormat	
};
getTodaysWeather = async(lat, lng) => {
	const forecast = await fetch(`${this.antiCors}https://api.darksky.net/forecast/d06bda83af7b3cb2e02f64dddab41c4a/${lat},${lng}?units=si&lang=pl`);
	const forecastJson = await forecast.json();
	console.log(forecastJson);
	return {
		"temperature": forecastJson.currently.temperature,
		"pressure": forecastJson.currently.pressure,
		"humidity": forecastJson.currently.humidity,
		"windSpeed": forecastJson.currently.windSpeed,
		"icon": forecastJson.currently.icon,
	}	

};


}





export {ModuleControl, WeekForecast};
