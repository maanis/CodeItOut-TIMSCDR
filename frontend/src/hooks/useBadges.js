import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

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

// Fetch all badges
const fetchBadges = async () => {
    const response = await api.get('/badges');
    return response.data.badges;
};

// Fetch single badge
const fetchBadge = async (id) => {
    const response = await api.get(`/badges/${id}`);
    return response.data.badge;
};

// Fetch student's badges
const fetchStudentBadges = async (studentId) => {
    const response = await api.get(`/badges/student/${studentId}`);
    return response.data.student;
};

// Create badge
export const createBadge = async (badgeData) => {
    try {
        const response = await api.post('/badges', badgeData);
        toast.success('Badge created successfully!');
        return response.data;
    } catch (error) {
        const message = error.response?.data?.error || 'Failed to create badge';
        toast.error(message);
        throw error;
    }
};

// Update badge
export const updateBadge = async (id, badgeData) => {
    try {
        const response = await api.put(`/badges/${id}`, badgeData);
        toast.success('Badge updated successfully!');
        return response.data;
    } catch (error) {
        const message = error.response?.data?.error || 'Failed to update badge';
        toast.error(message);
        throw error;
    }
};

// Delete badge
export const deleteBadge = async (id) => {
    try {
        const response = await api.delete(`/badges/${id}`);
        toast.success('Badge deleted successfully!');
        return response.data;
    } catch (error) {
        const message = error.response?.data?.error || 'Failed to delete badge';
        toast.error(message);
        throw error;
    }
};

// Assign badge to student
export const assignBadgeToStudent = async (badgeId, studentId) => {
    try {
        const response = await api.post(`/badges/${badgeId}/assign/${studentId}`);
        toast.success('Badge assigned successfully!');
        return response.data;
    } catch (error) {
        const message = error.response?.data?.error || 'Failed to assign badge';
        toast.error(message);
        throw error;
    }
};

// Remove badge from student
export const removeBadgeFromStudent = async (badgeId, studentId) => {
    try {
        const response = await api.delete(`/badges/${badgeId}/remove/${studentId}`);
        toast.success('Badge removed successfully!');
        return response.data;
    } catch (error) {
        const message = error.response?.data?.error || 'Failed to remove badge';
        toast.error(message);
        throw error;
    }
};

// Custom hooks
export const useBadges = () => {
    return useQuery({
        queryKey: ['badges'],
        queryFn: fetchBadges,
        staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
        gcTime: 30 * 60 * 1000, // Cache kept for 30 minutes
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
    });
};

export const useBadge = (id) => {
    return useQuery({
        queryKey: ['badge', id],
        queryFn: () => fetchBadge(id),
        enabled: !!id,
    });
};

export const useStudentBadges = (studentId) => {
    return useQuery({
        queryKey: ['student-badges', studentId],
        queryFn: () => fetchStudentBadges(studentId),
        enabled: !!studentId,
    });
};

// Mutation hooks
export const useCreateBadge = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createBadge,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['badges'] });
        },
    });
};

export const useUpdateBadge = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => updateBadge(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['badges'] });
            queryClient.invalidateQueries({ queryKey: ['badge'] });
        },
    });
};

export const useDeleteBadge = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteBadge,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['badges'] });
        },
    });
};

export const useAssignBadge = () => {
    const queryClient = useQueryClient();
    const { user, refreshUser } = useAuth();

    return useMutation({
        mutationFn: ({ badgeId, studentId }) => assignBadgeToStudent(badgeId, studentId),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['student-badges'] });
            queryClient.invalidateQueries({ queryKey: ['students'] });

            // If the badge was assigned to the current user, refresh their data
            if (user && variables.studentId === user.id) {
                refreshUser();
            }
        },
    });
};

export const useRemoveBadge = () => {
    const queryClient = useQueryClient();
    const { user, refreshUser } = useAuth();

    return useMutation({
        mutationFn: ({ badgeId, studentId }) => removeBadgeFromStudent(badgeId, studentId),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['student-badges'] });
            queryClient.invalidateQueries({ queryKey: ['students'] });

            // If the badge was removed from the current user, refresh their data
            if (user && variables.studentId === user.id) {
                refreshUser();
            }
        },
    });
};