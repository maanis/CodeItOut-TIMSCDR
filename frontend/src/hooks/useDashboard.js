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
    });
};
