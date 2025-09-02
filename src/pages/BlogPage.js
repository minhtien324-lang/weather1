import React, { useEffect, useState } from 'react';
import { blogApi } from '../api/blogApi';
import { useAuth } from '../context/AuthContext';

function BlogPage({ onBack }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [cover, setCover] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const submit = async (e) => {
    e.preventDefault();
    try {
      await blogApi.create({ title, content, coverFile: cover });
      setTitle('');
      setContent('');
      setCover(null);
      await load();
    } catch (e) {
      alert(e?.error || 'Không thể tạo bài viết');
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <button onClick={onBack}>← Quay lại</button>
      <h2>Blog</h2>
      {loading && <p>Đang tải...</p>}

      {user && (
        <form onSubmit={submit} style={{ marginBottom: 24 }}>
          <h3>Tạo bài viết</h3>
          <div style={{ marginBottom: 8 }}>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tiêu đề" style={{ width: '100%', padding: 8 }} />
          </div>
          <div style={{ marginBottom: 8 }}>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Nội dung" rows={6} style={{ width: '100%', padding: 8 }} />
          </div>
          <div style={{ marginBottom: 8 }}>
            <input type="file" accept="image/*" onChange={(e) => setCover(e.target.files?.[0] || null)} />
          </div>
          <button type="submit">Đăng</button>
        </form>
      )}

      <h3>Bài viết mới</h3>
      <p>Tổng: {total}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {items.map((p) => (
          <div key={p.id} style={{ border: '1px solid #ddd', borderRadius: 8, overflow: 'hidden', background: '#fff' }}>
            {p.cover_image && (
              <img src={`http://localhost:3000${p.cover_image}`} alt={p.title} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
            )}
            <div style={{ padding: 12 }}>
              <h4 style={{ marginTop: 0 }}>{p.title}</h4>
              <p style={{ color: '#555' }}>{p.excerpt}...</p>
              <small>By {p.author_name || p.author_username}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BlogPage;


