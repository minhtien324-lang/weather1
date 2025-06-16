import axios from 'axios';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const fetchCurrentWeather = async (location) => {
    try {
        let url = `${BASE_URL}/weather?q=${location}&appid=${API_KEY}&units=metric&lang=vi`;
        if(location.lat && location.lon) {
            url = `${BASE_URL}/weather?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}&units=metric&lang=vi`;
        }
        const response = await axios.get(url);
        return response.data;
    }catch (error) {
        console.error("Lỗi khi lấy dữ liệu thời tiết hiện tại: ", error);
        throw error;
    }
};

export const fetchWeatherForecast = async (lon, lat) => {
    try {
        const url = `${BASE_URL}/onecall?lat=${lat}&lon=${lon}&exclude=minutely,arlets&appid=${API_KEY}&units=metric&lang=vi`;
        const response = await axios.get(url);
        return response.data;
    }catch (error) {
        console.error("Lỗi khi lấy dữ liệu dự báo thời tiết: ", error.response ? error.response.data : error.message);
        throw error;
    }
};

export const fetchWeatherByCoordinates = async (city) => {
    try {
        const url = `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric&lang=vi`;
        const response = await axios.get(url);
        const {lat, lon} = response.data.coord;
        const name = response.data.name;
        return  {
            name,
            lat,
            lon
        };
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu thời tiết theo tọa độ: ", error);
        throw error;
    }
};

export const getWeatherIconUrl = (iconCode) => {
    if (!iconCode) return '';
    return `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
};
