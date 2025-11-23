import { motion } from 'framer-motion';
import { Users, Calendar, Trophy, FolderKanban, LogOut, Moon, Sun } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import StatCard from '@/components/dashboard/StatCard';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTheme } from '@/contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAdminDashboardStats } from '@/hooks/useDashboard';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef();

    // Fetch optimized admin stats from single endpoint
    const { data: statsResponse, isLoading: statsLoading } = useAdminDashboardStats();
    const statsData = statsResponse?.data || {};

    useEffect(() => {
        const handleClickOutside = (event) => {
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

    // Calculate stats from single API response
    const stats = [
        {
            label: 'Total Students',
            value: statsLoading ? '...' : statsData.totalStudents || 0,
            icon: Users,
            gradient: 'bg-gradient-to-br from-blue-500 to-cyan-500'
        },
        {
            label: 'Active Events',
            value: statsLoading ? '...' : statsData.totalEvents || 0,
            icon: Calendar,
            gradient: 'bg-gradient-to-br from-purple-500 to-pink-500'
        },
        {
            label: 'Projects Pending',
            value: statsLoading ? '...' : statsData.totalPendingProjects || 0,
            icon: FolderKanban,
            gradient: 'bg-gradient-to-br from-orange-500 to-red-500'
        },
        {
            label: 'Total Badges',
            value: statsLoading ? '...' : statsData.totalBadges || 0,
            icon: Trophy,
            gradient: 'bg-gradient-to-br from-green-500 to-emerald-500'
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header with User Menu */}
            {/* <div className="flex justify-end items-center">
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
                                <AvatarImage src={'https://www.timscdrmumbai.in/wp-content/uploads/2020/07/TIMSCDR-Header1-e1594097959343.png' || user?.avatar} alt={user?.name} />
                                <AvatarFallback className="gradient-primary text-white">
                                    {user?.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                        </Button>

                        {isUserMenuOpen && (
                            <div className="absolute top-full overflow-hidden right-0 z-50 bg-background border rounded-md shadow-lg min-w-48">
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
            </div> */}

            {/* Welcome Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-8 rounded-2xl"
            >
                <h1 className="text-4xl font-bold mb-2">
                    Welcome back, Admin 👋
                </h1>
                <p className="text-muted-foreground">
                    {user?.name} • {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <StatCard key={stat.label} {...stat} index={index} />
                ))}
            </div>

            {/* Quick Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-card p-6 rounded-2xl"
            >
                <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                        { title: 'Create Announcement', desc: 'Post a new club announcement', color: 'from-blue-500 to-cyan-500', path: '/admin/announcements' },
                        { title: 'Add Event', desc: 'Schedule a new coding event', color: 'from-purple-500 to-pink-500', path: '/admin/events' },
                        { title: 'Review Projects', desc: 'Approve pending submissions', color: 'from-orange-500 to-red-500', path: '/admin/projects' },
                    ].map((action, i) => (
                        <motion.button
                            key={action.title}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate(action.path)}
                            className="p-6 rounded-xl bg-gradient-to-br text-foreground text-left shadow-lg cursor-pointer"
                            style={{ backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))` }}
                        >
                            <h3 className="font-bold text-lg mb-1">{action.title}</h3>
                            <p className="text-sm opacity-90">{action.desc}</p>
                        </motion.button>
                    ))}
                </div>
            </motion.div>

            {/* Recent Activity */}
            {/* <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass-card p-6 rounded-2xl"
            >
                <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
                <div className="space-y-3">
                    {[
                        { user: 'John Doe', action: 'submitted a project', time: '2 minutes ago' },
                        { user: 'Jane Smith', action: 'joined the club', time: '15 minutes ago' },
                        { user: 'Mike Johnson', action: 'earned a badge', time: '1 hour ago' },
                        { user: 'Sarah Williams', action: 'registered for event', time: '2 hours ago' },
                    ].map((activity, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 + i * 0.05 }}
                            className="flex items-center justify-between p-4 rounded-lg hover:bg-secondary/50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold">
                                    {activity.user.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-medium">{activity.user}</p>
                                    <p className="text-sm text-muted-foreground">{activity.action}</p>
                                </div>
                            </div>
                            <span className="text-sm text-muted-foreground">{activity.time}</span>
                        </motion.div>
                    ))}
                </div>
            </motion.div> */}
        </div>
    );
};

export default AdminDashboard;