import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/Auth.module.css';

const Register = ({ onSwitchToLogin, onClose, onNavigate }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!name || !email || !password || !confirmPassword) {
            setError('Vui lòng điền đầy đủ thông tin');
            setLoading(false);
            return;
        }

        // Validate name length
        if (name.trim().length < 2) {
            setError('Tên phải có ít nhất 2 ký tự');
            setLoading(false);
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Email không hợp lệ');
            setLoading(false);
            return;
        }

        // Validate password length
        if (password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            setLoading(false);
            return;
        }

        // Validate password confirmation
        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            setLoading(false);
            return;
        }

        try {
            const result = await register(name, email, password, confirmPassword);
            
            if (result.success) {
                // Đăng ký thành công - chuyển hướng hoặc đóng modal
                if (onNavigate) {
                    onNavigate('home');
                } else if (onClose) {
                    onClose();
                }
            } else {
                setError(result.message);
            }
        } catch (error) {
            setError('Có lỗi xảy ra khi đăng ký');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.authCard}>
                <h2 className={styles.authTitle}>Đăng ký</h2>
                
                {error && (
                    <div className={styles.errorMessage}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.authForm}>
                    <div className={styles.formGroup}>
                        <label htmlFor="name" className={styles.label}>
                            Họ và tên
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={styles.input}
                            placeholder="Nhập họ và tên của bạn"
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.label}>
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.input}
                            placeholder="Nhập email của bạn"
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password" className={styles.label}>
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                            placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="confirmPassword" className={styles.label}>
                            Xác nhận mật khẩu
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={styles.input}
                            placeholder="Nhập lại mật khẩu"
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className={styles.submitButton}
                        disabled={loading}
                    >
                        {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                    </button>
                </form>

                <div className={styles.authFooter}>
                    <p className={styles.switchText}>
                        Đã có tài khoản?{' '}
                        <button 
                            onClick={onSwitchToLogin}
                            className={styles.switchButton}
                        >
                            Đăng nhập
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
