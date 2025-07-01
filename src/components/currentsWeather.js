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

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8 text-gray-700">
                <div className="flex flex-col items-center bg-blue-50 p-4 rounded-lg shadow-sm">
                    <HumidityIcon />
                    <span className="font-bold text-lg">{weather.main.humidity}%</span>
                    <span className="text-sm text-gray-500">Độ ẩm</span>
                </div>
                <div className="flex flex-col items-center bg-blue-50 p-4 rounded-lg shadow-sm">
                    <WindIcon />
                    <span className="font-bold text-lg">{Math.round(weather.wind.speed * 3.6)} km/h</span>
                    <span className="text-sm text-gray-500">Tốc độ gió</span>
                </div>
                 <div className="flex flex-col items-center bg-blue-50 p-4 rounded-lg shadow-sm">
                    <PresureIcon /> {/* Icon áp suất cần được tùy chỉnh hoặc tìm icon phù hợp hơn */}
                    <span className="font-bold text-lg">{weather.main.pressure} hPa</span>
                    <span className="text-sm text-gray-500">Áp suất</span>
                </div>
                <div className="flex flex-col items-center bg-blue-50 p-4 rounded-lg shadow-sm">
                    <FaEye className="text-3xl text-blue-500" />
                    <span className="font-bold text-lg">{weather.visibility / 1000} km</span>
                    <span className="text-sm text-gray-500">Tầm nhìn</span>
                </div>
                {/* Các thông số khác từ One Call API nếu cần (vd: chỉ số UV, điểm sương) */}
                {weather.clouds && (
                    <div className="flex flex-col items-center bg-blue-50 p-4 rounded-lg shadow-sm">
                        <FaThermometerHalf className="text-3xl text-blue-500" /> {/* Dùng tạm */}
                        <span className="font-bold text-lg">{weather.clouds.all}%</span>
                        <span className="text-sm text-gray-500">Độ che phủ</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CurrentWeather;