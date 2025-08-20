import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/Auth.module.css';

const Login = ({ onSwitchToRegister, onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!email || !password) {
            setError('Vui lòng điền đầy đủ thông tin');
            setLoading(false);
            return;
        }

        const result = login(email, password);
        
        if (result.success) {
            // Đăng nhập thành công - đóng modal
            if (onClose) {
                onClose();
            }
        } else {
            setError(result.message);
        }
        
        setLoading(false);
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.authCard}>
                <h2 className={styles.authTitle}>Đăng nhập</h2>
                
                {error && (
                    <div className={styles.errorMessage}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.authForm}>
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
                            placeholder="Nhập mật khẩu"
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className={styles.submitButton}
                        disabled={loading}
                    >
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                </form>

                <div className={styles.authFooter}>
                    <p className={styles.switchText}>
                        Chưa có tài khoản?{' '}
                        <button 
                            onClick={onSwitchToRegister}
                            className={styles.switchButton}
                        >
                            Đăng ký ngay
                        </button>
                    </p>
                </div>

                <div className={styles.demoCredentials}>
                    <h4>Thông tin demo:</h4>
                    <p><strong>Email:</strong> user@example.com</p>
                    <p><strong>Mật khẩu:</strong> password123</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
