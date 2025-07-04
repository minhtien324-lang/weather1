import { fetchGeoCoordinates, fetchFiveDayForecast , fetchCurrentWeatherSimple} from "./api/weatherApi"
import { getWeatherIcon } from "./components/WeatherIcons"
import "./index.css"
import SearchBar from "./components/SearchBar"
import CurrentWeather from './components/CurrentWeather'
import DailyWeather from './components/DailyWeather'
import Hours from './components/Hours'
import React , { useEffect, useState } from 'react'
function App() {
    const[currentWeather, setCurrentWeather] = useState(null);
    const[hours, setHours] = useState([]);
    const[dailyWeather, setDailyWeather] = useState([]);
    const[loading, setLoading] = useState(true);
    const[error, setError] = useState(null);
    const [isCelsius, setIsCelsius] = useState(true);

    const loadWeatherData = async (lat, lon, cityNameForCurrent) => {
        setLoading(true);
        setError(null);
        try{
            const currentData = await fetchCurrentWeatherSimple(cityNameForCurrent);
            console.log("Current Weather Data received:", currentData);
            setCurrentWeather(currentData);

            const fiveDayForecastData = await fetchFiveDayForecast(lat, lon);
            console.log("Five Day Forecast Data received:", fiveDayForecastData);
            setHours(fiveDayForecastData.list.slice(0, 8));

            const dailyMap = new Map();
            fiveDayForecastData.list.forEach(item => {
                const date = new Date(item.dt * 1000);
                const day = date.toLocaleDateString('en-CA');
                if(!dailyMap.has(day)) {
                    dailyMap.set(day, {
                        dt: item.dt,
                        temp: {
                            min: item.main.temp_min,
                            max: item.main.temp_max
                        },
                        weather: item.weather,
                    });
                }else{
                    const existing = dailyMap.get(day);
                    existing.temp.min = Math.min(existing.temp.min, item.main.temp_min);
                    existing.temp.max = Math.max(existing.temp.max, item.main.temp_max);
                }
            });
            const processedDailyData = Array.from(dailyMap.values()).sort((a, b) => a.dt - b.dt);
            setDailyWeather(processedDailyData.slice(0, 7));
            console.log("State updated: dailyForecast", processedDailyData);
        }catch (err) {
            console.error("Lỗi khi tải dữ liệu thời tiết: ", err);
            setError(`Không thể tải dữ liệu thời tiết cho ${cityNameForCurrent}. Vui lòng thử lại sau.`);
            setCurrentWeather(null);
            setHours([]);
            setDailyWeather([]);
        }finally {
            setLoading(false);
            console.log("State updated: loading to false");
        }
    }
    const handleSearch = async(locationInput) => {
        setLoading(true);
        setError(null);
        try {
            let lat, lon, cityName;
            if(typeof locationInput === 'object' && locationInput.lat && locationInput.lon) {
                lat = locationInput.lat;
                lon = locationInput.lon;
                cityName = locationInput.name;
            }else {
                const geoData = await fetchGeoCoordinates(locationInput);
                if(geoData && geoData.Length > 0) {
                    lat = geoData[0].lat;
                    lon = geoData[0].lon;
                    cityName = geoData[0].name;
                }else{
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
        console.log("Current Weather State:", CurrentWeather);
        console.log("Hourly Forecast State:", Hours);
        console.log("Daily Forecast State:", DailyWeather);
        handleSearch("Ha Noi"); // Mặc định tìm kiếm Hà Nội khi ứng dụng khởi động
    }, [CurrentWeather, Hours, DailyWeather]);
    const toggleUnit = () => {
        setIsCelsius(prev => !prev);
    };
    return (
        <div className="min-h-screen bg-stone-50 p-4 flex flex-col items-center">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-6 md:p-10 my-8">
                <header className="text-center mb-6">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-stone-800 tracking-tight">
                        Ứng Dụng Thời Tiết
                    </h1>
                </header>

                <main className="space-y-8">
                    <SearchBar onSearch={handleSearch} />

                    {loading && (
                        <div className="flex justify-center items-center h-48 text-stone-600">
                            <svg className="animate-spin h-8 w-8 text-blue-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="ml-3 text-lg">Đang tải dữ liệu thời tiết...</p>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center" role="alert">
                            <strong className="font-bold">Lỗi!</strong>
                            <span className="block sm:inline ml-2">{error}</span>
                        </div>
                    )}

                    {!loading && !error && CurrentWeather && (
                        <>
                            <CurrentWeather
                                weather={CurrentWeather}
                                onToggleUnit={toggleUnit}
                                isCelsius={isCelsius}
                            />
                            {Hours.length > 0 && (
                                <Hours
                                    hourlyData={Hours}
                                    isCelsius={isCelsius}
                                />
                            )}
                            {DailyWeather.length > 0 && (
                                <DailyWeather
                                    dailyData={DailyWeather}
                                    isCelsius={isCelsius}
                                />
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}
export default App;