import React, { useEffect, useState } from 'react';
import { fetchGeoCoordinates, fetchFiveDayForecast, fetchCurrentWeatherSimple } from "../api/weatherApi";
import SearchBar from "../components/SearchBar";
import CurrentWeather from '../components/CurrentWeather';
import Hours from '../components/Hours';
import DailyWeather from '../components/DailyWeather';
import styles from "../styles/HomePage.module.css";

function HomePage({ onNavigate }) {
    const [currentWeather, setCurrentWeather] = useState(null);
    const [hours, setHours] = useState([]);
    const [dailyWeather, setDailyWeather] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCelsius, setIsCelsius] = useState(true);

    const loadWeatherData = async (lat, lon, cityNameForCurrent) => {
        setLoading(true);
        setError(null);
        try {
            const currentData = await fetchCurrentWeatherSimple(cityNameForCurrent);
            setCurrentWeather(currentData);

            const fiveDayForecastData = await fetchFiveDayForecast(lat, lon);
            setHours(fiveDayForecastData.list.slice(0, 8));

            const dailyMap = new Map();
            fiveDayForecastData.list.forEach(item => {
                const date = new Date(item.dt * 1000);
                const day = date.toLocaleDateString('en-CA');
                if (!dailyMap.has(day)) {
                    dailyMap.set(day, {
                        dt: item.dt,
                        temp: {
                            min: item.main.temp_min,
                            max: item.main.temp_max
                        },
                        weather: item.weather,
                    });
                } else {
                    const existing = dailyMap.get(day);
                    existing.temp.min = Math.min(existing.temp.min, item.main.temp_min);
                    existing.temp.max = Math.max(existing.temp.max, item.main.temp_max);
                }
            });
            const processedDailyData = Array.from(dailyMap.values()).sort((a, b) => a.dt - b.dt);
            setDailyWeather(processedDailyData.slice(0, 7));
        } catch (err) {
            console.error("Lỗi khi tải dữ liệu thời tiết: ", err);
            setError(`Không thể tải dữ liệu thời tiết cho ${cityNameForCurrent}. Vui lòng thử lại sau.`);
            setCurrentWeather(null);
            setHours([]);
            setDailyWeather([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (locationInput) => {
        setLoading(true);
        setError(null);
        try {
            let lat, lon, cityName;
            if (typeof locationInput === 'object' && locationInput.lat && locationInput.lon) {
                lat = locationInput.lat;
                lon = locationInput.lon;
                cityName = locationInput.name;
            } else {
                const geoData = await fetchGeoCoordinates(locationInput);
                if (geoData && geoData.length > 0) {
                    lat = geoData[0].lat;
                    lon = geoData[0].lon;
                    cityName = geoData[0].name;
                } else {
                    setError("Không tìm thấy vị trí. Vui lòng kiểm tra lại.");
                    setLoading(false);
                    return;
                }
            }
            await loadWeatherData(lat, lon, cityName);
        } catch (err) {
            console.error("Lỗi khi tìm kiếm vị trí: ", err);
            setError("Không tìm thấy vị trí. Vui lòng kiểm tra lại.");
            setLoading(false);
        }
    };

    useEffect(() => {
        handleSearch("Ha Noi"); // Mặc định tìm kiếm Hà Nội khi ứng dụng khởi động
    }, []);

    const toggleUnit = () => {
        setIsCelsius(prev => !prev);
    };

    return (
        <div className={styles.container}>
            <div className={styles.mainContent}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Ứng Dụng Thời Tiết</h1>
                    <p className={styles.subtitle}>Xem thời tiết hiện tại và dự báo</p>
                </header>

                <main className={styles.main}>
                    <SearchBar onSearch={handleSearch} />

                    {loading && (
                        <div className={styles.loadingContainer}>
                            <svg className={styles.loadingSpinner} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className={styles.loadingText}>Đang tải dữ liệu thời tiết...</p>
                        </div>
                    )}

                    {error && (
                        <div className={styles.errorContainer} role="alert">
                            <strong className={styles.errorText}>Lỗi!</strong>
                            <span className={styles.errorMessage}>{error}</span>
                        </div>
                    )}

                    {!loading && !error && currentWeather && (
                        <>
                            <CurrentWeather
                                weather={currentWeather}
                                onToggleUnit={toggleUnit}
                                isCelsius={isCelsius}
                            />
                            {hours.length > 0 && (
                                <Hours
                                    hourlyData={hours}
                                    isCelsius={isCelsius}
                                />
                            )}
                            {dailyWeather.length > 0 && (
                                <DailyWeather
                                    dailyData={dailyWeather}
                                    isCelsius={isCelsius}
                                />
                            )}
                        </>
                    )}
                </main>

                <div className={styles.navigation}>
                    <button 
                        className={styles.navButton} 
                        onClick={() => onNavigate('search')}
                    >
                        Tìm Kiếm Mới
                    </button>
                    <button 
                        className={styles.navButton} 
                        onClick={() => onNavigate('forecast')}
                    >
                        Xem Dự Báo Chi Tiết
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HomePage; 