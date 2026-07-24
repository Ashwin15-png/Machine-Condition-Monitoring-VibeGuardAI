import api from './api';

export const alertService = {
  getAll: async () => {
    const res = await api.get('/alerts');
    return res.data.data;
  },
  acknowledge: async (id, user) => {
    const res = await api.post(`/alerts/${id}/acknowledge`, { user });
    return res.data.data;
  },
  resolve: async (id) => {
    const res = await api.post(`/alerts/${id}/resolve`);
    return res.data.data;
  },
};

export default alertService;
