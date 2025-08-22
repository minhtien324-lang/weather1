import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import Profile from './Profile';
import styles from '../styles/UserProfile.module.css';

const UserProfile = () => {
    const { user, logout } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            setShowDropdown(false);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const handleProfileClick = () => {
        setShowProfile(true);
        setShowDropdown(false);
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    if (!user) return null;

    return (
        <div className={styles.userProfile} ref={dropdownRef}>
            <div className={styles.userInfo} onClick={toggleDropdown}>
                <div className={styles.avatar}>
                    {(user.name || user.full_name || user.email || 'U').charAt(0).toUpperCase()}
                </div>
                <span className={styles.userName}>{user.name || user.full_name || 'User'}</span>
                <svg 
                    className={`${styles.dropdownIcon} ${showDropdown ? styles.rotated : ''}`}
                    width="12" 
                    height="12" 
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <polyline points="6,9 12,15 18,9"></polyline>
                </svg>
            </div>

            {showDropdown && (
                <div className={styles.dropdown}>
                    <div className={styles.dropdownItem}>
                        <span className={styles.dropdownLabel}>Email:</span>
                        <span className={styles.dropdownValue}>{user.email}</span>
                    </div>
                    <div className={styles.dropdownItem}>
                        <span className={styles.dropdownLabel}>ID:</span>
                        <span className={styles.dropdownValue}>{user.id}</span>
                    </div>
                    <div className={styles.dropdownDivider}></div>
                    <button 
                        className={styles.profileButton}
                        onClick={handleProfileClick}
                    >
                        <svg 
                            width="16" 
                            height="16" 
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        Thông tin tài khoản
                    </button>
                    <button 
                        className={styles.logoutButton}
                        onClick={handleLogout}
                    >
                        <svg 
                            width="16" 
                            height="16" 
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16,17 21,12 16,7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        Đăng xuất
                    </button>
                </div>
            )}

            {showProfile && (
                <Profile onClose={() => setShowProfile(false)} />
            )}
        </div>
    );
};

export default UserProfile;
