import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

export const pabellonesApi = {
  getAll: () => api.get('/pabellones'),
  getById: (id) => api.get(`/pabellones/${id}`),
  updateStatus: (id, estado) => api.patch(`/pabellones/${id}/estado`, { estado })
};

export const personalApi = {
  getAll: () => api.get('/personal'),
  getDisponible: (tipo) => api.get(`/personal/disponible/${tipo}`)
};

export const cirugiasApi = {
  getAll: () => api.get('/cirugias'),
  getByDate: (fecha) => api.get(`/cirugias/fecha/${fecha}`),
  create: (data) => api.post('/cirugias', data),
  updateStatus: (id, estado) => api.patch(`/cirugias/${id}/estado`, { estado }),
  getEstadisticas: () => api.get('/cirugias/estadisticas')
};

export const eventosApi = {
  create: (data) => api.post('/eventos', data),
  getByCirugia: (cirugiaId) => api.get(`/eventos/cirugia/${cirugiaId}`)
};