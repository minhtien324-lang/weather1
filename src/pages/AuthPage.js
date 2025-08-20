import React, { useState } from 'react';
import Login from '../components/Login';
import Register from '../components/Register';
import styles from '../styles/Auth.module.css';

const AuthPage = ({ onClose, isModal = false }) => {
    const [isLogin, setIsLogin] = useState(true);

    const switchToRegister = () => {
        setIsLogin(false);
    };

    const switchToLogin = () => {
        setIsLogin(true);
    };

    return (
        <div className={`${styles.authPage} ${isModal ? styles.modal : ''}`}>
            <div className={styles.authBackground}>
                <div className={styles.authContent}>
                    {!isModal && (
                        <div className={styles.authHeader}>
                            <h1 className={styles.appTitle}>Weather App</h1>
                            <p className={styles.appSubtitle}>
                                Khám phá thời tiết mọi nơi trên thế giới
                            </p>
                        </div>
                    )}
                    
                    {isLogin ? (
                        <Login onSwitchToRegister={switchToRegister} onClose={onClose} />
                    ) : (
                        <Register onSwitchToLogin={switchToLogin} onClose={onClose} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
