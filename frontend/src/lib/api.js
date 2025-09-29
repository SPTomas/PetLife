import axios from 'axios';
import { getAccessToken } from './supabase';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '/api'
});

api.interceptors.request.use(async (cfg) => {
  const t = await getAccessToken();
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});
