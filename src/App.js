import { fetchCurrentWeather, fetchWeatherByCoordinates , fetchWeatherForecast, getWeatherIconUrl } from "./api/weatherApi";
import React from "react";
import SearchBar from "./components/searchBar";
import CurrentWeather from "./components/currentsWeather";
import DailyWeather from "./components/daily";
import Hours from "./components/hours";
import { useEffect, useState } from "react";
// const [weatherData, setWeatherData] = useState(null);
// const [forecastData, setForecastData] = useState(null);
// const [loading, setLoading] = useState(true);
// const [error, setError] = useState(null);

// const fetchWeatherData = async (city) => {
//   setLoading(true);
//   setError(null);
//   try {
//     const geoData = await fetchWeatherByCoordinates(city);
//     const current =  await fetchCurrentWeather(geoData.name);
//     const forecast = await fetchWeatherForecast(geoData.lon, geoData.lat);

//     setWeatherData(current);
//     setForecastData(forecast);

//   } catch (err) {
//     setError("Lỗi khi lấy dữ liệu thời tiết");
//     console.error(err);
//   }
//   useEffect(() => {
//     fetchWeatherData('Hanoi'); // Thay 'Hanoi' bằng thành phố bạn muốn lấy dữ liệu
//   }, []);
// }
function App() {
    return (
        // Đây là container chính của toàn bộ ứng dụng
        <div className="min-h-screen bg-stone-50 p-4 md:p-8 flex flex-col items-center">
            {/* Header của ứng dụng */}
            <header className="w-full text-center mb-8">
                <h1 className="text-4xl font-bold text-stone-800">Ứng Dụng Thời Tiết</h1>
            </header>

            {/* Main content area: Đây là nơi bạn sẽ đặt tất cả các component chính */}
            {/* max-w-3xl: giới hạn chiều rộng tối đa, space-y-8: tạo khoảng cách giữa các phần tử theo chiều dọc */}
            <main className="w-full max-w-3xl space-y-8">
                {/* 2. Sử dụng các Components như các thẻ HTML thông thường */}
                <SearchBar />
                <CurrentWeather />
                <Hours />
                <DailyWeather />
            </main>
        </div>
    );
}
export default App;