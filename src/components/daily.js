import React from "react";
import { getWeatherIcon } from "./weatherIcons";

function DailyWeather({ dailyData, isCelsius }) {
    if (!dailyData || !Array.isArray(dailyData) || dailyData.length === 0) {
        console.warn("daily data is missing, not an array, or empty:", dailyData);
        return null;
    }

    const daysToDisplay = dailyData.slice(0, 7);
    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-2xl font-bold text-stone-700 mb-4">Dự Báo 7 Ngày Tới</h3>
            <div>
                 {daysToDisplay.map((day, index) => {
                    const date = new Date(day.dt * 1000);
                    const dayName = date.toLocaleDateString('vi-VN', { weekday: 'long' });
                    const highTemp = isCelsius ? Math.round(day.temp.max) : Math.round((day.temp.max * 9/5) + 32);
                    const lowTemp = isCelsius ? Math.round(day.temp.min) : Math.round((day.temp.min * 9/5) + 32);
                    const unit = isCelsius ? '°C' : '°F';

                    return (
                        <div key={index} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg shadow-sm border border-transparent hover:border-blue-300 transition-colors duration-200 cursor-pointer">
                            <span className="text-lg font-semibold text-gray-800 w-28 flex-shrink-0">{dayName}</span>
                            <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
                                {getWeatherIcon(day.weather[0].icon, "text-4xl")}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-bold text-blue-600">{highTemp}{unit}</span>
                                <span className="text-xl text-gray-500">{lowTemp}{unit}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default DailyWeather;