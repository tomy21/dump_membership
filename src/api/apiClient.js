import axios from 'axios';

export const apiClient = axios.create({
  // baseURL: 'http://localhost:3008',
  baseURL: 'https://dev-valetapi.skyparking.online',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiBackend = axios.create({
  baseURL: 'https://devapi-injectmember.skyparking.online/',
  withCredentials: true,
});
