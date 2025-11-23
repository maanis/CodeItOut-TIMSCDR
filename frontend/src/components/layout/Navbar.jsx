import { useState, useRef, useEffect } from 'react';
import { Bell, Moon, Sun, Settings, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const mockNotifications = [
    { id: 1, text: 'New event: React Workshop starting in 2 days', time: '5m ago', unread: true },
    { id: 2, text: 'You earned a new badge: Code Warrior', time: '1h ago', unread: true },
    { id: 3, text: 'Project submission deadline: Tomorrow', time: '3h ago', unread: false },
];

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [unreadCount, setUnreadCount] = useState(
        mockNotifications.filter(n => n.unread).length
    );
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const notificationsRef = useRef(null);
    const userMenuRef = useRef(null);

    // Click-outside detection
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
        <nav className="flex justify-between items-center p-4 sticky top-0 bg-background z-40 border-b border-border shadow-sm">
            {/* Left: Title */}
            <div className="text-lg font-bold text-foreground">
                Dashboard
            </div>

            {/* Right: Actions */}
            <div className="flex gap-3 items-center">
                {/* Notifications */}
                <div ref={notificationsRef} className="relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full relative"
                        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    >
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && (
                            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 gradient-primary border-0 text-white text-xs rounded-full">
                                {unreadCount}
                            </Badge>
                        )}
                    </Button>

                    {/* Notifications Dropdown */}
                    {isNotificationsOpen && (
                        <div className="absolute top-full right-0 mt-2 w-80 max-h-96 z-[10000] bg-background border rounded-md shadow-lg overflow-hidden">
                            <div className="p-3 font-medium border-b">Notifications</div>
                            <div className="overflow-y-auto max-h-80">
                                {mockNotifications.length > 0 ? (
                                    mockNotifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className="p-3 hover:bg-muted cursor-pointer flex flex-col items-start border-b last:border-b-0 transition-colors"
                                        >
                                            <div className="flex items-start gap-2 w-full">
                                                {notification.unread && (
                                                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                                )}
                                                <div className="flex-1">
                                                    <p className="text-sm text-foreground">{notification.text}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
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
                <div ref={userMenuRef} className="relative">
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

                    {/* User Menu Dropdown */}
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
                                className="flex items-center gap-2 p-3 hover:bg-secondary text-foreground cursor-pointer border-b text-sm transition-colors"
                            >
                                <User className="h-4 w-4" />
                                Profile
                            </a>
                            <a
                                href="/dashboard/settings"
                                className="flex items-center gap-2 p-3 hover:bg-secondary text-foreground cursor-pointer border-b text-sm transition-colors"
                            >
                                <Settings className="h-4 w-4" />
                                Settings
                            </a>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2 p-3 hover:bg-destructive/10 text-destructive cursor-pointer text-sm transition-colors"
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;