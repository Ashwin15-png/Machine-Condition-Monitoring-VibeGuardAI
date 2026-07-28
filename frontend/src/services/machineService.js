import api from './api';

export const machineService = {
  getAll: async () => {
    const res = await api.get('/machines');
    return res.data.data;
  },
  getById: async (id) => {
    const res = await api.get(`/machines/${id}`);
    return res.data.data;
  },
  create: async (machineData) => {
    const res = await api.post('/machines', machineData);
    return res.data.data;
  },
  update: async (id, machineData) => {
    const res = await api.put(`/machines/${id}`, machineData);
    return {
      ...(res.data.data || {}),
      alertCounters: res.data.alertCounters,
    };
  },
  delete: async (id) => {
    const res = await api.delete(`/machines/${id}`);
    return res.data;
  },
};

export default machineService;
