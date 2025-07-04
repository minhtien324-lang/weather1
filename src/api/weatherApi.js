import axios from 'axios';

const API_KEY = process.env.REACT_APP_OPEN_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_BASE_URL = 'http://api.openweathermap.org/geo/1.0';

export const fetchGeoCoordinates = async (cityName) => {
    try{
        const response = await axios.get(`${GEO_BASE_URL}/direct`, {
            params: {
                q: cityName,
                limit: 5,
                appid: API_KEY,
            }
        });
        return response.data;
    }catch (error) {
        console.error("Error fetching weather by coordinates:", error);
        throw error;
    }
};

export const fetchCurrentWeather = async (lat, lon) => {
    try {
        const response = await axios.get(`${BASE_URL}/weather`, {
            params: {
                lat: lat,
                lon: lon,
                appid: API_KEY,
                units: 'metric',
                lang: 'vi'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching current weather:", error);
        throw error;
    }
};

export const fetchFiveDayForecast = async (lat, lon) => {
    try {
        const response = await axios.get(`${BASE_URL}/forecast`, {
            params: {
                lat: lat,
                lon: lon,
                appid: API_KEY,
                units: 'metric',
                lang: 'vi'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching 5-day forecast:", error.response?.data || error.message);
        throw error;
    }
};

export const fetchCurrentWeatherSimple = async (location) => {
    try{
        const response = await axios.get(`${BASE_URL}/weather`, {
            params: {
                q: location,
                appid: API_KEY,
                units: 'metric',
                lang: 'vi'
            }
        });
        return response.data;
    }catch (error) {
        console.error("Lỗi khi tải thời tiết hiện tại đơn giản:", error.response?.data || error.message);
        throw error;
    }
};
