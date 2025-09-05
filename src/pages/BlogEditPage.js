import React, { useEffect, useState } from 'react';
import { blogApi } from '../api/blogApi';
import styles from '../styles/BlogPage.module.css';

function BlogEditPage({ postId, onBack }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [cover, setCover] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!postId) return;
      setLoading(true);
      setError('');
      try {
        const post = await blogApi.getById(postId);
        setTitle(post.title || '');
        setContent(post.content || '');
      } catch (e) {
        setError(e?.error || 'Không thể tải bài viết');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [postId]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await blogApi.update(postId, { title, content, coverFile: cover });
      onBack();
    } catch (e) {
      setError(e?.error || 'Không thể cập nhật');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headingRow}>
        <h2 className={styles.title}>Chỉnh sửa bài viết</h2>
        <div className={styles.actions}>
          <button className={styles.button} onClick={onBack}>← Quay lại</button>
        </div>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading ? (
        <p>Đang tải...</p>
      ) : (
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
          <button type="submit" className={styles.submitBtn} disabled={loading}>{loading ? 'Đang lưu...' : 'Lưu thay đổi'}</button>
        </form>
      )}
    </div>
  );
}

export default BlogEditPage;



