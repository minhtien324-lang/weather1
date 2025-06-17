import React from "react";

function DailyWeather() {
    return (
        <div className="p-4 bg-white rounded-lg shadow-md flex items-center">
            <h2 className="text-2xl font-bold">Dự báo thời tiết hàng ngày</h2>
            <div className="mt-4">
                {/* Giả sử bạn có dữ liệu dự báo thời tiết hàng ngày */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <span className="font-semibold">Thứ 6</span>
                    <span>🌤️</span>
                    <span>28°C / 20°C</span>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-md">
                    <span className="font-semibold">Thứ Bảy</span>
                    <span>🌧️</span>
                    <span>26°C / 19°C</span>
                    {/* Thêm các thành phần hiển thị thời tiết hàng ngày tại đây, ví dụ: biểu tượng thời tiết, nhiệt độ, v.v. */}
                </div>
            </div>
        </div>
    )
}

export default DailyWeather;