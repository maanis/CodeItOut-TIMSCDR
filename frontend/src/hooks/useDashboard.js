import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const fetchDashboardData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found');
    }

    const response = await axios.get(`${API_BASE_URL}/dashboard`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    return response.data;
};

export const useDashboard = () => {
    return useQuery({
        queryKey: ['dashboard'],
        queryFn: fetchDashboardData,
        staleTime: 1 * 60 * 1000, // Data is fresh for 1 minute
        gcTime: 5 * 60 * 1000, // Cache kept for 5 minutes
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        // refetchOnMount: true,
    });
};

const fetchAdminDashboardStats = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found');
    }

    const response = await axios.get(`${API_BASE_URL}/dashboard/admin/stats`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    return response.data;
};

/**
 * Hook to fetch admin dashboard statistics
 * Returns: totalStudents, totalEvents, totalPendingProjects, totalBadges
 * Cached in Redis for 5 minutes
 */
export const useAdminDashboardStats = () => {
    return useQuery({
        queryKey: ['adminDashboardStats'],
        queryFn: fetchAdminDashboardStats,
        staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes (matches Redis TTL)
        gcTime: 10 * 60 * 1000, // Cache kept for 10 minutes
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
    });
};
