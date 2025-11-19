import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

// Fetch all contests
const fetchContests = async () => {
    const response = await api.get('/quizzes');
    console.log(response.data)
    return response.data;
};

// Create contest
export const createContest = async (contestData) => {
    try {
        const response = await api.post('/quizzes', contestData);
        console.log(response.data);
        toast.success('Contest created successfully!');
        return response.data;
    } catch (error) {
        console.log(error)
        const message = error.response?.data?.error || 'Failed to create contest';
        toast.error(message);
        throw error;
    }
};

// Update contest
export const updateContest = async (id, contestData) => {
    try {
        const response = await api.put(`/quizzes/${id}`, contestData);
        toast.success('Contest updated successfully!');
        return response.data;
    } catch (error) {
        const message = error.response?.data?.error || 'Failed to update contest';
        toast.error(message);
        throw error;
    }
};

// Delete contest
export const deleteContest = async (id) => {
    try {
        const response = await api.delete(`/quizzes/${id}`);
        toast.success('Contest deleted successfully!');
        return response.data;
    } catch (error) {
        const message = error.response?.data?.error || 'Failed to delete contest';
        toast.error(message);
        throw error;
    }
};

// Start contest
export const startContest = async (id) => {
    try {
        const response = await api.put(`/quizzes/${id}/start`);
        toast.success('Contest started successfully!');
        return response.data;
    } catch (error) {
        const message = error.response?.data?.error || 'Failed to start contest';
        toast.error(message);
        throw error;
    }
};

// Stop contest
export const stopContest = async (id) => {
    try {
        const response = await api.put(`/quizzes/${id}/stop`);
        toast.success('Contest stopped successfully!');
        return response.data;
    } catch (error) {
        const message = error.response?.data?.error || 'Failed to stop contest';
        toast.error(message);
        throw error;
    }
};

// Register for contest
export const registerForContest = async (id) => {
    // For quizzes, registration is handled by the attempt system
    toast.success('Ready to attempt the contest!');
    return { message: 'Ready to attempt' };
};

// Hook to fetch contests
export const useContests = () => {
    return useQuery({
        queryKey: ['contests'],
        queryFn: fetchContests,
        staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
        gcTime: 30 * 60 * 1000, // Cache kept for 30 minutes
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
    });
};

// Hook to fetch single contest
export const useContest = (id) => {
    return useQuery({
        queryKey: ['contest', id],
        queryFn: () => api.get(`/quizzes/${id}`).then(res => res.data),
        enabled: !!id,
    });
};

// Hook to fetch contest results for a student
export const useContestResults = (contestId) => {
    return useQuery({
        queryKey: ['contest-results', contestId],
        queryFn: async () => {
            try {
                const response = await api.get(`/quizzes/${contestId}/my-attempt`);
                return response.data;
            } catch (error) {
                if (error.response?.status === 404 && error.response?.data?.error === 'You have not attempted this quiz yet') {
                    return { notParticipated: true };
                }
                throw error;
            }
        },
        enabled: !!contestId,
    });
};

// Hook to fetch contest leaderboard
export const useContestLeaderboard = (contestId) => {
    return useQuery({
        queryKey: ['contest-leaderboard', contestId],
        queryFn: () => api.get(`/quizzes/${contestId}/attempts`).then(res => res.data),
        enabled: !!contestId,
    });
};

// Hook to start quiz attempt
export const useStartQuizAttempt = () => {
    return useMutation({
        mutationFn: async (contestId) => {
            const response = await api.post(`/quizzes/${contestId}/attempt`);
            return response.data;
        },
    });
};