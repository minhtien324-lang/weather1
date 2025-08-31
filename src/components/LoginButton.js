import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AuthPage from '../pages/AuthPage';
import styles from '../styles/LoginButton.module.css';

const LoginButton = () => {
    const { user } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);

    const handleLoginClick = () => {
        setShowAuthModal(true);
    };

    const handleCloseModal = () => {
        setShowAuthModal(false);
    };

    // Nếu đã đăng nhập, không hiển thị gì (UserProfile sẽ hiển thị thay thế)
    if (user) {
        return null;
    }

    return (
        <>
            <button 
                className={styles.loginButton}
                onClick={handleLoginClick}
            >
                <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                    <polyline points="10,17 15,12 10,7"></polyline>
                    <line x1="15" y1="12" x2="3" y2="12"></line>
                </svg>
                Đăng nhập
            </button>

            {showAuthModal && (
                <div className={styles.modalOverlay} onClick={handleCloseModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button 
                            className={styles.closeButton}
                            onClick={handleCloseModal}
                        >
                            <svg 
                                width="20" 
                                height="20" 
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                        <AuthPage onClose={handleCloseModal} isModal={true} />
                    </div>
                </div>
            )}
        </>
    );
};

export default LoginButton;
