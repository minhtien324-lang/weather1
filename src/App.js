import { fetchCurrentWeather, fetchWeatherByCoordinates , fetchWeatherForecast, getWeatherIconUrl } from "./api/weatherApi";
import React from "react";
const [weatherData, setWeatherData] = useState(null);
const [forecastData, setForecastData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

const fetchWeatherData = async (city) => {
  setLoading(true);
  setError(null);
  try {
    const geoData = await fetchWeatherByCoordinates(city);
    const current =  await fetchCurrentWeather(geoData.name);
    const forecast = await fetchWeatherForecast(geoData.lon, geoData.lat);

    setWeatherData(current);
    setForecastData(forecast);

  } catch (err) {
    setError("Lỗi khi lấy dữ liệu thời tiết");
    console.error(err);
  }
  useEffect(() => {
    fetchWeatherData('Hanoi'); // Thay 'Hanoi' bằng thành phố bạn muốn lấy dữ liệu
  }, []);
}