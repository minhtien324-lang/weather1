import React from "react";
import { getWeatherIconUrl } from "../api/weatherApi";

function Hours({hourlyData, isCelsius}) {
  if (!hourlyData || hourlyData.length === 0) return null;
  const hoursToDisplay = hourlyData.slice(0, 25);
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-2xl font-bold text-stone-700 mb-4">Dự Báo Theo Giờ</h3>
        <div className="flex overflow-x-auto pb-4 scrollbar-hide">
            {hoursToDisplay.map((hour, index) => {
                const date = new Date(hour.dt * 1000);
                const time = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
                const temp = isCelsius ? Math.round(hour.temp) : Math.round((hour.temp * 9/5) + 32);
                const unit = isCelsius ? '°C' : '°F';

                return (
                    <div key={index} className="flex-none w-28 p-3 text-center bg-blue-50 rounded-lg shadow-sm mx-1.5 flex flex-col items-center justify-center border border-transparent hover:border-blue-300 transition-colors duration-200">
                        <p className="font-semibold text-lg text-gray-700 mb-1">{time}</p>
                        <div className="w-12 h-12 mb-1 flex items-center justify-center">
                            {getWeatherIconUrl(hour.weather[0].icon, "text-4xl")}
                        </div>
                        <p className="font-bold text-xl text-blue-600">{temp}{unit}</p>
                    </div>
                );
            })}
        </div>
    </div>
  );
}

export default Hours;