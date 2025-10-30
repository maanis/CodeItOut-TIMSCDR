import { motion } from 'framer-motion';
import { Calendar, Trophy, Code2, Flame, Bell, TrendingUp, LogOut, Moon, Sun } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import StatCard from '@/components/dashboard/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { useTheme } from '@/contexts/ThemeContext';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { useEvents } from '@/hooks/useEvents';
import { useMyProjects } from '@/hooks/useProjects';
import { useNotifications } from '@/hooks/useNotifications';

import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

// const mockLeaderboard = [
//     { rank: 1, name: 'Alex Chen', points: 2450, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
//     { rank: 2, name: 'Sarah Kim', points: 2380, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
//     { rank: 3, name: 'Mike Johnson', points: 2210, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike' },
//     { rank: 4, name: 'Emma Wilson', points: 2150, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma' },
//     { rank: 5, name: 'David Lee', points: 2100, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' },
// ];

const mockProjects = [
    { id: 1, title: 'E-commerce Website', status: 'Submitted', score: 95 },
    { id: 2, title: 'Weather App', status: 'In Review', score: null },
];

const Dashboard = () => {

    const { theme, toggleTheme } = useTheme();
    const { user, logout, refreshUser } = useAuth();
    const navigate = useNavigate();
    const { data: announcements = [], isLoading: announcementsLoading, error: announcementsError } = useAnnouncements();
    const { data: events = [], isLoading: eventsLoading, error: eventsError } = useEvents();
    const { data: myProjectsData, isLoading: projectsLoading, error: projectsError } = useMyProjects();
    const { data: notifications = [], isLoading: notificationsLoading, unreadCount, markAllAsRead } = useNotifications();

    // Get projects from API response
    console.log(myProjectsData)
    const myProjects = myProjectsData || [];
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

    // Fetch latest user data on component mount
    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Greeting Section */}
            <div className="flex justify-between items-center">
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
                        <div className="absolute top-full left-0 w-80 z-50 bg-background border rounded-md shadow-lg">
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
            </div>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card shadow-card rounded-2xl p-8 relative overflow-hidden"
            >
                <div className="absolute inset-0 gradient-primary opacity-10" />
                <div className="relative z-10">
                    <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                        Hi, {user?.name}! 👋
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Welcome back to your coding journey
                    </p>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={Calendar} label="Events" value={events.length} index={0} gradient="gradient-primary" />
                <StatCard icon={Trophy} label="Badges Earned" value={user?.badges?.length || 0} index={1} gradient="gradient-accent" />
                <StatCard icon={Code2} label="Projects Submitted" value={myProjects.length} index={2} gradient="gradient-success" />
                <StatCard icon={Flame} label="Total Points" value={user?.badges?.reduce((sum, badge) => sum + (badge?.points || 0), 0) || 0} index={3} gradient="gradient-primary" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Announcements */}
                <Card className="glass-card shadow-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="w-5 h-5" />
                            Announcements
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {announcementsLoading ? (
                            // Loading skeleton
                            Array.from({ length: 3 }).map((_, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-3 rounded-lg bg-secondary/50"
                                >
                                    <div className="h-4 bg-muted rounded mb-2 animate-pulse"></div>
                                    <div className="h-3 bg-muted rounded w-1/2 animate-pulse"></div>
                                </motion.div>
                            ))
                        ) : announcementsError ? (
                            <div className="text-center py-4">
                                <p className="text-sm text-muted-foreground">Failed to load announcements</p>
                            </div>
                        ) : announcements.length === 0 ? (
                            <div className="text-center py-4">
                                <p className="text-sm text-muted-foreground">No announcements available</p>
                            </div>
                        ) : (
                            announcements.slice(0, 3).map((announcement, index) => (
                                <motion.div
                                    key={announcement._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ x: 4 }}
                                    className="p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
                                >
                                    <p className="font-medium text-sm mb-1">{announcement.title}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(announcement.createdAt).toLocaleDateString()}
                                    </p>
                                </motion.div>
                            ))
                        )}
                    </CardContent>
                </Card>

                {/* Upcoming Events */}
                <Card className="glass-card shadow-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            Events
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {eventsLoading ? (
                            // Loading skeleton
                            Array.from({ length: 3 }).map((_, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-4 rounded-lg bg-secondary/50"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="h-5 bg-muted rounded animate-pulse flex-1 mr-4"></div>
                                        <div className="h-5 bg-muted rounded w-16 animate-pulse"></div>
                                    </div>
                                    <div className="h-4 bg-muted rounded mb-2 animate-pulse"></div>
                                    <div className="h-3 bg-muted rounded w-1/2 animate-pulse"></div>
                                </motion.div>
                            ))
                        ) : eventsError ? (
                            <div className="text-center py-4">
                                <p className="text-sm text-muted-foreground">Failed to load events</p>
                            </div>
                        ) : events.length === 0 ? (
                            <div className="text-center py-4">
                                <p className="text-sm text-muted-foreground">No events available</p>
                            </div>
                        ) : (
                            events
                                // .filter(event => event.status === 'Upcoming')
                                .slice(0, 3)
                                .map((event, index) => (
                                    <motion.div
                                        key={event._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ scale: 1.02 }}
                                        className="p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <h4 className="font-semibold">{event.title}</h4>
                                            <Badge variant={event.status === 'Ongoing' ? 'default' : 'secondary'} className="text-xs">
                                                {event.status}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                                        <p className="text-xs text-muted-foreground">
                                            Created: {new Date(event.createdAt).toLocaleDateString()}
                                        </p>
                                    </motion.div>
                                ))
                        )}
                    </CardContent>
                </Card>

                {/* Recent Projects */}
                <Card className="glass-card shadow-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Code2 className="w-5 h-5" />
                            Recent Projects
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {projectsLoading ? (
                            // Loading skeleton
                            Array.from({ length: 2 }).map((_, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-4 rounded-lg bg-secondary/50"
                                >
                                    <div className="h-5 bg-muted rounded mb-2 animate-pulse"></div>
                                    <div className="h-4 bg-muted rounded w-1/3 mb-2 animate-pulse"></div>
                                    <div className="h-8 bg-muted rounded animate-pulse"></div>
                                </motion.div>
                            ))
                        ) : projectsError ? (
                            <div className="text-center py-4">
                                <p className="text-sm text-muted-foreground">Failed to load projects</p>
                            </div>
                        ) : myProjects.length === 0 ? (
                            <div className="text-center py-4">
                                <p className="text-sm text-muted-foreground">No projects submitted yet</p>
                            </div>
                        ) : (
                            myProjects.slice(0, 2).map((project, index) => (
                                <motion.div
                                    key={project._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.02 }}
                                    className="p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                                >
                                    <h4 className="font-semibold mb-2">{project.title}</h4>
                                    <div className="flex items-center justify-between mb-2">
                                        <Badge variant={project.approved ? "default" : "outline"}>
                                            {project.approved ? "Approved" : "Pending"}
                                        </Badge>
                                        {project.score && (
                                            <span className="text-sm font-medium text-success">{project.score}%</span>
                                        )}
                                    </div>
                                    <Button size="sm" variant="ghost" onClick={() => navigate('projects')} className="w-full">
                                        View Details
                                    </Button>
                                </motion.div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Leaderboard */}
            {/* <Card className="glass-card shadow-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Trophy className="w-5 h-5" />
                        Leaderboard Top 5
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {mockLeaderboard.map((user, index) => (
                            <motion.div
                                key={user.rank}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                            >
                                <div className="flex items-center gap-3 flex-1">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${user.rank === 1 ? 'gradient-primary text-white' :
                                        user.rank === 2 ? 'gradient-accent text-white' :
                                            user.rank === 3 ? 'gradient-success text-white' :
                                                'bg-muted'
                                        }`}>
                                        {user.rank}
                                    </div>
                                    <Avatar>
                                        <AvatarImage src={user.avatar} />
                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{user.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-success" />
                                    <span className="font-bold text-lg">{user.points}</span>
                                    <span className="text-muted-foreground text-sm">pts</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </CardContent>
            </Card> */}
        </div>
    );
};

export default Dashboard;