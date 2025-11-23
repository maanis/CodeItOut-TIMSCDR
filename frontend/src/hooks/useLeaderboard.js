import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Hook to fetch leaderboard data with pagination
 * Uses TanStack Query for caching and state management
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Items per page (default: 10)
 * @returns {object} Query result with data, isLoading, error, refetch
 */
export const useLeaderboard = (page = 1, limit = 10) => {
    return useQuery({
        queryKey: ['leaderboard', page, limit],
        queryFn: async () => {
            const response = await axios.get(`${API_BASE_URL}/leaderboard`, {
                params: { page, limit }
            });
            return response.data;
        },
        staleTime: 0, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
        keepPreviousData: true,
        refetchOnWindowFocus: false

    });
};

