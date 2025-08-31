import axios from 'axios';

const BACKEND_BASE_URL = 'http://localhost:3000/api';

// Tạo axios instance với cấu hình mặc định
const authApi = axios.create({
    baseURL: BACKEND_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor để thêm token vào header
authApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('weatherAppToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor để xử lý response
authApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token hết hạn hoặc không hợp lệ
            localStorage.removeItem('weatherAppToken');
            localStorage.removeItem('weatherAppUser');
            // Thay vì reload toàn bộ trang, chỉ cần dispatch event để AuthContext xử lý
            window.dispatchEvent(new CustomEvent('auth:logout'));
        }
        return Promise.reject(error);
    }
);

// API functions
export const authApiService = {
    // Đăng ký
    register: async (userData) => {
        try {
            const response = await authApi.post('/auth/register', {
                username: userData.username,
                email: userData.email,
                password: userData.password,
                full_name: userData.full_name
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Có lỗi xảy ra khi đăng ký' };
        }
    },

    // Đăng nhập
    login: async (credentials) => {
        try {
            const response = await authApi.post('/auth/login', {
                username: credentials.username || credentials.email,
                password: credentials.password
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Có lỗi xảy ra khi đăng nhập' };
        }
    },

    // Lấy thông tin user hiện tại
    getCurrentUser: async () => {
        try {
            const response = await authApi.get('/auth/me');
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Có lỗi xảy ra khi lấy thông tin user' };
        }
    },

    // Cập nhật profile
    updateProfile: async (profileData) => {
        try {
            const response = await authApi.put('/auth/profile', profileData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Có lỗi xảy ra khi cập nhật profile' };
        }
    },

    // Đổi mật khẩu
    changePassword: async (passwordData) => {
        try {
            const response = await authApi.put('/auth/change-password', passwordData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Có lỗi xảy ra khi đổi mật khẩu' };
        }
    },

    // Đăng xuất
    logout: async () => {
        try {
            const response = await authApi.post('/auth/logout');
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Có lỗi xảy ra khi đăng xuất' };
        }
    }
};

// Utility functions
export const authUtils = {
    // Lưu token và user data
    saveAuthData: (token, user) => {
        localStorage.setItem('weatherAppToken', token);
        localStorage.setItem('weatherAppUser', JSON.stringify(user));
    },

    // Xóa token và user data
    clearAuthData: () => {
        localStorage.removeItem('weatherAppToken');
        localStorage.removeItem('weatherAppUser');
    },

    // Lấy token
    getToken: () => {
        return localStorage.getItem('weatherAppToken');
    },

    // Lấy user data
    getUser: () => {
        const userData = localStorage.getItem('weatherAppUser');
        if (!userData) return null;
        
        try {
            return JSON.parse(userData);
        } catch (parseError) {
            console.error('Error parsing user data:', parseError);
            localStorage.removeItem('weatherAppUser');
            return null;
        }
    },

    // Kiểm tra user đã đăng nhập chưa
    isAuthenticated: () => {
        return !!localStorage.getItem('weatherAppToken');
    }
};

export default authApiService;
