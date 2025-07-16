import axios from 'axios';

// Sử dụng backend API thay vì gọi trực tiếp OpenWeatherMap
const BACKEND_BASE_URL = 'http://localhost:3000/api';

export const fetchGeoCoordinates = async (cityName) => {
    try{
        const response = await axios.get(`${BACKEND_BASE_URL}/search`, {
            params: {
                q: cityName
            }
        });
        return response.data;
    }catch (error) {
        console.error("Error fetching coordinates:", error);
        throw error;
    }
};

export const fetchCurrentWeather = async (lat, lon) => {
    try {
        const response = await axios.get(`${BACKEND_BASE_URL}/weather/coordinates`, {
            params: {
                lat: lat,
                lon: lon
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
        const response = await axios.get(`${BACKEND_BASE_URL}/forecast`, {
            params: {
                lat: lat,
                lon: lon
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
        const response = await axios.get(`${BACKEND_BASE_URL}/weather/city`, {
            params: {
                city: location
            }
        });
        return response.data;
    }catch (error) {
        console.error("Lỗi khi tải thời tiết hiện tại đơn giản:", error.response?.data || error.message);
        throw error;
    }
};

// Thêm function để lấy dự báo theo tên thành phố
export const fetchFiveDayForecastByCity = async (city) => {
    try {
        const response = await axios.get(`${BACKEND_BASE_URL}/forecast`, {
            params: {
                city: city
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching 5-day forecast by city:", error.response?.data || error.message);
        throw error;
    }
};

// Health check function
export const checkBackendHealth = async () => {
    try {
        const response = await axios.get(`${BACKEND_BASE_URL}/health`);
        return response.data;
    } catch (error) {
        console.error("Backend health check failed:", error);
        throw error;
    }
};
