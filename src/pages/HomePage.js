import React, { useEffect, useState } from 'react';
import { fetchGeoCoordinates, fetchFiveDayForecast, fetchCurrentWeatherSimple } from "../api/weatherApi";
import SearchBar from "../components/SearchBar";
import CurrentWeather from '../components/CurrentWeather';
import Hours from '../components/Hours';
import DailyWeather from '../components/DailyWeather';
import Chatbot from '../components/Chatbot';
import styles from "../styles/HomePage.module.css";

function HomePage({ onNavigate }) {
    const [currentWeather, setCurrentWeather] = useState(null);
    const [hours, setHours] = useState([]);
    const [dailyWeather, setDailyWeather] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCelsius, setIsCelsius] = useState(true);
    const [chatMessages, setChatMessages] = useState([
        { sender: 'bot', text: 'Xin chào! Tôi có thể giúp gì cho bạn về thời tiết hôm nay?' }
    ]);
    const [chatLoading, setChatLoading] = useState(false);

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

    // Hàm xử lý tin nhắn chatbot
    const handleChatMessage = async (userInput) => {
        setChatMessages(prev => [...prev, { sender: 'user', text: userInput }]);
        setChatLoading(true);
        // Xử lý ý định đơn giản: hỏi thời tiết ở đâu đó hoặc tìm kiếm nhanh
        let matched = userInput.match(/(thời tiết|nhiệt độ|trời|mưa|nắng|bao nhiêu|weather|temperature).*?ở\s*(.+)/i);
        let city = null;
        if (matched && matched[2]) {
            city = matched[2].trim();
            // Loại bỏ các từ dư thừa ở cuối
            city = city.replace(/(thế nào|bao nhiêu|không|\?|\.|,|!|\s|như thế nào)+$/gi, '').trim();
        } else if (/hà nội|hn/i.test(userInput)) {
            city = 'Hà Nội';
        } else if (/hồ chí minh|hcm|sài gòn/i.test(userInput)) {
            city = 'Hồ Chí Minh';
        }
        if (city) {
            try {
                const geoData = await fetchGeoCoordinates(city);
                if (geoData && geoData.length > 0) {
                    const lat = geoData[0].lat;
                    const lon = geoData[0].lon;
                    const cityName = geoData[0].name;
                    const currentData = await fetchCurrentWeatherSimple(cityName);
                    // Gợi ý trang phục
                    let tempC = currentData.main.temp;
                    let weatherDesc = currentData.weather[0].description.toLowerCase();
                    let outfit = '';
                    if (weatherDesc.includes('mưa')) {
                        outfit = 'Bạn nhớ mang theo ô hoặc áo mưa.';
                    } else if (tempC < 18) {
                        outfit = 'Trời lạnh, bạn nên mặc áo ấm, khoác ngoài.';
                    } else if (tempC < 25) {
                        outfit = 'Thời tiết mát mẻ, bạn có thể mặc đồ bình thường.';
                    } else if (tempC >= 30) {
                        outfit = 'Trời nóng, bạn nên mặc đồ mát, đội mũ và bôi kem chống nắng.';
                    } else {
                        outfit = 'Bạn có thể mặc đồ thoải mái.';
                    }
                    // Cảnh báo thời tiết
                    let warning = '';
                    if (weatherDesc.includes('bão') || weatherDesc.includes('giông') || weatherDesc.includes('mưa lớn')) {
                        warning = 'Cảnh báo: Thời tiết xấu, bạn nên hạn chế ra ngoài!';
                    } else if (tempC < 15) {
                        warning = 'Cảnh báo: Rét đậm, chú ý giữ ấm!';
                    } else if (tempC > 37) {
                        warning = 'Cảnh báo: Nắng nóng gay gắt, hạn chế ra ngoài vào buổi trưa!';
                    }
                    setChatMessages(prev => [
                        ...prev,
                        { sender: 'bot', text: `Thời tiết hiện tại ở ${cityName}: ${currentData.weather[0].description}, nhiệt độ ${Math.round(currentData.main.temp)}°${isCelsius ? 'C' : 'F'}.\n${outfit}${warning ? `\n${warning}` : ''}` }
                    ]);
                } else {
                    setChatMessages(prev => [
                        ...prev,
                        { sender: 'bot', text: `Xin lỗi, tôi không tìm thấy thông tin thời tiết cho địa điểm "${city}".` }
                    ]);
                }
            } catch (err) {
                setChatMessages(prev => [
                    ...prev,
                    { sender: 'bot', text: 'Xin lỗi, tôi gặp lỗi khi lấy dữ liệu thời tiết. Vui lòng thử lại sau.' }
                ]);
            }
        } else if (/chào|hello|hi|xin chào/i.test(userInput)) {
            setChatMessages(prev => [
                ...prev,
                { sender: 'bot', text: 'Chào bạn! Bạn muốn hỏi về thời tiết ở đâu?' }
            ]);
        } else if (/cảm ơn|thank/i.test(userInput)) {
            setChatMessages(prev => [
                ...prev,
                { sender: 'bot', text: 'Rất vui được giúp bạn!' }
            ]);
        } else if (/uv|tia cực tím|chỉ số uv/i.test(userInput)) {
            setChatMessages(prev => [
                ...prev,
                { sender: 'bot', text: 'UV (tia cực tím) là bức xạ từ mặt trời. Chỉ số UV cao có thể gây hại cho da và mắt. UV 0-2: thấp, 3-5: trung bình, 6-7: cao, 8-10: rất cao, 11+: cực cao. Bạn nên bôi kem chống nắng khi UV > 3.' }
            ]);
        } else if (/độ ẩm|humidity/i.test(userInput)) {
            setChatMessages(prev => [
                ...prev,
                { sender: 'bot', text: 'Độ ẩm là lượng hơi nước trong không khí. Độ ẩm 30-50%: thoải mái, 50-70%: ẩm, >70%: rất ẩm (có thể gây khó chịu). Độ ẩm thấp (<30%) có thể gây khô da.' }
            ]);
        } else if (/áp suất|pressure/i.test(userInput)) {
            setChatMessages(prev => [
                ...prev,
                { sender: 'bot', text: 'Áp suất khí quyển là lực của không khí tác động lên bề mặt. Áp suất cao thường mang thời tiết đẹp, áp suất thấp thường mang mưa, bão. Đơn vị đo là hPa (hectopascal).' }
            ]);
        } else if (/chỉ số chất lượng không khí|aqi|air quality/i.test(userInput)) {
            setChatMessages(prev => [
                ...prev,
                { sender: 'bot', text: 'Chỉ số chất lượng không khí (AQI) đo mức độ ô nhiễm. 0-50: tốt, 51-100: trung bình, 101-150: không tốt cho nhóm nhạy cảm, 151-200: không tốt, 201-300: rất không tốt, >300: nguy hiểm.' }
            ]);
        } else if (/gió mùa|monsoon/i.test(userInput)) {
            setChatMessages(prev => [
                ...prev,
                { sender: 'bot', text: 'Gió mùa là hiện tượng gió thay đổi hướng theo mùa. Ở Việt Nam có gió mùa đông bắc (lạnh, khô) và gió mùa tây nam (nóng, ẩm, mưa). Gió mùa ảnh hưởng lớn đến thời tiết và nông nghiệp.' }
            ]);
        } else if (/el nino|la nina/i.test(userInput)) {
            setChatMessages(prev => [
                ...prev,
                { sender: 'bot', text: 'El Nino và La Nina là hiện tượng khí hậu ở Thái Bình Dương. El Nino: nước biển ấm hơn bình thường, thường gây hạn hán. La Nina: nước biển lạnh hơn, thường gây mưa nhiều và lũ lụt.' }
            ]);
        } else {
            setChatMessages(prev => [
                ...prev,
                { sender: 'bot', text: 'Bạn có thể hỏi tôi về thời tiết ở một thành phố bất kỳ hoặc các thuật ngữ thời tiết như UV, độ ẩm, áp suất, chỉ số chất lượng không khí, gió mùa, El Nino/La Nina.' }
            ]);
        }
        setChatLoading(false);
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
            <Chatbot
                onSendMessage={handleChatMessage}
                messages={chatMessages}
            />
        </div>
    );
}

export default HomePage; 