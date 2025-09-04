import React, { useEffect, useState } from 'react';
import { blogApi } from '../api/blogApi';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/BlogPage.module.css';

function BlogDetailPage({ postId, onBack, onEdit }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const load = async () => {
      if (!postId) return;
      setLoading(true);
      setError('');
      try {
        const data = await blogApi.getById(postId);
        setPost(data);
        const c = await blogApi.listComments(postId);
        setComments(c.items || []);
      } catch (e) {
        setError(e?.error || 'Không thể tải bài viết');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [postId]);

  return (
    <div className={styles.container}>
      <div className={styles.headingRow}>
        <h2 className={styles.title}>Chi tiết bài viết</h2>
        <div className={styles.actions}>
          <button className={styles.button} onClick={onBack}>← Quay lại</button>
          {user && post && (post.author_username === user.username || user.role === 'admin') && (
            <button className={styles.button} onClick={() => onEdit && onEdit()}>Chỉnh sửa</button>
          )}
          {user && post && (post.author_username === user.username || user.role === 'admin') && (
            <button className={styles.button} onClick={async () => {
              if (!window.confirm('Xóa bài viết này?')) return;
              try {
                await blogApi.remove(postId);
                onBack();
              } catch (e) {
                alert(e?.error || 'Không thể xóa');
              }
            }}>Xóa</button>
          )}
        </div>
      </div>

      {loading && <p>Đang tải...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && post && (
        <div className={styles.card}>
          {post.cover_image && (
            <img src={`http://localhost:3000${post.cover_image}`} alt={post.title} className={styles.coverFull} />
          )}
          <div className={styles.cardBody}>
            <h3 style={{ marginTop: 0 }}>{post.title}</h3>
            <div className={styles.meta} style={{ marginBottom: 8 }}>By {post.author_name || post.author_username}</div>
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{post.content}</div>
          </div>
        </div>
      )}

      {/* Comments */}
      <div className={styles.card} style={{ marginTop: 16 }}>
        <div className={styles.cardBody}>
          <h4 style={{ marginTop: 0 }}>Bình luận</h4>
          {comments.length === 0 && <div className={styles.meta}>Chưa có bình luận</div>}
          {comments.map((c) => (
            <div key={c.id} style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
              <div className={styles.meta} style={{ marginBottom: 4 }}>{c.author_name || c.author_username} • {new Date(c.created_at).toLocaleString('vi-VN')}</div>
              <div style={{ whiteSpace: 'pre-wrap' }}>{c.content}</div>
            </div>
          ))}

          {user && (
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!newComment.trim()) return;
              try {
                await blogApi.addComment(postId, newComment.trim());
                setNewComment('');
                const c = await blogApi.listComments(postId);
                setComments(c.items || []);
              } catch (e) {
                alert(e?.error || 'Không thể thêm bình luận');
              }
            }} style={{ marginTop: 12 }}>
              <textarea className={styles.textarea} value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Viết bình luận..." />
              <button className={styles.submitBtn} type="submit" style={{ marginTop: 8 }}>Gửi</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default BlogDetailPage;


