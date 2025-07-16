import React, { useState, useEffect } from 'react';
import { checkBackendHealth } from '../api/weatherApi';

const BackendStatus = () => {
    const [status, setStatus] = useState('checking');
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const healthData = await checkBackendHealth();
                setStatus('connected');
                setError(null);
            } catch (err) {
                setStatus('disconnected');
                setError(err.message);
            }
        };

        checkStatus();
        
        // Kiểm tra lại mỗi 30 giây
        const interval = setInterval(checkStatus, 30000);
        
        return () => clearInterval(interval);
    }, []);

    const getStatusColor = () => {
        switch (status) {
            case 'connected':
                return 'text-green-600 bg-green-100';
            case 'disconnected':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-yellow-600 bg-yellow-100';
        }
    };

    const getStatusText = () => {
        switch (status) {
            case 'connected':
                return '✅ Backend Connected';
            case 'disconnected':
                return '❌ Backend Disconnected';
            default:
                return '⏳ Checking...';
        }
    };

    return (
        <div className={`fixed top-4 right-4 px-3 py-2 rounded-lg text-sm font-medium shadow-lg z-50 ${getStatusColor()}`}>
            <div className="flex items-center space-x-2">
                <span>{getStatusText()}</span>
            </div>
            {error && (
                <div className="text-xs mt-1 opacity-75">
                    {error}
                </div>
            )}
        </div>
    );
};

export default BackendStatus; 