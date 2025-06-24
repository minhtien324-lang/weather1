import React from "react";
import { getWeatherIconUrl } from "../api/weatherApi";

function CurrentWeather({ weather }) {
    if(!weather){
        return(
            <div className="flex items-center justify-center h-48 bg-white rounded-xl shadow-md shadow-stone-100 text-stone-600">
                Chưa có dữ liệu thời tiết. Vui lòng tìm kiếm một địa điểm.
            </div>
        );
    }
    const date = new Date(weather.dt * 1000);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('vi-VN', options);
    
    const iconUrl = getWeatherIconUrl(weather.weather[0].icon);
    return (
        <div className="bg-gradient-to-br from-orange-400 to-orange-600 text-white p-6 rounded-xl shadow-lg flex flex-col items-center justify-center text-center max-w-lg mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">{weather.name}, {weather.sys.country}</h2>
            <p className="text-lg mb-4">{formattedDate}</p>
            <div className="flex items-center mb-4">
                <img src={iconUrl} alt={weather.weather[0].description} className="w-24 h-24" />
                <span className="text-6xl md:text-7xl font-light ml-4">{Math.round(weather.main.temp)}°C</span>
            </div>
            <p className="text-xl md:text-2xl font-medium mb-2 capitalize">{weather.weather[0].description}</p>
            <div className="flex space-x-4 text-lg">
                <span>Cảm giác: {Math.round(weather.main.feels_like)}°C</span>
                <span>Độ ẩm: {weather.main.humidity}%</span>
                <span>Gió: {Math.round(weather.wind.speed * 3.6)} km/h</span>
            </div>
        </div>
    );
};

export default CurrentWeather;