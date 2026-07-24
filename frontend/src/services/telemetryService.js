import api from './api';

export const telemetryService = {
  getStream: async () => {
    const res = await api.get('/telemetry');
    return res.data.data;
  },
  getHistoryLogs: async (params) => {
    const res = await api.get('/history', { params });
    return res.data.data;
  },
};

export default telemetryService;
