import useUserStore from '@/store/userStore';
import axios from 'axios';

const baseURL = process.env.BACKEND_URL || 'http://localhost:3001';

const api = axios.create({
  // baseURL: 'http://localhost:3001',
  baseURL,
});

//JWT
api.interceptors.request.use((config) => {
  const user = useUserStore.getState().user;
  const token = user && user.accessToken;
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
});

export const login = async (email: string, password: string) => {
  const result = await api.post('/login', { email, password });
  return result.data;
};

export const register = async (username: string, password: string) => {
  const result = await api.post('register', { username, password });
  return result.data;
};

export const test = async () => {
  const result = await api.get('/test');
  console.log(result);
  return result.data;
};
