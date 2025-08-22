import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authApiService } from '../api/authApi';
import styles from '../styles/Profile.module.css';

const Profile = ({ onClose }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        full_name: user?.full_name || user?.name || '',
        email: user?.email || ''
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await authApiService.updateProfile({
                full_name: formData.full_name,
                email: formData.email
            });
            
            setMessage({ type: 'success', text: response.message });
        } catch (error) {
            setMessage({ type: 'error', text: error.error || 'Có lỗi xảy ra khi cập nhật thông tin' });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp' });
            setLoading(false);
            return;
        }

        try {
            const response = await authApiService.changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            
            setMessage({ type: 'success', text: response.message });
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            setMessage({ type: 'error', text: error.error || 'Có lỗi xảy ra khi đổi mật khẩu' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.profileContainer}>
            <div className={styles.profileCard}>
                <div className={styles.profileHeader}>
                    <h2 className={styles.profileTitle}>Thông tin tài khoản</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div className={styles.tabContainer}>
                    <button 
                        className={`${styles.tabButton} ${activeTab === 'profile' ? styles.active : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        Thông tin cá nhân
                    </button>
                    <button 
                        className={`${styles.tabButton} ${activeTab === 'password' ? styles.active : ''}`}
                        onClick={() => setActiveTab('password')}
                    >
                        Đổi mật khẩu
                    </button>
                </div>

                {message.text && (
                    <div className={`${styles.message} ${styles[message.type]}`}>
                        {message.text}
                    </div>
                )}

                {activeTab === 'profile' && (
                    <form onSubmit={handleProfileSubmit} className={styles.profileForm}>
                        <div className={styles.formGroup}>
                            <label htmlFor="full_name" className={styles.label}>
                                Họ và tên
                            </label>
                            <input
                                type="text"
                                id="full_name"
                                value={formData.full_name}
                                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                                className={styles.input}
                                placeholder="Nhập họ và tên"
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="email" className={styles.label}>
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className={styles.input}
                                placeholder="Nhập email"
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            className={styles.submitButton}
                            disabled={loading}
                        >
                            {loading ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
                        </button>
                    </form>
                )}

                {activeTab === 'password' && (
                    <form onSubmit={handlePasswordSubmit} className={styles.profileForm}>
                        <div className={styles.formGroup}>
                            <label htmlFor="currentPassword" className={styles.label}>
                                Mật khẩu hiện tại
                            </label>
                            <input
                                type="password"
                                id="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                                className={styles.input}
                                placeholder="Nhập mật khẩu hiện tại"
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="newPassword" className={styles.label}>
                                Mật khẩu mới
                            </label>
                            <input
                                type="password"
                                id="newPassword"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                className={styles.input}
                                placeholder="Nhập mật khẩu mới"
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="confirmPassword" className={styles.label}>
                                Xác nhận mật khẩu mới
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                className={styles.input}
                                placeholder="Nhập lại mật khẩu mới"
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            className={styles.submitButton}
                            disabled={loading}
                        >
                            {loading ? 'Đang đổi mật khẩu...' : 'Đổi mật khẩu'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Profile;
