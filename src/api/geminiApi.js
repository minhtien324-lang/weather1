import axios from 'axios';

const BACKEND_BASE_URL = 'http://localhost:3000/api';

// Tạo axios instance cho Gemini API
const geminiApi = axios.create({
    baseURL: `${BACKEND_BASE_URL}/gemini`,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 giây timeout cho AI response
});

// API functions
export const geminiApiService = {
    // Chat với Gemini
    chat: async (message, context = {}, weatherData = null) => {
        try {
            const response = await geminiApi.post('/chat', {
                message,
                context,
                weatherData
            });
            return response.data;
        } catch (error) {
            console.error('Gemini API error:', error);
            throw error.response?.data || { 
                error: 'Có lỗi xảy ra khi giao tiếp với AI' 
            };
        }
    },

    // Lấy thông tin về Gemini
    getInfo: async () => {
        try {
            const response = await geminiApi.get('/info');
            return response.data;
        } catch (error) {
            console.error('Gemini info error:', error);
            throw error.response?.data || { 
                error: 'Không thể lấy thông tin AI' 
            };
        }
    },

    // Kiểm tra trạng thái Gemini
    checkStatus: async () => {
        try {
            const response = await geminiApi.get('/info');
            return { 
                status: 'connected', 
                data: response.data 
            };
        } catch (error) {
            return { 
                status: 'disconnected', 
                error: error.message 
            };
        }
    }
};

// Utility functions
export const geminiUtils = {
    // Format weather data cho Gemini
    formatWeatherData: (weatherData) => {
        if (!weatherData || !weatherData.main) return null;
        
        return {
            temp: weatherData.main.temp,
            description: weatherData.weather?.[0]?.description || '',
            humidity: weatherData.main.humidity,
            windSpeed: weatherData.wind?.speed ? Math.round(weatherData.wind.speed * 3.6) : 0,
            pressure: weatherData.main.pressure,
            city: weatherData.name,
            country: weatherData.sys?.country
        };
    },

    // Tạo context cho conversation với khả năng đa dạng
    createContext: (messages, maxHistory = 10) => {
        if (!messages || !Array.isArray(messages)) return {};
        
        const conversationHistory = messages
            .slice(-maxHistory)
            .map(msg => ({
                sender: msg.sender,
                text: msg.text,
                timestamp: msg.timestamp || new Date().toISOString()
            }));

        // Phân tích chủ đề cuộc trò chuyện
        const topics = analyzeConversationTopics(messages);
        
        return {
            conversationHistory,
            totalMessages: messages.length,
            sessionStart: messages[0]?.timestamp || new Date().toISOString(),
            conversationTopics: topics,
            userPreferences: extractUserPreferences(messages)
        };
    },

    // Validate message
    validateMessage: (message) => {
        if (!message || typeof message !== 'string') {
            return { valid: false, error: 'Tin nhắn không hợp lệ' };
        }
        
        const trimmed = message.trim();
        if (trimmed.length === 0) {
            return { valid: false, error: 'Tin nhắn không được để trống' };
        }
        
        if (trimmed.length > 1000) {
            return { valid: false, error: 'Tin nhắn quá dài (tối đa 1000 ký tự)' };
        }
        
        return { valid: true, message: trimmed };
    }
};

// Hàm phân tích chủ đề cuộc trò chuyện
function analyzeConversationTopics(messages) {
    const topics = {
        weather: 0,
        math: 0,
        translation: 0,
        education: 0,
        technology: 0,
        health: 0,
        travel: 0,
        general: 0
    };

    const keywords = {
        weather: /thời tiết|weather|nhiệt độ|temperature|mưa|rain|nắng|sunny|gió|wind|độ ẩm|humidity/i,
        math: /toán|math|tính|calculate|phép tính|equation|formula|số|number/i,
        translation: /dịch|translate|tiếng anh|english|tiếng việt|vietnamese|ngôn ngữ|language/i,
        education: /học|study|education|giáo dục|kiến thức|knowledge|bài học|lesson/i,
        technology: /công nghệ|technology|tech|máy tính|computer|internet|app|software|programming/i,
        health: /sức khỏe|health|y tế|medical|bệnh|disease|thuốc|medicine/i,
        travel: /du lịch|travel|địa điểm|place|thành phố|city|quốc gia|country/i
    };

    messages.forEach(msg => {
        if (msg.sender === 'user') {
            let foundTopic = false;
            for (const [topic, pattern] of Object.entries(keywords)) {
                if (pattern.test(msg.text)) {
                    topics[topic]++;
                    foundTopic = true;
                }
            }
            if (!foundTopic) {
                topics.general++;
            }
        }
    });

    return topics;
}

// Hàm trích xuất sở thích người dùng
function extractUserPreferences(messages) {
    const preferences = {
        language: 'vi', // Mặc định tiếng Việt
        topics: [],
        communicationStyle: 'friendly'
    };

    // Phát hiện ngôn ngữ ưa thích
    const englishMessages = messages.filter(msg => 
        msg.sender === 'user' && /[a-zA-Z]/.test(msg.text) && !/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/.test(msg.text)
    );

    if (englishMessages.length > messages.filter(msg => msg.sender === 'user').length * 0.5) {
        preferences.language = 'en';
    }

    // Phát hiện chủ đề ưa thích
    const topics = analyzeConversationTopics(messages);
    const sortedTopics = Object.entries(topics)
        .filter(([topic, count]) => count > 0 && topic !== 'general')
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([topic]) => topic);

    preferences.topics = sortedTopics;

    return preferences;
}

export default geminiApiService;
