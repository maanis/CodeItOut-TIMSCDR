import { Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Menu, Bell, LogOut, Moon, Sun, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useMobileMenu } from '@/contexts/MobileMenuContext';
import { useNotifications } from '@/hooks/useNotifications';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
    const { theme, toggleTheme } = useTheme();
    const { toggleMobileMenu } = useMobileMenu();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { data: notifications = [], isLoading: notificationsLoading, unreadCount, markAllAsRead } = useNotifications();
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const notificationsRef = useRef();
    const userMenuRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
                setIsNotificationsOpen(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex flex-1 h-screen">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
                <div className="flex flex-col min-h-full">
                    {/* Header */}
                    <nav className="flex justify-between items-center p-4 sticky top-0 bg-background z-40 border-b border-border shadow-sm">
                        {/* Left: Mobile Menu & Title */}
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden"
                                onClick={toggleMobileMenu}
                            >
                                <Menu className="h-5 w-5" />
                            </Button>
                            <div className="text-lg font-bold text-foreground hidden lg:block">
                                Dashboard
                            </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex gap-3 items-center">
                            {/* Notifications */}
                            <div ref={notificationsRef} className="relative">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full relative"
                                    onClick={() => {
                                        setIsNotificationsOpen(!isNotificationsOpen);
                                        if (!isNotificationsOpen && unreadCount > 0) {
                                            markAllAsRead();
                                        }
                                    }}
                                >
                                    <Bell className="w-5 h-5" />
                                    {unreadCount > 0 && (
                                        <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 gradient-primary border-0 text-white text-xs rounded-full">
                                            {unreadCount}
                                        </Badge>
                                    )}
                                </Button>
                                {isNotificationsOpen && (
                                    <div className="absolute top-full right-0 mt-2 w-80 max-h-96 overflow-y-auto z-[10000] bg-background border rounded-md shadow-lg">
                                        <div className="p-3 font-medium border-b">Notifications</div>
                                        <div className="overflow-y-auto max-h-80">
                                            {notificationsLoading ? (
                                                <div className="p-3 text-center text-sm text-muted-foreground">
                                                    Loading...
                                                </div>
                                            ) : notifications?.length > 0 ? (
                                                notifications.map((notification) => (
                                                    <div
                                                        key={notification._id}
                                                        className="p-3 hover:bg-muted cursor-pointer flex flex-col items-start border-b last:border-b-0"
                                                    >
                                                        <div className="flex items-start gap-2 w-full">
                                                            {!notification.hasRead && (
                                                                <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                                            )}
                                                            <div className="flex-1">
                                                                <p className="text-sm text-foreground">{notification.content}</p>
                                                                <p className="text-xs text-muted-foreground mt-1">
                                                                    {new Date(notification.createdAt).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-3 text-center text-sm text-muted-foreground">
                                                    No notifications
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Theme Toggle */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleTheme}
                                className="rounded-full"
                            >
                                {theme === 'light' ? (
                                    <Moon className="w-5 h-5" />
                                ) : (
                                    <Sun className="w-5 h-5" />
                                )}
                            </Button>

                            {/* User Menu */}
                            <div ref={userMenuRef} className="relative flex justify-center items-center">
                                <Button
                                    variant="ghost"
                                    className="relative h-10 w-10 rounded-full p-0"
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                >
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={user?.avatar} alt={user?.name} />
                                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-white font-bold">
                                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>

                                {isUserMenuOpen && (
                                    <div className="absolute top-full right-0 mt-2 w-56 z-[10000] bg-background border rounded-md shadow-lg overflow-hidden">
                                        <div className="p-3 border-b">
                                            <div className="flex flex-col">
                                                <span className="font-semibold">{user?.name || 'User'}</span>
                                                <span className="text-xs text-muted-foreground font-normal">
                                                    {user?.email || 'user@email.com'}
                                                </span>
                                            </div>
                                        </div>
                                        <a
                                            href="/dashboard/student"
                                            className="flex items-center gap-2 p-3 hover:bg-secondary text-foreground cursor-pointer border-b text-sm"
                                        >
                                            <User className="h-4 w-4" />
                                            Profile
                                        </a>
                                        <a
                                            href="/dashboard/settings"
                                            className="flex items-center gap-2 p-3 hover:bg-secondary text-foreground cursor-pointer border-b text-sm"
                                        >
                                            <Settings className="h-4 w-4" />
                                            Settings
                                        </a>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2 p-3 hover:bg-destructive/10 text-destructive cursor-pointer text-sm"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </nav>

                    {/* Main content */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="flex-1 p-6 lg:p-8"
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;