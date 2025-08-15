import React, { useState } from 'react';
import HomePage from './pages/HomePage';
import { WeatherProvider, useWeather } from './context/WeatherContext';
import styles from './styles/GlobalWeather.module.css';

function AppContent() {
    const [currentPage, setCurrentPage] = useState('home');
    const { weatherClass } = useWeather();

    const navigateTo = (page) => {
        setCurrentPage(page);
    };

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
        <WeatherProvider>
            <AppContent />
        </WeatherProvider>
    );
}

export default App;