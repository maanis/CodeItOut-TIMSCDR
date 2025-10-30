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

// Fetch all announcements
const fetchAnnouncements = async () => {
    const response = await api.get('/announcements');
    return response.data.announcements;
};

// Create announcement
export const createAnnouncement = async (announcementData) => {
    try {
        const response = await api.post('/announcements', announcementData);
        toast.success('Announcement created successfully!');
        return response.data;
    } catch (error) {
        const message = error.response?.data?.error || 'Failed to create announcement';
        toast.error(message);
        throw error;
    }
};

// Update announcement
export const updateAnnouncement = async (id, announcementData) => {
    try {
        const response = await api.put(`/announcements/${id}`, announcementData);
        toast.success('Announcement updated successfully!');
        return response.data;
    } catch (error) {
        const message = error.response?.data?.error || 'Failed to update announcement';
        toast.error(message);
        throw error;
    }
};

// Delete announcement
export const deleteAnnouncement = async (id) => {
    try {
        const response = await api.delete(`/announcements/${id}`);
        toast.success('Announcement deleted successfully!');
        return response.data;
    } catch (error) {
        const message = error.response?.data?.error || 'Failed to delete announcement';
        toast.error(message);
        throw error;
    }
};

// Custom hook for announcements
export const useAnnouncements = () => {
    return useQuery({
        queryKey: ['announcements'],
        queryFn: fetchAnnouncements,
    });
};

// Custom hook for updating announcement
export const useUpdateAnnouncement = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateAnnouncement,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['announcements'] });
            toast.success('Announcement updated successfully!');
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update announcement');
        },
    });
};

// Custom hook for deleting announcement
export const useDeleteAnnouncement = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteAnnouncement,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['announcements'] });
            toast.success('Announcement deleted successfully!');
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete announcement');
        },
    });
};