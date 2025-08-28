# Hướng dẫn tích hợp Gemini AI vào Weather App

## 1. Cài đặt dependencies

### Backend (E:\weather1sv)
```bash
cd E:\weather1sv
npm install @google/generative-ai
```

### Frontend (E:\weather1)
```bash
cd E:\weather1
# Không cần cài thêm package vì đã có axios
```

## 2. Cấu hình API Key

### Bước 1: Lấy Gemini API Key
1. Truy cập [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Đăng nhập bằng Google account
3. Tạo API key mới
4. Copy API key

### Bước 2: Cấu hình Backend
Tạo file `.env` trong thư mục `E:\weather1sv`:

```env
# Weather API Configuration
WEATHER_API_KEY=your_openweathermap_api_key_here

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=weather_app

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Server Configuration
PORT=3000
NODE_ENV=development
```

## 3. Khởi động ứng dụng

### Backend
```bash
cd E:\weather1sv
npm start
```

### Frontend
```bash
cd E:\weather1
npm start
```

## 4. Tính năng mới

### 🤖 AI Chatbot với Gemini
- **Trợ lý thời tiết thông minh**: Trả lời câu hỏi về thời tiết bằng tiếng Việt
- **Giải thích thuật ngữ**: Giải thích các thuật ngữ khí tượng học
- **Lời khuyên trang phục**: Đưa ra gợi ý trang phục dựa trên thời tiết
- **Cảnh báo thời tiết**: Cảnh báo về thời tiết xấu
- **Context awareness**: Hiểu context từ cuộc trò chuyện và dữ liệu thời tiết hiện tại

### 🎨 UI/UX Improvements
- **AI Status Indicator**: Hiển thị trạng thái kết nối AI
- **Typing Indicator**: Hiển thị khi AI đang xử lý
- **AI Message Styling**: Tin nhắn AI có style riêng biệt
- **Fallback System**: Tự động chuyển sang mode cũ khi AI lỗi

## 5. API Endpoints

### Gemini API
- `POST /api/gemini/chat` - Chat với AI
- `GET /api/gemini/info` - Thông tin về AI model

### Request Format
```json
{
  "message": "Thời tiết Hà Nội hôm nay thế nào?",
  "context": {
    "conversationHistory": [...],
    "totalMessages": 5
  },
  "weatherData": {
    "temp": 25,
    "description": "Trời nắng",
    "humidity": 65,
    "windSpeed": 10,
    "pressure": 1013
  }
}
```

## 6. Troubleshooting

### Lỗi thường gặp

1. **"Lỗi cấu hình API key Gemini"**
   - Kiểm tra GEMINI_API_KEY trong file .env
   - Đảm bảo API key hợp lệ

2. **"Đã vượt quá giới hạn API"**
   - Gemini có giới hạn rate limit
   - Chờ một lúc rồi thử lại

3. **"AI Tạm ngưng"**
   - Kiểm tra kết nối internet
   - Kiểm tra backend có chạy không
   - Kiểm tra console để xem lỗi chi tiết

### Debug Mode
Thêm vào file .env:
```env
DEBUG=true
```

## 7. Tính năng nâng cao

### Custom Prompts
Có thể tùy chỉnh system prompt trong file `src/routes/gemini.js`:

```javascript
let systemPrompt = `Bạn là một trợ lý thời tiết thông minh...`;
```

### Safety Settings
Cấu hình safety settings trong Gemini để đảm bảo an toàn:

```javascript
safetySettings: [
    {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
    }
]
```

## 8. Performance

### Optimization
- **Caching**: Cache responses cho câu hỏi thường gặp
- **Rate Limiting**: Giới hạn số request per user
- **Timeout**: 30 giây timeout cho AI response
- **Fallback**: Tự động chuyển sang mode cũ khi lỗi

### Monitoring
- Log tất cả AI requests
- Monitor response time
- Track error rates
- User feedback collection

## 9. Security

### Best Practices
- Không expose API key trong frontend
- Validate tất cả user inputs
- Rate limiting để tránh abuse
- Sanitize AI responses
- Log security events

### Environment Variables
```env
# Production
NODE_ENV=production
GEMINI_API_KEY=your_production_key

# Development
NODE_ENV=development
GEMINI_API_KEY=your_dev_key
```

## 10. Deployment

### Production Checklist
- [ ] Set NODE_ENV=production
- [ ] Use production Gemini API key
- [ ] Enable HTTPS
- [ ] Set up monitoring
- [ ] Configure rate limiting
- [ ] Test all features
- [ ] Backup database
- [ ] Document API changes

---

**Lưu ý**: Đảm bảo tuân thủ [Google AI Terms of Service](https://ai.google.dev/terms) khi sử dụng Gemini API.
