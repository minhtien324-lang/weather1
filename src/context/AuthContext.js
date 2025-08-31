import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApiService, authUtils } from '../api/authApi';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Kiểm tra xem có user đã đăng nhập trong localStorage không
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = authUtils.getToken();
                if (token) {
                    // Kiểm tra token có hợp lệ không bằng cách gọi API
                    const userData = await authApiService.getCurrentUser();
                    const formattedUser = {
                        ...userData.user,
                        name: userData.user.full_name || userData.user.name || userData.user.username || 'User'
                    };
                    setUser(formattedUser);
                } else {
                    // Fallback cho localStorage nếu không có token
                    const savedUser = localStorage.getItem('weatherAppUser');
                    if (savedUser) {
                        try {
                            const parsedUser = JSON.parse(savedUser);
                            const formattedUser = {
                                ...parsedUser,
                                name: parsedUser.full_name || parsedUser.name || parsedUser.username || 'User'
                            };
                            setUser(formattedUser);
                        } catch (parseError) {
                            console.error('Error parsing saved user data:', parseError);
                            localStorage.removeItem('weatherAppUser');
                        }
                    }
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                // Xóa dữ liệu không hợp lệ
                authUtils.clearAuthData();
            } finally {
                setLoading(false);
            }
        };

        checkAuth();

        // Lắng nghe event logout từ interceptor
        const handleLogout = () => {
            setUser(null);
        };

        window.addEventListener('auth:logout', handleLogout);
        
        return () => {
            window.removeEventListener('auth:logout', handleLogout);
        };
    }, []);

    const login = async (email, password) => {
        try {
            const response = await authApiService.login({ email, password });
            
            // Đảm bảo user data có đầy đủ thông tin
            const userData = {
                ...response.user,
                name: response.user.full_name || response.user.name || response.user.username || 'User'
            };
            
            // Lưu token và user data
            authUtils.saveAuthData(response.token, userData);
            setUser(userData);
            
            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return { 
                success: false, 
                message: error.error || 'Có lỗi xảy ra khi đăng nhập' 
            };
        }
    };

    const register = async (name, email, password, confirmPassword) => {
        // Kiểm tra mật khẩu xác nhận
        if (password !== confirmPassword) {
            return { success: false, message: 'Mật khẩu xác nhận không khớp' };
        }

        // Kiểm tra độ dài mật khẩu
        if (password.length < 6) {
            return { success: false, message: 'Mật khẩu phải có ít nhất 6 ký tự' };
        }

        // Kiểm tra email hợp lệ
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { success: false, message: 'Email không hợp lệ' };
        }

        try {
            // Tạo username từ email (có thể thay đổi logic này)
            const username = email.split('@')[0];
            
            const response = await authApiService.register({
                username,
                email,
                password,
                full_name: name
            });
            
            // Đảm bảo user data có đầy đủ thông tin
            const userData = {
                ...response.user,
                name: response.user.full_name || response.user.name || response.user.username || 'User'
            };
            
            // Lưu token và user data
            authUtils.saveAuthData(response.token, userData);
            setUser(userData);
            
            return { success: true };
        } catch (error) {
            console.error('Register error:', error);
            return { 
                success: false, 
                message: error.error || 'Có lỗi xảy ra khi đăng ký' 
            };
        }
    };

    const logout = async () => {
        try {
            // Gọi API logout (tùy chọn)
            await authApiService.logout();
        } catch (error) {
            console.error('Logout API error:', error);
        } finally {
            // Xóa dữ liệu local
            authUtils.clearAuthData();
            setUser(null);
        }
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
