import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const studyPlanService = {
  generatePlan: async (studyData) => {
    try {
      const response = await api.post('/schedule', studyData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  savePlan: async (planData) => {
    try {
      const response = await api.post('/save-plan', planData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getPlans: async () => {
    try {
      const response = await api.get('/plans');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default api; 