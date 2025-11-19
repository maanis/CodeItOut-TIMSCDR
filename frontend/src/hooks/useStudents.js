import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Fetch all students
const fetchStudents = async () => {
    const response = await api.get('/students');
    return response.data.students;
};

// Custom hook for all students
export const useStudents = () => {
    return useQuery({
        queryKey: ['students'],
        queryFn: fetchStudents,
        staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
        gcTime: 30 * 60 * 1000, // Cache kept for 30 minutes
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
    });
};