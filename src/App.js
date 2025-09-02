import React, { useState } from 'react';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import BlogPage from './pages/BlogPage';
import AdminBlogPage from './pages/AdminBlogPage';
import { WeatherProvider, useWeather } from './context/WeatherContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
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
                {currentPage === 'blog' && <BlogPage onBack={() => navigateTo('home')} />}
                {currentPage === 'blog-admin' && <AdminBlogPage onBack={() => navigateTo('home')} />}
                {currentPage === 'auth' && <AuthPage onClose={() => navigateTo('home')} onNavigate={navigateTo} />}
            </div>
        </div>
    );
}

function App() {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <WeatherProvider>
                    <AppContent />
                </WeatherProvider>
            </AuthProvider>
        </ErrorBoundary>
    );
}

export default App;