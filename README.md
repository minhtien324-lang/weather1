# 🌤️ Weather App với AI Chatbot Mở rộng

## Backend API tests (Postman/Newman)

Run backend endpoint tests with Postman collection provided in `postman/`.

### Quick start
1. Install Newman CLI globally (one-time):
   ```bash
   npm i -g newman
   ```
2. Run tests:
   ```bash
   npm run api:test
   ```
   This executes the collection against `http://localhost:3000/api`.

### Files
- `postman/WeatherApp.postman_collection.json`
- `postman/WeatherApp.postman_environment.json`

Adjust environment variables (username/password) to match your backend.

Ứng dụng thời tiết thông minh với chatbot AI có thể trả lời **mọi câu hỏi**, không chỉ riêng về thời tiết!

## 🌟 Tính năng chính

### 🤖 AI Chatbot Đa năng
- **Thời tiết thông minh**: Trả lời chi tiết về thời tiết, gợi ý trang phục, cảnh báo thời tiết xấu
- **Toán học**: Thực hiện các phép tính từ cơ bản đến phức tạp
- **Dịch thuật**: Dịch giữa nhiều ngôn ngữ khác nhau
- **Giáo dục**: Giải thích khái niệm, lịch sử, địa lý, văn học
- **Công nghệ**: Thông tin về lập trình, phần mềm, internet
- **Sức khỏe**: Thông tin dinh dưỡng, tập luyện, phòng bệnh
- **Du lịch**: Địa điểm, văn hóa, ẩm thực, kinh nghiệm
- **Và nhiều chủ đề khác!**

### 🌤️ Thời tiết
- **Dự báo thời tiết**: 5 ngày với chi tiết theo giờ
- **Thời tiết hiện tại**: Nhiệt độ, độ ẩm, gió, áp suất
- **Tìm kiếm địa điểm**: Hỗ trợ tìm kiếm toàn cầu
- **Background động**: Thay đổi theo thời tiết
- **Đơn vị linh hoạt**: Chuyển đổi °C/°F

### 👤 Hệ thống người dùng
- **Đăng ký/Đăng nhập**: Tài khoản cá nhân
- **Lịch sử tìm kiếm**: Lưu trữ các địa điểm đã tìm
- **Hồ sơ người dùng**: Quản lý thông tin cá nhân

## 🚀 Cách sử dụng

### Khởi động ứng dụng
```bash
# Cài đặt dependencies
npm install

# Chạy ứng dụng
npm start
```

### Sử dụng chatbot
1. **Hỏi thời tiết**: "Thời tiết Hà Nội", "Nhiệt độ TP.HCM"
2. **Tính toán**: "Tính 15 + 27", "Căn bậc hai của 144"
3. **Dịch thuật**: "Dịch 'hello world' sang tiếng Việt"
4. **Học tập**: "Giải thích về blockchain", "DNA là gì?"
5. **Và nhiều câu hỏi khác!**

## 🛠️ Công nghệ sử dụng

### Frontend
- **React.js**: Framework chính
- **CSS Modules**: Styling
- **Context API**: State management
- **Axios**: HTTP client

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **Google Gemini AI**: AI chatbot
- **OpenWeatherMap API**: Dữ liệu thời tiết

### AI Integration
- **Gemini API**: Xử lý câu hỏi đa dạng
- **Context Awareness**: Hiểu ngữ cảnh cuộc trò chuyện
- **Fallback System**: Tự động chuyển sang chế độ cũ khi AI lỗi

## 📁 Cấu trúc dự án

```
src/
├── api/                 # API services
│   ├── authApi.js      # Authentication
│   ├── geminiApi.js    # AI chatbot
│   └── weatherApi.js   # Weather data
├── components/         # React components
│   ├── Chatbot.js     # AI chatbot
│   ├── CurrentWeather.js
│   ├── DailyWeather.js
│   └── ...
├── context/           # React Context
│   ├── AuthContext.js
│   └── WeatherContext.js
├── pages/            # Page components
├── styles/           # CSS modules
└── utils/            # Utility functions
```

## 🔧 Cấu hình

### Environment Variables
Tạo file `.env` trong thư mục backend:
```env
WEATHER_API_KEY=your_openweathermap_api_key
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=weather_app
```

### API Keys cần thiết
1. **OpenWeatherMap API**: Lấy tại [openweathermap.org](https://openweathermap.org/api)
2. **Google Gemini API**: Lấy tại [makersuite.google.com](https://makersuite.google.com/app/apikey)

## 📚 Tài liệu chi tiết

- **[CHATBOT_GUIDE.md](./CHATBOT_GUIDE.md)**: Hướng dẫn sử dụng chatbot chi tiết
- **[GEMINI_SETUP.md](./GEMINI_SETUP.md)**: Cài đặt và cấu hình AI
- **[SETUP.md](./SETUP.md)**: Hướng dẫn setup dự án

## 🎯 Tính năng nổi bật

### AI Status Indicator
- Hiển thị trạng thái kết nối AI real-time
- Tự động phát hiện và thông báo sự cố
- Fallback system khi AI không hoạt động

### Smart Context
- AI nhớ cuộc trò chuyện trước đó
- Hiểu sở thích và ngôn ngữ người dùng
- Đưa ra câu trả lời phù hợp với ngữ cảnh

### Responsive Design
- Giao diện đẹp mắt, hiện đại
- Tương thích mọi thiết bị
- Animation mượt mà

## 🆘 Hỗ trợ

### Lỗi thường gặp
1. **AI không trả lời**: Kiểm tra kết nối internet và backend
2. **Thời tiết không hiển thị**: Kiểm tra API key OpenWeatherMap
3. **Lỗi đăng nhập**: Kiểm tra cấu hình database

### Liên hệ
- Báo cáo lỗi: Tạo issue trên GitHub
- Đề xuất tính năng: Gửi pull request
- Hỗ trợ kỹ thuật: Kiểm tra tài liệu trong thư mục docs/



**Lưu ý**: Đây là dự án demo, vui lòng không sử dụng cho mục đích thương mại mà không có sự cho phép.

## 📄 License

MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.
