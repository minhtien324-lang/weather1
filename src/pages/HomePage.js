import React, { useEffect, useState } from 'react';
import { fetchGeoCoordinates, fetchFiveDayForecast, fetchCurrentWeather } from "../api/weatherApi";
import SearchBar from "../components/SearchBar";
import CurrentWeather from '../components/CurrentWeather';
import Hours from '../components/Hours';
import DailyWeather from '../components/DailyWeather';
import Chatbot from '../components/Chatbot';
import UserProfile from '../components/UserProfile';
import LoginButton from '../components/LoginButton';
import AiStatusIndicator from '../components/AiStatusIndicator';
import { useWeather } from '../context/WeatherContext';
import { useAuth } from '../context/AuthContext';
import styles from "../styles/HomePage.module.css";

function HomePage({ onNavigate }) {
    const [currentWeather, setCurrentWeather] = useState(null);
    const [hourlyForecast, setHourlyForecast] = useState([]);
    const [dailyForecast, setDailyForecast] = useState([]);
    const [error, setError] = useState(null);
    const [isCelsius, setIsCelsius] = useState(true);
    const [chatMessages, setChatMessages] = useState([
        { sender: 'bot', text: 'Xin chào! Tôi là trợ lý AI, có thể giúp bạn với nhiều câu hỏi khác nhau. Bạn có thể hỏi về thời tiết, toán học, dịch thuật, giáo dục, công nghệ và nhiều chủ đề khác. Bạn muốn hỏi gì?' }
    ]);
    const [isChatbotOpen, setIsChatbotOpen] = useState(() => {
        // Lấy trạng thái từ localStorage nếu có
        const saved = localStorage.getItem('chatbotOpen');
        return saved ? JSON.parse(saved) : false;
    }); // State để quản lý việc mở/đóng chatbot
    const [chatLoading, setChatLoading] = useState(false);
    // eslint-disable-next-line no-unused-vars
    
    const { updateWeatherBackground } = useWeather();
    const { user } = useAuth();

    const loadWeatherData = async (lat, lon, cityNameForCurrent) => {
        try {
            const currentData = await fetchCurrentWeather(lat, lon);
            setCurrentWeather(currentData);
            
            // Cập nhật background toàn cục dựa trên thời tiết
            updateWeatherBackground(currentData);

            const fiveDayForecastData = await fetchFiveDayForecast(lat, lon);
            
            // Xử lý dữ liệu dự báo theo ngày
            const dailyMap = new Map();
            if (fiveDayForecastData.list && Array.isArray(fiveDayForecastData.list)) {
                fiveDayForecastData.list.forEach(item => {
                    if (!item || !item.main || !item.weather || !Array.isArray(item.weather) || item.weather.length === 0) {
                        return; // Bỏ qua item không hợp lệ
                    }
                    const date = new Date(item.dt * 1000);
                    const day = date.toLocaleDateString('en-CA');
                    if (!dailyMap.has(day)) {
                        dailyMap.set(day, {
                            dt: item.dt,
                            temp: {
                                min: item.main.temp_min || 0,
                                max: item.main.temp_max || 0
                            },
                            weather: item.weather,
                        });
                    } else {
                        const existing = dailyMap.get(day);
                        existing.temp.min = Math.min(existing.temp.min, item.main.temp_min || 0);
                        existing.temp.max = Math.max(existing.temp.max, item.main.temp_max || 0);
                    }
                });
            }
            const processedDailyData = Array.from(dailyMap.values()).sort((a, b) => a.dt - b.dt);
            setDailyForecast(processedDailyData.slice(0, 7));

            // Xử lý dữ liệu dự báo theo giờ
            if (fiveDayForecastData.list && Array.isArray(fiveDayForecastData.list)) {
                setHourlyForecast(fiveDayForecastData.list.slice(0, 24));
            } else {
                setHourlyForecast([]);
            }

            setError(null);
        } catch (err) {
            console.error('Error loading weather data:', err);
            setError('Không thể tải dữ liệu thời tiết. Vui lòng thử lại.');
        }
    };

    const handleSearch = async (locationInput) => {
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
                    return;
                }
            }
            await loadWeatherData(lat, lon, cityName);
        } catch (err) {
            console.error("Lỗi khi tìm kiếm vị trí: ", err);
            setError("Không tìm thấy vị trí. Vui lòng kiểm tra lại.");
        }
    };

    // Hàm xử lý tin nhắn chatbot - mở rộng để trả lời mọi câu hỏi
    const handleChatMessage = async (userInput, sender = 'user') => {
        setChatMessages(prev => [...prev, { 
            sender, 
            text: userInput,
            timestamp: new Date().toISOString()
        }]);
        
        // Nếu là tin nhắn từ AI, không cần xử lý thêm
        if (sender === 'ai') {
            return;
        }
        
        setChatLoading(true);
        
        // Kiểm tra xem có phải câu hỏi về thời tiết không
        const isWeatherQuestion = /thời tiết|weather|nhiệt độ|temperature|mưa|rain|nắng|sunny|gió|wind|độ ẩm|humidity/i.test(userInput);
        
        if (isWeatherQuestion) {
            // Xử lý câu hỏi về thời tiết như trước
            let city = null;
            
            // Tìm kiếm nhanh - chỉ cần nhắn tên thành phố
            const cityOnlyPattern = /^[a-zA-ZÀ-ỹ\s]+$/;
            if (cityOnlyPattern.test(userInput.trim()) && userInput.trim().length > 1) {
                const cleanInput = userInput.trim().toLowerCase();
                if (!/^(thời tiết|nhiệt độ|trời|mưa|nắng|bao nhiêu|weather|temperature|chào|hello|hi|xin chào|cảm ơn|thank|uv|độ ẩm|áp suất|chỉ số|gió mùa|el nino|la nina)/.test(cleanInput)) {
                    city = userInput.trim();
                }
            }
            
            // Xử lý ý định đơn giản: hỏi thời tiết ở đâu đó
            if (!city) {
                let matched = userInput.match(/(thời tiết|nhiệt độ|trời|mưa|nắng|bao nhiêu|weather|temperature).*?ở\s*(.+)/i);
                if (matched && matched[2]) {
                    city = matched[2].trim();
                    city = city.replace(/(thế nào|bao nhiêu|không|\?|\.|,|!|\s)+$/gi, '').trim();
                } else if (/hà nội|hn/i.test(userInput)) {
                    city = 'Hà Nội';
                } else if (/hồ chí minh|hcm|sài gòn/i.test(userInput)) {
                    city = 'Hồ Chí Minh';
                }
            }
            
            if (city) {
                try {
                    const geoData = await fetchGeoCoordinates(city);
                    if (geoData && geoData.length > 0) {
                        const lat = geoData[0].lat;
                        const lon = geoData[0].lon;
                        const cityName = geoData[0].name;
                        const currentData = await fetchCurrentWeather(lat, lon);
                        
                        // Cập nhật background toàn cục dựa trên thời tiết của thành phố được hỏi
                        updateWeatherBackground(currentData);
                        
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
                        
                        let responseText = `Thời tiết hiện tại ở ${cityName}: ${currentData.weather[0].description}, nhiệt độ ${Math.round(currentData.main.temp)}°${isCelsius ? 'C' : 'F'}.\n${outfit}`;
                        if (warning) {
                            responseText += `\n${warning}`;
                        }
                        
                        setChatMessages(prev => [
                            ...prev,
                            { sender: 'bot', text: responseText }
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
            } else {
                // Câu hỏi về thời tiết nhưng không xác định được thành phố
                setChatMessages(prev => [
                    ...prev,
                    { sender: 'bot', text: 'Bạn có thể hỏi tôi về thời tiết ở một thành phố cụ thể. Ví dụ: "Thời tiết Hà Nội" hoặc "Nhiệt độ TP.HCM"' }
                ]);
            }
        } else {
            // Câu hỏi không phải về thời tiết - sử dụng AI để trả lời
            try {
                // Tạo context cho AI
                const context = {
                    conversationHistory: chatMessages.slice(-10).map(msg => ({
                        sender: msg.sender,
                        text: msg.text,
                        timestamp: msg.timestamp
                    })),
                    totalMessages: chatMessages.length,
                    sessionStart: chatMessages[0]?.timestamp || new Date().toISOString(),
                    currentWeather: currentWeather
                };
                
                // Gọi AI để trả lời
                const response = await fetch('http://localhost:3000/api/gemini/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: userInput,
                        context: context,
                        weatherData: currentWeather
                    })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        setChatMessages(prev => [
                            ...prev,
                            { sender: 'ai', text: data.message }
                        ]);
                    } else {
                        throw new Error(data.error || 'AI không thể xử lý tin nhắn');
                    }
                } else {
                    throw new Error('Lỗi kết nối AI');
                }
            } catch (error) {
                console.error('AI processing error:', error);
                // Fallback response
                const fallbackResponse = getFallbackResponse(userInput);
                setChatMessages(prev => [
                    ...prev,
                    { sender: 'bot', text: fallbackResponse }
                ]);
            }
        }
        
        setChatLoading(false);
    };

    // Fallback response cho các câu hỏi không phải thời tiết
    const getFallbackResponse = (userInput) => {
        const input = userInput.toLowerCase();
        
        if (/chào|hello|hi|xin chào/i.test(input)) {
            return 'Chào bạn! Tôi là trợ lý AI, có thể giúp bạn với nhiều câu hỏi khác nhau. Bạn muốn hỏi gì?';
        }
        
        if (/cảm ơn|thank/i.test(input)) {
            return 'Rất vui được giúp bạn! Nếu có câu hỏi gì khác, đừng ngại hỏi nhé!';
        }

        if (/toán|math|tính|calculator/i.test(input)) {
            return 'Tôi có thể giúp bạn với các phép tính toán học. Hãy hỏi cụ thể phép tính bạn muốn thực hiện!';
        }

        if (/dịch|translate|tiếng anh|english/i.test(input)) {
            return 'Tôi có thể giúp bạn dịch thuật giữa các ngôn ngữ. Hãy cho tôi biết từ hoặc câu bạn muốn dịch!';
        }

        if (/giải thích|explain|what is/i.test(input)) {
            return 'Tôi có thể giải thích nhiều khái niệm khác nhau. Hãy hỏi cụ thể về điều bạn muốn tìm hiểu!';
        }

        if (/học|study|education/i.test(input)) {
            return 'Tôi có thể giúp bạn học tập và nghiên cứu nhiều chủ đề khác nhau. Bạn muốn học về gì?';
        }

        if (/công nghệ|technology|tech/i.test(input)) {
            return 'Tôi có kiến thức về nhiều lĩnh vực công nghệ. Hãy hỏi cụ thể về công nghệ bạn quan tâm!';
        }

        if (/sức khỏe|health|y tế/i.test(input)) {
            return 'Tôi có thể cung cấp thông tin chung về sức khỏe, nhưng hãy tham khảo ý kiến bác sĩ cho các vấn đề y tế cụ thể.';
        }

        if (/du lịch|travel|địa điểm/i.test(input)) {
            return 'Tôi có thể giúp bạn tìm hiểu về các địa điểm du lịch, văn hóa và thông tin hữu ích cho chuyến đi!';
        }
        
        return 'Tôi có thể giúp bạn với nhiều chủ đề như thời tiết, toán học, dịch thuật, giáo dục, công nghệ và nhiều lĩnh vực khác. Hãy hỏi cụ thể về điều bạn muốn biết!';
    };

    useEffect(() => {
        handleSearch("Ha Noi"); // Mặc định tìm kiếm Hà Nội khi ứng dụng khởi động
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // eslint-disable-next-line no-unused-vars
    const toggleUnit = () => {
        setIsCelsius(prev => !prev);
    };

    return (
        <div className={styles.container}>
            <div className={styles.mainContent}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Weather App</h1>
                    <div className={styles.headerControls}>
                        <button 
                            className={styles.tempToggle}
                            onClick={() => setIsCelsius(!isCelsius)}
                        >
                            °{isCelsius ? 'F' : 'C'}
                        </button>
                        <AiStatusIndicator />
                        <UserProfile />
                        <LoginButton onNavigate={onNavigate} />
                    </div>
                </header>

                {/* Banner đăng nhập tùy chọn */}
                {!user && (
                    <div className={styles.loginBanner}>
                        <div className={styles.bannerContent}>
                            <span className={styles.bannerText}>
                                🌟 Đăng nhập để lưu lịch sử tìm kiếm và tùy chỉnh trải nghiệm
                            </span>
                            <button 
                                className={styles.bannerLoginBtn}
                                onClick={() => onNavigate('auth')}
                            >
                                Đăng nhập
                            </button>
                        </div>
                    </div>
                )}

                <SearchBar onSearch={handleSearch} />

                {error && (
                    <div className={styles.error}>
                        {error}
                    </div>
                )}

                {currentWeather && (
                    <>
                        <CurrentWeather 
                            weather={currentWeather} 
                            isCelsius={isCelsius}
                            onNavigate={onNavigate}
                        />
                        <Hours 
                            hourlyData={hourlyForecast} 
                            isCelsius={isCelsius}
                        />
                        <DailyWeather 
                            dailyData={dailyForecast} 
                            isCelsius={isCelsius}
                        />
                    </>
                )}
            </div>
                                                   <Chatbot
                              onSendMessage={handleChatMessage}
                              messages={chatMessages}
                              currentWeather={currentWeather}
                              isOpen={isChatbotOpen}
                              isLoading={chatLoading}
                              onToggle={() => {
                                  const newState = !isChatbotOpen;
                                  setIsChatbotOpen(newState);
                                  localStorage.setItem('chatbotOpen', JSON.stringify(newState));
                              }}
                          />
        </div>
    );
}

export default HomePage; 