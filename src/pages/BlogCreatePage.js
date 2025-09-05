import React, { useState } from 'react';
import { blogApi } from '../api/blogApi';
import styles from '../styles/BlogPage.module.css';

function BlogCreatePage({ onBack }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [cover, setCover] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await blogApi.create({ title, content, coverFile: cover });
      onBack();
    } catch (e) {
      alert(e?.error || 'Không thể tạo bài viết');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headingRow}>
        <h2 className={styles.title}>Đăng bài viết</h2>
        <div className={styles.actions}>
          <button className={styles.button} onClick={onBack}>← Quay lại</button>
        </div>
      </div>

      <form onSubmit={submit} className={styles.editor}>
        <div className={styles.field}>
          <input className={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tiêu đề" />
        </div>
        <div className={styles.field}>
          <textarea className={styles.textarea} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Nội dung bài viết" />
        </div>
        <div className={styles.field}>
          <input type="file" accept="image/*" onChange={(e) => setCover(e.target.files?.[0] || null)} />
        </div>
        <button type="submit" className={styles.submitBtn} disabled={loading}>{loading ? 'Đang đăng...' : 'Đăng bài'}</button>
      </form>
    </div>
  );
}

export default BlogCreatePage;



