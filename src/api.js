// // src/api.js
// import axios from 'axios';

// // const BASE_URL = process.env.REACT_APP_API_URL || 'http://10.14.0.2:3000';
// // const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
// const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
// // REACT_APP_API_URL=http://localhost:8080


// export const getJobs = () => axios.get(`${BASE_URL}/jobs`);
// export const addJob = (job) => axios.post(`${BASE_URL}/jobs`, job);
// export const updateJob = (id, updates) => axios.put(`${BASE_URL}/jobs/${id}`, updates);
// export const deleteJob = (id) => axios.delete(`${BASE_URL}/jobs/${id}`);
// export const archiveJob = (id) => axios.patch(`${BASE_URL}/jobs/${id}/archive`);
import axios from "axios";

// Job Tracker APIs
export const getJobs = () => axios.get("http://localhost:8080/jobs");
export const addJob = (job) => axios.post("http://localhost:8080/jobs", job);
export const deleteJob = (id) => axios.delete(`http://localhost:8080/jobs/${id}`);
export const archiveJob = (id) => axios.patch(`http://localhost:8080/jobs/${id}`, { status: "Archived" });
export const updateJob = (id, job) => axios.put(`http://localhost:8080/jobs/${id}`, job);

// Networking Tracker APIs
// Networking Tracker APIs
export const getContacts = () => axios.get("http://localhost:8080/contacts");
export const addContact = (contact) => axios.post("http://localhost:8080/contacts", contact);
export const deleteContact = (id) => axios.delete(`http://localhost:8080/contacts/${id}`);
export const updateContact = (id, updatedContact) => axios.put(`http://localhost:8080/contacts/${id}`, updatedContact);
export const archiveContact = (id) => axios.patch(`http://localhost:8080/contacts/${id}`, { status: "archived" });
