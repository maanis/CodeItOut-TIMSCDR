import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useNotifications = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/notifications`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch notifications');
            }

            const result = await response.json();
            setData(result.notifications || []);
            setUnreadCount(result.notifications?.filter(n => !n.hasRead).length || 0);
            setError(null);
        } catch (error) {
            console.error('Fetch notifications error:', error);
            setError(error.message);
            toast.error('Failed to load notifications');
        } finally {
            setIsLoading(false);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/notifications/${notificationId}/read`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to mark notification as read');
            }

            // Update local state
            setData(prev => prev.map(n =>
                n._id === notificationId ? { ...n, hasRead: true } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Mark as read error:', error);
            toast.error('Failed to mark notification as read');
        }
    };

    const markAllAsRead = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/notifications/mark-all-read`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to mark all notifications as read');
            }

            // Update local state
            setData(prev => prev.map(n => ({ ...n, hasRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Mark all as read error:', error);
            toast.error('Failed to mark all notifications as read');
        }
    };

    const getUnreadCount = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/notifications/unread-count`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to get unread count');
            }

            const result = await response.json();
            setUnreadCount(result.count || 0);
        } catch (error) {
            console.error('Get unread count error:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    return {
        data,
        isLoading,
        error,
        unreadCount,
        refetch: fetchNotifications,
        markAsRead,
        markAllAsRead,
        getUnreadCount
    };
};