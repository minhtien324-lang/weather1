import React, { createContext, useContext, useState } from 'react';

const WeatherContext = createContext();

export const useWeather = () => {
    const context = useContext(WeatherContext);
    if (!context) {
        throw new Error('useWeather must be used within a WeatherProvider');
    }
    return context;
};

export const WeatherProvider = ({ children }) => {
    const [weatherClass, setWeatherClass] = useState('');

    // Hàm xác định class background dựa trên thời tiết
    const getWeatherClass = (weatherData) => {
        if (!weatherData) return '';
        
        const temp = weatherData.main.temp;
        const weatherDesc = weatherData.weather[0].description.toLowerCase();
        const weatherMain = weatherData.weather[0].main.toLowerCase();
        
        // Kiểm tra thời gian (đêm/ngày) dựa trên icon
        const isNight = weatherData.weather[0].icon.includes('n');
        
        if (isNight) {
            return 'night';
        }
        
        if (weatherDesc.includes('rain') || weatherDesc.includes('drizzle') || weatherDesc.includes('mưa')) {
            return 'rainy';
        }
        
        if (weatherDesc.includes('snow') || weatherDesc.includes('tuyết')) {
            return 'snowy';
        }
        
        if (weatherDesc.includes('storm') || weatherDesc.includes('thunder') || weatherDesc.includes('bão') || weatherDesc.includes('giông')) {
            return 'stormy';
        }
        
        if (weatherDesc.includes('fog') || weatherDesc.includes('mist') || weatherDesc.includes('sương mù')) {
            return 'foggy';
        }
        
        if (weatherDesc.includes('cloud') || weatherDesc.includes('mây')) {
            return 'cloudy';
        }
        
        if (weatherDesc.includes('clear') || weatherDesc.includes('sun') || weatherDesc.includes('nắng') || weatherDesc.includes('trời quang')) {
            return 'sunny';
        }
        
        // Mặc định dựa trên nhiệt độ
        if (temp < 10) {
            return 'cloudy';
        } else if (temp > 25) {
            return 'sunny';
        } else {
            return 'cloudy';
        }
    };

    const updateWeatherBackground = (weatherData) => {
        const newWeatherClass = getWeatherClass(weatherData);
        setWeatherClass(newWeatherClass);
    };

    const value = {
        weatherClass,
        updateWeatherBackground,
        getWeatherClass
    };

    return (
        <WeatherContext.Provider value={value}>
            {children}
        </WeatherContext.Provider>
    );
};

