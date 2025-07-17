# Hướng dẫn Setup Weather App

## Cấu trúc dự án
```
weather1/          # Frontend (React)
weather1sv/        # Backend (Express.js)
```

## Bước 1: Setup Backend

1. **Chuyển đến thư mục backend:**
```bash
cd ../weather1sv
```

2. **Cài đặt dependencies:**
```bash
npm install
```

3. **Tạo file .env:**
```bash
# Tạo file .env trong thư mục weather1sv
PORT=3000
WEATHER_API_KEY=your_openweathermap_api_key_here
```

4. **Lấy API key từ OpenWeatherMap:**
   - Đăng ký tại: https://openweathermap.org/api
   - Tạo tài khoản miễn phí
   - Lấy API key và thêm vào file `.env`

5. **Chạy backend:**
```bash
npm run dev
```

Backend sẽ chạy tại: `http://localhost:3000`

## Bước 2: Setup Frontend

1. **Chuyển đến thư mục frontend:**
```bash
cd ../weather1
```

2. **Cài đặt dependencies (nếu chưa có):**
```bash
npm install
```

3. **Chạy frontend:**
```bash
npm start
```

Frontend sẽ chạy tại: `http://localhost:3001`

## Bước 3: Kiểm tra kết nối

1. **Kiểm tra backend:**
   - Mở: http://localhost:3000/api/health
   - Nên thấy: `{"status":"OK","message":"Weather API đang hoạt động"}`

2. **Kiểm tra frontend:**
   - Mở: http://localhost:3001
   - Góc trên bên phải sẽ hiển thị trạng thái kết nối backend

## Troubleshooting

### Backend không kết nối được:
- Kiểm tra API key trong file `.env`
- Đảm bảo backend đang chạy trên port 3000
- Kiểm tra console để xem lỗi

### Frontend không kết nối được backend:
- Đảm bảo backend đang chạy
- Kiểm tra CORS settings
- Kiểm tra URL trong `weatherApi.js`

### Lỗi API:
- Kiểm tra API key có hợp lệ không
- Kiểm tra quota của OpenWeatherMap API
- Xem logs trong console

## API Endpoints

Backend cung cấp các endpoints:
- `GET /api/health` - Health check
- `GET /api/weather/coordinates?lat={lat}&lon={lon}` - Thời tiết theo tọa độ
- `GET /api/weather/city?city={city}` - Thời tiết theo thành phố
- `GET /api/forecast?city={city}` - Dự báo 5 ngày
- `GET /api/search?q={term}` - Tìm kiếm thành phố

## Development

### Backend Development:
```bash
cd weather1sv
npm run dev  # Auto restart khi có thay đổi
```

### Frontend Development:
```bash
cd weather1
npm start    # Auto reload khi có thay đổi
```

### Test API:
```bash
cd weather1sv
npm test     # Chạy test API
``` 