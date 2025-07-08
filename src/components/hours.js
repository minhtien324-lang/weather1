import React from "react";
import { getWeatherIcon } from "./WeatherIcons";
import styles from "../styles/Hours.module.css";

function Hours({hourlyData, isCelsius}) {
   if (!hourlyData || !Array.isArray(hourlyData) || hourlyData.length === 0) {
        // console.warn("Hourly data is missing, not an array, or empty:", hourlyData);
        return null;
    }
  const hoursToDisplay = hourlyData.slice(1, 25);
  return (
    <div className={styles.container}>
        <h3 className={styles.title}>Dự Báo Theo Giờ</h3>
        <div className={styles.hoursList}>
            {hoursToDisplay.map((hour, index) => {
                if (!hour || !hour.main || !hour.weather || hour.weather.length === 0) {
                        return null; // Bỏ qua mục không hợp lệ
                }
                const date = new Date(hour.dt * 1000);
                const time = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
                const temp = isCelsius ? Math.round(hour.main.temp) : Math.round((hour.main.temp * 9/5) + 32);
                const unit = isCelsius ? '°C' : '°F';

                return (
                    <div key={index} className={styles.hourItem}>
                        <p className={styles.time}>{time}</p>
                        <div className={styles.weatherIcon}>
                            {getWeatherIcon(hour.weather[0].icon, "text-4xl")}
                        </div>
                        <p className={styles.temperature}>{temp}{unit}</p>
                    </div>
                );
            })}
        </div>
    </div>
  );
}

export default Hours;