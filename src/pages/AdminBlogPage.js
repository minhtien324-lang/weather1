import React, { useEffect, useState } from 'react';
import { blogApi } from '../api/blogApi';
import { useAuth } from '../context/AuthContext';

function AdminBlogPage({ onBack }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await blogApi.listAdmin();
      setItems(data.items || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!window.confirm('Xóa bài viết này?')) return;
    try {
      await blogApi.remove(id);
      await load();
    } catch (e) {
      alert(e?.error || 'Không thể xóa');
    }
  };

  if (!user) return <div style={{ padding: 16 }}><button onClick={onBack}>← Quay lại</button><p>Vui lòng đăng nhập.</p></div>;

  return (
    <div style={{ padding: 16 }}>
      <button onClick={onBack}>← Quay lại</button>
      <h2>Quản trị Blog</h2>
      {loading && <p>Đang tải...</p>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>ID</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Tiêu đề</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Tác giả</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Trạng thái</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.id}>
              <td style={{ padding: 8 }}>{p.id}</td>
              <td style={{ padding: 8 }}>{p.title}</td>
              <td style={{ padding: 8 }}>{p.author_name || p.author_username}</td>
              <td style={{ padding: 8 }}>{p.status}</td>
              <td style={{ padding: 8 }}>
                <button onClick={() => remove(p.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminBlogPage;


