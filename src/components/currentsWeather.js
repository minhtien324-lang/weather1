import React from "react";
import { getWeatherIconUrl  } from "../api/weatherApi";
import {getWeatherIcon, HumidityIcon, WindIcon, PresureIcon } from "./weatherIcons";
import { FaEye, FaThermometerHalf } from "react-icons/fa";
function CurrentWeather({ weather, onToggleUnit, isCelsius }) {
    if(!weather) return null;
    const temperature = isCelsius ? weather.main.temp : (weather.main.temp * 9/5) + 32;
    const feelsLike = isCelsius ? weather.main.feels_like : (weather.main.feels_like * 9/5) + 32;
    const unit = isCelsius ? '°C' : '°F';
    const date = new Date(weather.dt * 1000);
    const timeString = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const dateString = date.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const cityName = weather.name ;
    const countryCode = weather.sys.country;
    return (
        <div className="relative bg-gradient-to-br from-blue-50 to-white p-6 md:p-8 rounded-xl shadow-mt text-center">
            <button
                onClick={onToggleUnit}
                className="absolute top-4 right-4 bg-gray-200 text-gray-700
                px-3 py-1 rounded-full text-sm font-semibold hover:bg-gray-300 transition-colors"
                >
                    {isCelsius ? '°F' : '°C'}
            </button>
            <h2 className="text-4xl md:text-5xl font-bold text-stone-800 mb-1 ">
                {cityName}, {countryCode}
            </h2>
            <p className="text-lg text-gray-600 mb-4">{dateString}  {timeString}</p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-6">
                <div className="flex items-center">
                    {getWeatherIconUrl(weather.weather[0].icon, "text-8xl")}
                    <span className="text-7xl md:text8xl font-bold text-blue-600 leading-none ml-4">
                        {Math.round(temperature)}{unit}
                    </span>
                </div>
            </div>
            <div className="text-left md:text-right">
                <p className="text-3xl font-semibold text-gray-700 captitalize">{weather.weather[0].description}</p>
                <p className="text-lg text-gray-500 mt-1">Cảm giác như: {Math.round(feelsLike)}{unit}</p>
            </div>

            <div className=""></div>
        </div>
    );
};

export default CurrentWeather;