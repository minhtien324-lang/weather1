import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('weatherAppToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const blogApi = {
  listPublic: async (page = 1, limit = 10) => {
    const { data } = await api.get(`/blog`, { params: { page, limit } });
    return data;
  },
  listAdmin: async () => {
    const { data } = await api.get(`/blog/admin`);
    return data;
  },
  getById: async (id) => {
    const { data } = await api.get(`/blog/${id}`);
    return data;
  },
  create: async ({ title, content, coverFile, status }) => {
    const form = new FormData();
    form.append('title', title);
    form.append('content', content);
    if (status) form.append('status', status);
    if (coverFile) form.append('cover_image', coverFile);
    const { data } = await api.post(`/blog`, form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },
  update: async (id, { title, content, coverFile, status }) => {
    const form = new FormData();
    if (title) form.append('title', title);
    if (content) form.append('content', content);
    if (status) form.append('status', status);
    if (coverFile) form.append('cover_image', coverFile);
    const { data } = await api.put(`/blog/${id}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },
  remove: async (id) => {
    const { data } = await api.delete(`/blog/${id}`);
    return data;
  },
  listComments: async (postId) => {
    const { data } = await api.get(`/blog/${postId}/comments`);
    return data;
  },
  addComment: async (postId, content) => {
    const { data } = await api.post(`/blog/${postId}/comments`, { content });
    return data;
  },
  updateComment: async (postId, commentId, content) => {
    const { data } = await api.put(`/blog/${postId}/comments/${commentId}`, { content });
    return data;
  },
  deleteComment: async (postId, commentId) => {
    const { data } = await api.delete(`/blog/${postId}/comments/${commentId}`);
    return data;
  }
};

export default blogApi;



