import { Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Menu, Bell, LogOut, Moon, Sun } from 'lucide-react';
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
    console.log(notifications)
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const notificationsRef = useRef();
    const userMenuRef = useRef();

    console.log(user.avatar)

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
        navigate('/');
    };
    return (
        <div className="flex flex-1 h-screen">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
                <div className="flex flex-col min-h-full">
                    {/* Header with mobile menu, notifications, and user menu */}
                    <div className="flex relative z-50 justify-between items-center p-4 md:p-6 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={toggleMobileMenu}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>

                        <div ref={notificationsRef} className="relative">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full relative"
                                onClick={() => {
                                    setIsNotificationsOpen(!isNotificationsOpen);
                                    if (!isNotificationsOpen) {
                                        markAllAsRead();
                                    }
                                }}
                            >
                                <Bell className="w-5 h-5" />
                                {unreadCount > 0 && (
                                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 gradient-primary border-0 text-white text-xs">
                                        {unreadCount}
                                    </Badge>
                                )}
                            </Button>
                            {isNotificationsOpen && (
                                <div className="absolute top-full left-0 w-80 z-[10000] bg-background border rounded-md shadow-lg">
                                    <div className="p-3 font-medium border-b">Notifications</div>
                                    {notificationsLoading ? (
                                        <div className="p-3 text-center text-muted-foreground">Loading...</div>
                                    ) : notifications?.length > 0 ? (
                                        notifications.map((notification) => (
                                            <div key={notification._id} className="p-3 hover:bg-muted cursor-pointer flex flex-col items-start">
                                                <div className="flex items-start gap-2 w-full">
                                                    {!notification.hasRead && (
                                                        <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                                    )}
                                                    <div className="flex-1">
                                                        <p className="text-sm">{notification.content}</p>
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            {new Date(notification.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-3 text-center text-muted-foreground">No notifications</div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* User menu */}
                        <div className="flex gap-3 items-center">
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
                            <div ref={userMenuRef} className="relative">
                                <Button
                                    variant="ghost"
                                    className="relative h-10 w-10 rounded-full"
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                >
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={user?.avatar} alt={user?.name} />
                                        <AvatarFallback className="gradient-primary text-white">
                                            {user?.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>

                                {isUserMenuOpen && (
                                    <div className="absolute top-full overflow-hidden right-0 z-[10000] bg-background border rounded-md shadow-lg min-w-48">
                                        <div className="p-3 border-b">
                                            <div className="flex flex-col">
                                                <span className="font-medium">{user?.name}</span>
                                                <span className="text-xs text-muted-foreground font-normal">
                                                    {user?.email}
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={handleLogout}
                                            className="p-3 hover:bg-red-600 hover:text-white overflow-hidden cursor-pointer flex items-center"
                                        >
                                            <LogOut className="w-4 h-4 mr-2" />
                                            Logout
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Main content */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="flex-1 p-6   lg:p-8"
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