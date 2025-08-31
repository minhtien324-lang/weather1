import React, { useState, useEffect } from 'react';
import { geminiApiService } from '../api/geminiApi';
import styles from '../styles/AiStatusIndicator.module.css';

function AiStatusIndicator() {
    const [aiStatus, setAiStatus] = useState('checking');
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        const checkAiStatus = async () => {
            try {
                const status = await geminiApiService.checkStatus();
                setAiStatus(status.status);
            } catch (error) {
                console.error('AI status check failed:', error);
                setAiStatus('disconnected');
            }
        };
        
        checkAiStatus();
        
        // Kiểm tra lại mỗi 30 giây
        const interval = setInterval(checkAiStatus, 30000);
        
        return () => clearInterval(interval);
    }, []);

    const getStatusInfo = () => {
        switch (aiStatus) {
            case 'connected':
                return {
                    icon: '🤖',
                    text: 'AI Sẵn sàng',
                    color: '#28a745',
                    description: 'Trợ lý AI đang hoạt động bình thường'
                };
            case 'checking':
                return {
                    icon: '⏳',
                    text: 'Đang kiểm tra...',
                    color: '#ffc107',
                    description: 'Đang kiểm tra kết nối AI'
                };
            case 'disconnected':
                return {
                    icon: '❌',
                    text: 'AI Tạm ngưng',
                    color: '#dc3545',
                    description: 'Trợ lý AI tạm thời không khả dụng'
                };
            default:
                return {
                    icon: '❓',
                    text: 'Không xác định',
                    color: '#6c757d',
                    description: 'Trạng thái AI không xác định'
                };
        }
    };

    const statusInfo = getStatusInfo();

    return (
        <div 
            className={styles.container}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <div 
                className={styles.indicator}
                style={{ borderColor: statusInfo.color }}
            >
                <span className={styles.icon}>{statusInfo.icon}</span>
                <span className={styles.text}>{statusInfo.text}</span>
            </div>
            
            {showTooltip && (
                <div className={styles.tooltip}>
                    <div className={styles.tooltipHeader}>
                        <span className={styles.tooltipIcon}>{statusInfo.icon}</span>
                        <span className={styles.tooltipTitle}>Trạng thái AI</span>
                    </div>
                    <p className={styles.tooltipDescription}>
                        {statusInfo.description}
                    </p>
                    <div className={styles.tooltipFooter}>
                        <small>Gemini 2.5 Flash</small>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AiStatusIndicator;

