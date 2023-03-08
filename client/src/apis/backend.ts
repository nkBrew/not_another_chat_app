import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
  withCredentials: true,
});

export const login = async (email: string, password: string) => {
  const result = await api.post('/login', { email, password });
  return result.data;
};

export const test = async () => {
  const result = await api.get('/test', { withCredentials: true });
  console.log(result);
  return result.data;
};
