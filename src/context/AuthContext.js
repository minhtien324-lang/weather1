import React, { createContext, useContext, useState, useEffect } from 'react';

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
        const savedUser = localStorage.getItem('weatherAppUser');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        // Kiểm tra trong mock users trước
        const mockUsers = [
            { id: 1, email: 'user@example.com', password: 'password123', name: 'Người dùng' },
            { id: 2, email: 'admin@example.com', password: 'admin123', name: 'Admin' }
        ];

        let foundUser = mockUsers.find(u => u.email === email && u.password === password);
        
        // Nếu không tìm thấy trong mock users, kiểm tra trong users đã đăng ký
        if (!foundUser) {
            const registeredUsers = JSON.parse(localStorage.getItem('weatherAppUsers') || '[]');
            foundUser = registeredUsers.find(u => u.email === email && u.password === password);
        }
        
        if (foundUser) {
            const userData = {
                id: foundUser.id,
                email: foundUser.email,
                name: foundUser.name
            };
            setUser(userData);
            localStorage.setItem('weatherAppUser', JSON.stringify(userData));
            return { success: true };
        } else {
            return { success: false, message: 'Email hoặc mật khẩu không đúng' };
        }
    };

    const register = (name, email, password, confirmPassword) => {
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

        // Kiểm tra email đã tồn tại chưa
        const existingUsers = JSON.parse(localStorage.getItem('weatherAppUsers') || '[]');
        const emailExists = existingUsers.some(user => user.email === email);
        if (emailExists) {
            return { success: false, message: 'Email đã được sử dụng' };
        }

        // Trong thực tế, bạn sẽ gọi API để đăng ký
        // Ở đây tôi sẽ mô phỏng đăng ký thành công
        const newUser = {
            id: Date.now(),
            email,
            name,
            password
        };

        // Lưu user mới vào localStorage (trong thực tế sẽ lưu vào database)
        existingUsers.push(newUser);
        localStorage.setItem('weatherAppUsers', JSON.stringify(existingUsers));

        // Tự động đăng nhập sau khi đăng ký
        const userData = {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name
        };
        setUser(userData);
        localStorage.setItem('weatherAppUser', JSON.stringify(userData));

        return { success: true };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('weatherAppUser');
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
