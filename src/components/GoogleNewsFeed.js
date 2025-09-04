import React, { useEffect, useState } from 'react';
import { fetchGoogleNews } from '../api/newsApi';
import styles from '../styles/GoogleNewsFeed.module.css';

function GoogleNewsFeed() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchGoogleNews();
                if (mounted) setItems(data);
            } catch (e) {
                if (mounted) setError(e.message || 'Lỗi tải tin tức');
            } finally {
                if (mounted) setLoading(false);
            }
        };
        load();
        return () => { mounted = false; };
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>Google News</h2>
                <a
                    href="https://news.google.com/rss/search?q=thoi+tiet&hl=vi&gl=VN&ceid=VN:vi"
                    target="_blank"
                    rel="noreferrer"
                    className={styles.viewAll}
                >Xem trên Google News</a>
            </div>

            {loading && (
                <div className={styles.loading}>Đang tải tin tức...</div>
            )}
            {error && (
                <div className={styles.error}>{error}</div>
            )}

            {!loading && !error && items.length === 0 && (
                <div className={styles.empty}>Chưa có bài viết</div>
            )}

            <ul className={styles.list}>
                {items.map((item, idx) => (
                    <li key={idx} className={styles.item}>
                        <a href={item.link} target="_blank" rel="noreferrer" className={styles.link}>
                            <div className={styles.itemContent}>
                                <div className={styles.itemText}>
                                    <div className={styles.itemTitle}>{item.title}</div>
                                    <div className={styles.meta}>
                                        {item.author && <span className={styles.author}>{item.author}</span>}
                                        {item.pubDate && <span className={styles.dot}>•</span>}
                                        {item.pubDate && (
                                            <span className={styles.date}>{new Date(item.pubDate).toLocaleString('vi-VN')}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default GoogleNewsFeed;






