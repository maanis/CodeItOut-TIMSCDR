import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

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

// Fetch all projects (for admin/teacher)
const fetchProjects = async () => {
    const response = await api.get('/projects');
    return response.data.projects;
};

// Fetch user's own projects
const fetchMyProjects = async () => {
    const response = await api.get('/projects/my');
    return response.data.projects;
};

// Create project
export const createProject = async (projectData) => {
    try {
        const response = await api.post('/projects', projectData);
        toast.success('Project submitted successfully! Waiting for approval.');
        return response.data;
    } catch (error) {
        const message = error.response?.data?.error || 'Failed to create project';
        toast.error(message);
        throw error;
    }
};

// Update project
export const updateProject = async (id, projectData) => {
    try {
        const response = await api.put(`/projects/${id}`, projectData);
        toast.success('Project updated successfully!');
        return response.data;
    } catch (error) {
        const message = error.response?.data?.error || 'Failed to update project';
        toast.error(message);
        throw error;
    }
};

// Delete project
export const deleteProject = async (id) => {
    try {
        const response = await api.delete(`/projects/${id}`);
        toast.success('Project deleted successfully!');
        return response.data;
    } catch (error) {
        const message = error.response?.data?.error || 'Failed to delete project';
        toast.error(message);
        throw error;
    }
};

// Approve/Reject project (Admin/Teacher only)
export const approveProject = async (id, approved) => {
    try {
        const response = await api.put(`/projects/${id}`, { approved });
        toast.success(`Project ${approved ? 'approved' : 'rejected'} successfully!`);
        return response.data;
    } catch (error) {
        const message = error.response?.data?.error || 'Failed to update project status';
        toast.error(message);
        throw error;
    }
};

// Custom hook for all projects (admin/teacher view)
export const useProjects = () => {
    return useQuery({
        queryKey: ['projects'],
        queryFn: fetchProjects,
        staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
        gcTime: 30 * 60 * 1000, // Cache kept for 30 minutes (formerly cacheTime)
        refetchOnWindowFocus: false, // Don't refetch when window regains focus
        refetchOnReconnect: true, // Refetch when reconnecting to internet
    });
};

// Custom hook for user's own projects
export const useMyProjects = () => {
    return useQuery({
        queryKey: ['my-projects'],
        queryFn: fetchMyProjects,
        staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
        gcTime: 30 * 60 * 1000, // Cache kept for 30 minutes (formerly cacheTime)
        refetchOnWindowFocus: false, // Don't refetch when window regains focus
        refetchOnReconnect: true, // Refetch when reconnecting to internet
    });
};