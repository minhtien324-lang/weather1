import React from "react";
import { getWeatherIcon } from "./WeatherIcons";
import styles from "../styles/DailyWeather.module.css";

function DailyWeather({ dailyData, isCelsius }) {
    if (!dailyData || !Array.isArray(dailyData) || dailyData.length === 0) {
        // Dữ liệu dailyData không hợp lệ hoặc rỗng
        return null;
    }

    const daysToDisplay = dailyData.slice(0, 7);
    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Dự Báo 7 Ngày Tới</h3>
            <div className={styles.daysList}>
                 {daysToDisplay.map((day, index) => {
                    if (!day || !day.temp || !day.weather || !Array.isArray(day.weather) || day.weather.length === 0) {
                        return null; // Bỏ qua mục không hợp lệ
                    }
                    const date = new Date(day.dt * 1000);
                    const dayName = date.toLocaleDateString('vi-VN', { weekday: 'long' });
                    const highTemp = isCelsius ? Math.round(day.temp.max || 0) : Math.round(((day.temp.max || 0) * 9/5) + 32);
                    const lowTemp = isCelsius ? Math.round(day.temp.min || 0) : Math.round(((day.temp.min || 0) * 9/5) + 32);
                    const unit = isCelsius ? '°C' : '°F';

                    return (
                        <div key={index} className={styles.dayItem}>
                            <span className={styles.dayName}>{dayName}</span>
                            <div className={styles.weatherIcon}>
                                {getWeatherIcon(day.weather[0].icon, "text-4xl")}
                            </div>
                            <div className={styles.temperatureContainer}>
                                <span className={styles.highTemp}>{highTemp}{unit}</span>
                                <span className={styles.lowTemp}>{lowTemp}{unit}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default DailyWeather;
