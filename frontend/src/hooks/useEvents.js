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

// Fetch all events
const fetchEvents = async () => {
    const response = await api.get('/events');
    return response.data.events;
};

// Create event
export const createEvent = async (eventData) => {
    try {
        const response = await api.post('/events', eventData);
        toast.success('Event created successfully!');
        return response.data;
    } catch (error) {
        const message = error.response?.data?.error || 'Failed to create event';
        toast.error(message);
        throw error;
    }
};

// Update event
export const updateEvent = async (id, eventData) => {
    try {
        const response = await api.put(`/events/${id}`, eventData);
        toast.success('Event updated successfully!');
        return response.data;
    } catch (error) {
        const message = error.response?.data?.error || 'Failed to update event';
        toast.error(message);
        throw error;
    }
};

// Delete event
export const deleteEvent = async (id) => {
    try {
        const response = await api.delete(`/events/${id}`);
        toast.success('Event deleted successfully!');
        return response.data;
    } catch (error) {
        const message = error.response?.data?.error || 'Failed to delete event';
        toast.error(message);
        throw error;
    }
};

// Custom hook for events
export const useEvents = () => {
    return useQuery({
        queryKey: ['events'],
        queryFn: fetchEvents,
        staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
        gcTime: 30 * 60 * 1000, // Cache kept for 30 minutes
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
    });
};