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
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [openMenu, setOpenMenu] = useState(null);
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
            <div key={c.id} className={styles.commentItem}>
              <div className={styles.commentHeader}>
                <div className={styles.meta}>{c.author_name || c.author_username} • {new Date(c.created_at).toLocaleString('vi-VN')}</div>
                {user && (c.author_username === user.username || user.role === 'admin') && (
                  <div className={styles.commentMenu}>
                    <button 
                      className={styles.menuButton}
                      onClick={() => setOpenMenu(openMenu === c.id ? null : c.id)}
                    >
                      ⋯
                    </button>
                    {openMenu === c.id && (
                      <div className={styles.menuDropdown}>
                        <button 
                          className={styles.menuItem}
                          onClick={() => {
                            setEditingComment(c.id);
                            setEditContent(c.content);
                            setOpenMenu(null);
                          }}
                        >
                          Chỉnh sửa
                        </button>
                        <button 
                          className={`${styles.menuItem} ${styles.danger}`}
                          onClick={async () => {
                            if (window.confirm('Xóa bình luận này?')) {
                              try {
                                await blogApi.deleteComment(postId, c.id);
                                const updatedComments = await blogApi.listComments(postId);
                                setComments(updatedComments.items || []);
                              } catch (e) {
                                alert(e?.error || 'Không thể xóa bình luận');
                              }
                            }
                            setOpenMenu(null);
                          }}
                        >
                          Xóa
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {editingComment === c.id ? (
                <div className={styles.editForm}>
                  <textarea 
                    className={styles.editTextarea}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  />
                  <div className={styles.editActions}>
                    <button 
                      className={styles.editBtn}
                      onClick={async () => {
                        try {
                          await blogApi.updateComment(postId, c.id, editContent);
                          const updatedComments = await blogApi.listComments(postId);
                          setComments(updatedComments.items || []);
                          setEditingComment(null);
                          setEditContent('');
                        } catch (e) {
                          alert(e?.error || 'Không thể cập nhật bình luận');
                        }
                      }}
                    >
                      Lưu
                    </button>
                    <button 
                      className={styles.cancelBtn}
                      onClick={() => {
                        setEditingComment(null);
                        setEditContent('');
                      }}
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ whiteSpace: 'pre-wrap' }}>{c.content}</div>
              )}
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


