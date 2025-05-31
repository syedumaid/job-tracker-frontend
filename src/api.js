// src/api.js
import axios from 'axios';

// const BASE_URL = process.env.REACT_APP_API_URL || 'http://10.14.0.2:3000';
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
// REACT_APP_API_URL=http://localhost:8080


export const getJobs = () => axios.get(`${BASE_URL}/jobs`);
export const addJob = (job) => axios.post(`${BASE_URL}/jobs`, job);
export const updateJob = (id, updates) => axios.put(`${BASE_URL}/jobs/${id}`, updates);
export const deleteJob = (id) => axios.delete(`${BASE_URL}/jobs/${id}`);
export const archiveJob = (id) => axios.patch(`${BASE_URL}/jobs/${id}/archive`);
