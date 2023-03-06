import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
});

export const login = async (email: string, password: string) => {
  const result = await api.post('/login', { email, password });
  return result.data;
};
