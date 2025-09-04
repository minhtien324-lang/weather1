import React, { useEffect, useMemo, useState } from 'react';
import { blogApi } from '../api/blogApi';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/BlogPage.module.css';

function BlogPage({ onBack, onCreate, onOpenDetail }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const currentWeather = useMemo(() => {
    try {
      const raw = localStorage.getItem('lastCurrentWeather');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const data = await blogApi.listPublic(1, 10);
      setItems(data.items || []);
      setTotal(data.total || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className={styles.container}>
      <div className={styles.weatherBanner}>
        <div className={styles.weatherLeft}>
          <div>
            <div className={styles.temp}>
              {currentWeather ? Math.round(currentWeather.main?.temp) : '--'}°C
            </div>
            <div className={styles.weatherDesc}>
              {currentWeather ? (currentWeather.weather?.[0]?.description || '') : 'Chưa có dữ liệu thời tiết'}
            </div>
          </div>
        </div>
        <div className={styles.actions}>
          <button className={styles.button} onClick={onBack}>← Trang chủ</button>
        </div>
      </div>

      <div className={styles.headingRow}>
        <h2 className={styles.title}>Blog</h2>
        {loading && <p>Đang tải...</p>}
      </div>

      {user && (
        <div className={styles.editor}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{color : '#000000', margin: 0 }}>Tạo bài viết</h3>
            <button className={styles.submitBtn} onClick={onCreate}>Đăng bài</button>
          </div>
          <div className={styles.meta} style={{ marginTop: 8 }}></div>
        </div>
      )}

      <h3>Bài viết mới</h3>
      <p>Tổng: {total}</p>
      <div className={styles.grid}>
        {items.map((p) => (
          <div key={p.id} className={styles.card} onClick={() => onOpenDetail && onOpenDetail(p.id)} style={{ cursor: 'pointer' }}>
            {p.cover_image && (
              <img src={`http://localhost:3000${p.cover_image}`} alt={p.title} className={styles.coverCard} />
            )}
            <div className={styles.cardBody}>
              <h4 style={{ marginTop: 0 }}>{p.title}</h4>
              <p className={styles.excerpt}>{p.excerpt}...</p>
              <div className={styles.meta}>By {p.author_name || p.author_username} • {p.comment_count || 0} bình luận</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BlogPage;


