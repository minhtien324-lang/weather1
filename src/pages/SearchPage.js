import React, { useState, useEffect } from 'react';
import SearchBar from "../components/SearchBar";
import styles from "../styles/SearchPage.module.css";

function SearchPage({ onNavigate, onSearch }) {
    const [recentSearches, setRecentSearches] = useState([]);

    // Lấy lịch sử tìm kiếm từ localStorage
    useEffect(() => {
        const saved = localStorage.getItem('recentSearches');
        if (saved) {
            try {
                const parsedSearches = JSON.parse(saved);
                if (Array.isArray(parsedSearches)) {
                    setRecentSearches(parsedSearches);
                }
            } catch (parseError) {
                console.error('Error parsing recent searches:', parseError);
                localStorage.removeItem('recentSearches');
            }
        }
    }, []);

    const handleSearch = async (locationInput) => {
        // Lưu vào lịch sử tìm kiếm
        const searchItem = {
            location: typeof locationInput === 'object' 
                ? `${locationInput.name}, ${locationInput.country}`
                : locationInput,
            timestamp: new Date().toISOString(),
            time: new Date().toLocaleTimeString('vi-VN', { 
                hour: '2-digit', 
                minute: '2-digit' 
            })
        };

        const updatedSearches = [
            searchItem,
            ...recentSearches.filter(item => item.location !== searchItem.location)
        ].slice(0, 10); // Giữ tối đa 10 tìm kiếm gần nhất

        setRecentSearches(updatedSearches);
        localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));

        // Chuyển về trang chủ và thực hiện tìm kiếm
        onNavigate('home');
        if (onSearch) {
            onSearch(locationInput);
        }
    };

    const handleRecentClick = (searchItem) => {
        // Tách tên thành phố từ chuỗi lưu trữ
        const cityName = searchItem.location.split(',')[0].trim();
        handleSearch(cityName);
    };

    const formatTimeAgo = (timestamp) => {
        const now = new Date();
        const searchTime = new Date(timestamp);
        const diffInMinutes = Math.floor((now - searchTime) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Vừa xong';
        if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`;
        return `${Math.floor(diffInMinutes / 1440)} ngày trước`;
    };

    return (
        <div className={styles.container}>
            <div className={styles.mainContent}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Tìm Kiếm Thành Phố</h1>
                    <p className={styles.subtitle}>Nhập tên thành phố để xem thời tiết</p>
                </header>

                <div className={styles.searchSection}>
                    <p className={styles.searchDescription}>
                        Nhập tên thành phố, tỉnh hoặc quốc gia để xem thông tin thời tiết chi tiết
                    </p>
                    <SearchBar onSearch={handleSearch} />
                </div>

                {recentSearches.length > 0 && (
                    <div className={styles.recentSearches}>
                        <h2 className={styles.recentTitle}>Tìm Kiếm Gần Đây</h2>
                        <div className={styles.recentList}>
                            {recentSearches.map((search, index) => (
                                <div 
                                    key={index} 
                                    className={styles.recentItem}
                                    onClick={() => handleRecentClick(search)}
                                >
                                    <span className={styles.recentLocation}>
                                        {search.location}
                                    </span>
                                    <span className={styles.recentTime}>
                                        {formatTimeAgo(search.timestamp)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className={styles.navigation}>
                    <button 
                        className={`${styles.navButton} ${styles.backButton}`}
                        onClick={() => onNavigate('home')}
                    >
                        Về Trang Chủ
                    </button>
                    <button 
                        className={styles.navButton}
                        onClick={() => onNavigate('forecast')}
                    >
                        Xem Dự Báo
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SearchPage; 