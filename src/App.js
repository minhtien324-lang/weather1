import { fetchCurrentWeather, fetchWeatherByCoordinates , fetchWeatherForecast, getWeatherIconUrl } from "./api/weatherApi";
import React from "react";
import "./index.css";
import SearchBar from "./components/searchBar";
import CurrentWeather from "./components/currentsWeather";
import DailyWeather from "./components/daily";
import Hours from "./components/hours";
import { useEffect, useState } from "react";
function App() {
    const[currentWeather, setCurrentWeather] = useState(null);
    const[weatherData, setWeatherData] = useState(null);
    const[loading, setLoading] = useState(true);
    const[error, setError] = useState(null);
    const loadWeatherData = async (location) => {
        setLoading(true);
        setError(null);
        try {
           const geoData = await fetchWeatherByCoordinates(location);
           const current = await fetchCurrentWeather(geoData.name);
           setCurrentWeather(current);

        } catch (err) {
            console.error("Lỗi khi lấy dữ liệu thời tiết: ", err);
            if (err.response && err.response.status === 404) {
                setError(`Không tìm thấy "${location}". Vui lòng kiểm tra lại tên thành phố.`);
            }else {
                setError("Không thể lấy dữ liệu thời tiết. Vui lòng thử lại sau.");
            }
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadWeatherData("Lạng Sơn");
    }, []);
    return (
        <div className="min-h-screen bg-stone-50 p-4 md:p-8 flex flex-col items-center">
            <header className="w-full text-center mb-8">
                <h1 className="text-4xl font-bold text-stone-800">Ứng Dụng Thời Tiết</h1>
            </header>

            <main className="w-full max-w-3xl space-y-8">
                <SearchBar onSearch={loadWeatherData} />

                {loading && (
                    <div className="flex justify-center items-center h-48 text-stone-600">
                        Đang tải dữ liệu...
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center" role="alert">
                        <strong className="font-bold">Lỗi!</strong>
                        <span className="block sm:inline ml-2">{error}</span>
                    </div>
                )}

                {!loading && !error && currentWeather && (
                    
                    <CurrentWeather weather={currentWeather} />
                )}

                {/** Hiển thị các thành phần Hours và DailyWeather chỉ khi dữ liệu thời tiết đã được tải thành công */}
                {!loading && !error && currentWeather && (
                    <>
                        <Hours />
                        <DailyWeather />
                    </>
                )}
            </main>
        </div>
    );
}
export default App;