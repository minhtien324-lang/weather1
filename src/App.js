import React, { useState } from 'react';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import BlogPage from './pages/BlogPage';
import AdminBlogPage from './pages/AdminBlogPage';
import BlogCreatePage from './pages/BlogCreatePage';
import BlogDetailPage from './pages/BlogDetailPage';
import BlogEditPage from './pages/BlogEditPage';
import { WeatherProvider, useWeather } from './context/WeatherContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import styles from './styles/GlobalWeather.module.css';

function AppContent() {
    const [currentPage, setCurrentPage] = useState('home');
    const [selectedPostId, setSelectedPostId] = useState(null);
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
                {currentPage === 'blog' && (
                    <BlogPage 
                        onBack={() => navigateTo('home')} 
                        onCreate={() => navigateTo('blog-create')} 
                        onOpenDetail={(id) => { setSelectedPostId(id); navigateTo('blog-detail'); }}
                    />
                )}
                {currentPage === 'blog-admin' && <AdminBlogPage onBack={() => navigateTo('home')} />}
                {currentPage === 'blog-create' && <BlogCreatePage onBack={() => navigateTo('blog')} />}
                {currentPage === 'blog-detail' && <BlogDetailPage postId={selectedPostId} onBack={() => navigateTo('blog')} onEdit={() => navigateTo('blog-edit')} />}
                {currentPage === 'blog-edit' && <BlogEditPage postId={selectedPostId} onBack={() => navigateTo('blog-detail')} />}
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