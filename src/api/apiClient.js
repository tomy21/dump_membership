import axios from 'axios';

export const apiClient = axios.create({
  // baseURL: 'http://localhost:3002',
  baseURL: 'https://dev-valetapi.skyparking.online',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiBackend = axios.create({
  baseURL: 'https://apiinject.skyparking.online',
  // baseURL: 'https://devapi-injectmember.skyparking.online',
  withCredentials: true,
});
