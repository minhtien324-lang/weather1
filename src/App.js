import React, { useState } from 'react';
import "./styles/index.css"
import HomePage from './pages/HomePage';
import ForecastPage from './pages/ForecastPage';
import SearchPage from './pages/SearchPage';
import BackendStatus from './components/BackendStatus';

function App() {
    const [currentPage, setCurrentPage] = useState('home');
    const [searchCallback, setSearchCallback] = useState(null);

    const handleNavigate = (page) => {
        setCurrentPage(page);
    };

    const handleSearchFromPage = (locationInput) => {
        // Lưu callback để SearchPage có thể gọi lại
        setSearchCallback(() => () => locationInput);
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <HomePage onNavigate={handleNavigate} />;
            case 'forecast':
                return <ForecastPage onNavigate={handleNavigate} />;
            case 'search':
                return <SearchPage onNavigate={handleNavigate} onSearch={handleSearchFromPage} />;
            default:
                return <HomePage onNavigate={handleNavigate} />;
        }
    };

    return (
        <div className="App">
            <BackendStatus />
            {renderPage()}
        </div>
    );
}

export default App;