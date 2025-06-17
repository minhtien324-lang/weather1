import React from "react";

function CurrentWeather() {
    return (
        <div className="p-4 bg-white rounded-lg shadow-md flex items-center">
            <h2 className="text-2xl font-bold">Thời tiết hiện tại</h2>
            <p className="text-gray-600 mt-2">Đang tải dữ liệu...</p>
            {   /* Thêm các thành phần hiển thị thời tiết tại đây, ví dụ: nhiệt độ, độ ẩm, tốc độ gió, v.v. */}
        </div>
    )
}

export default CurrentWeather;