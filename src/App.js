import React, { useState } from 'react';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import { WeatherProvider, useWeather } from './context/WeatherContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import styles from './styles/GlobalWeather.module.css';

function AppContent() {
    const [currentPage, setCurrentPage] = useState('home');
    const { weatherClass } = useWeather();
    const { user, loading } = useAuth();

    const navigateTo = (page) => {
        setCurrentPage(page);
    };

    if (loading) {
        return (
            <div className={`${styles.appContainer} ${weatherClass ? styles[weatherClass] : ''}`}>
                <div className={styles.loadingContainer}>
                    <div className={styles.loadingSpinner}></div>
                    <p>Đang tải...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`${styles.appContainer} ${weatherClass ? styles[weatherClass] : ''}`}>
            <div className={styles.content}>
                {currentPage === 'home' && <HomePage onNavigate={navigateTo} />}
            </div>
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <WeatherProvider>
                <AppContent />
            </WeatherProvider>
        </AuthProvider>
    );
}

export default App;