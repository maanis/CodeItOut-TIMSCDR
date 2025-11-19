import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const fetchNotifications = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/api/notifications`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
};

export const useNotifications = () => {
    const token = localStorage.getItem('token');

    const { data: queryData, isLoading, error, refetch } = useQuery({
        queryKey: ['notifications'],
        queryFn: fetchNotifications,
        staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
        gcTime: 30 * 60 * 1000, // Cache kept for 30 minutes
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        enabled: !!token,
    });

    const data = queryData?.notifications || [];
    const unreadCount = data?.filter(n => !n.hasRead).length || 0;


    const markAsRead = async (notificationId) => {
        try {
            if (!token) {
                toast.error('Authentication required');
                return;
            }

            const response = await fetch(`${API_BASE_URL}/api/notifications/${notificationId}/read`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    toast.error('Authentication failed');
                } else {
                    throw new Error('Failed to mark notification as read');
                }
                return;
            }

            // Refetch to update the cache
            await refetch();
        } catch (error) {
            console.error('Mark as read error:', error);
            toast.error('Failed to mark notification as read');
        }
    };

    const markAllAsRead = async () => {
        try {
            if (!token) {
                toast.error('Authentication required');
                return;
            }

            const response = await fetch(`${API_BASE_URL}/api/notifications/mark-all-read`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    toast.error('Authentication failed');
                } else {
                    throw new Error('Failed to mark all notifications as read');
                }
                return;
            }

            // Refetch to update the cache
            await refetch();
        } catch (error) {
            console.error('Mark all as read error:', error);
            toast.error('Failed to mark all notifications as read');
        }
    };

    const getUnreadCount = async () => {
        try {
            if (!token) {
                return;
            }

            const response = await fetch(`${API_BASE_URL}/api/notifications/unread-count`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    console.warn('Authentication failed for unread count');
                } else {
                    throw new Error('Failed to get unread count');
                }
                return;
            }

            const result = await response.json();
            return result.count || 0;
        } catch (error) {
            console.error('Get unread count error:', error);
        }
    };

    return {
        data,
        isLoading,
        error,
        unreadCount,
        refetch,
        markAsRead,
        markAllAsRead,
        getUnreadCount
    };
};