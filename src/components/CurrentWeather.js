import React from "react";
import {getWeatherIcon, HumidityIcon, WindIcon, PresureIcon } from "./WeatherIcons";
import { FaEye } from "react-icons/fa";
import styles from "../styles/CurrentWeather.module.css";

function CurrentWeather({ weather, onToggleUnit, isCelsius }) {
    if (!weather || !weather.main || !weather.weather || !Array.isArray(weather.weather) || weather.weather.length === 0) {
        console.warn("Weather data is missing or invalid:", weather);
        return null; 
    }
    
    const { temp, feels_like, humidity, pressure } = weather.main;
    const windSpeed = weather.wind?.speed || 0;
    const visibility = weather.visibility || 0;
    const description = weather.weather[0]?.description || '';
    const iconCode = weather.weather[0]?.icon || '01d';

    const temperature = isCelsius ? temp : (temp * 9/5) + 32;
    const feelsLike = isCelsius ? feels_like : (feels_like * 9/5) + 32;
    const unit = isCelsius ? '°C' : '°F';
    const date = new Date(weather.dt * 1000);
    const timeString = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const dateString = date.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const cityName = weather.name || 'Unknown City';
    const countryCode = weather.sys?.country || '';
    return (
        <div className={styles.container}>
            <button
                onClick={onToggleUnit}
                className={styles.toggleButton}
                >
                    {isCelsius ? '°F' : '°C'}
            </button>
            <h2 className={styles.cityName}>
                {cityName}, {countryCode}
            </h2>
            <p className={styles.dateTime}>{dateString}  {timeString}</p>

            <div className={styles.weatherMain}>
                <div className={styles.weatherIcon}>
                    {getWeatherIcon(weather.weather[0].icon, "text-8xl")}
                </div>
                <span className={styles.temperature}>
                    {Math.round(temperature)}{unit}
                </span>
            </div>
            <div className={styles.weatherDescription}>
                <p className={styles.description}>{weather.weather[0].description}</p>
                <p className={styles.feelsLike}>Cảm giác như: {Math.round(feelsLike)}{unit}</p>
            </div>

            <div className={styles.weatherDetails}>
                <div className={styles.detailItem}>
                    <HumidityIcon className={styles.detailIcon} />
                    <span className={styles.detailValue}>{weather.main.humidity}%</span>
                    <span className={styles.detailLabel}>Độ ẩm</span>
                </div>
                <div className={styles.detailItem}>
                    <WindIcon className={styles.detailIcon} />
                    <span className={styles.detailValue}>{Math.round(weather.wind.speed * 3.6)} km/h</span>
                    <span className={styles.detailLabel}>Tốc độ gió</span>
                </div>
                 <div className={styles.detailItem}>
                    <PresureIcon className={styles.detailIcon} />
                    <span className={styles.detailValue}>{weather.main.pressure} hPa</span>
                    <span className={styles.detailLabel}>Áp suất</span>
                </div>
                <div className={styles.detailItem}>
                    <FaEye className={styles.detailIcon} />
                    <span className={styles.detailValue}>{weather.visibility / 1000} km</span>
                    <span className={styles.detailLabel}>Tầm nhìn</span>
                </div>
            </div>
        </div>
    );
};

export default CurrentWeather;