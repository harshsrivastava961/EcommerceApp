import axios from 'axios';

export const fakestoreApi = axios.create({
  baseURL: 'https://fakestoreapi.com',
  timeout: 10_000,
});

