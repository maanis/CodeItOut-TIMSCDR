import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { useWindowSize } from '@/hooks/useWindowSize';
import { Trophy, Target, Calendar, Award, TrendingUp, Code2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import StatCard from '@/components/dashboard/StatCard';
import { useAuth } from '@/contexts/AuthContext';
import { useStudents } from '@/hooks/useStudents';

const StudentDashboard = () => {
    const [showConfetti, setShowConfetti] = useState(false);
    const { width, height } = useWindowSize();
    const { user } = useAuth();
    const { data: students = [] } = useStudents();

    // Get badges from user state
    const userBadges = user?.badges || [];

    // Calculate user's rank based on points
    const userRank = useMemo(() => {
        if (!students.length || !user) return null;

        const userPoints = user.badges?.reduce((sum, badge) => sum + (badge?.points || 0), 0) || 0;

        // Create sorted list of all students by points
        const sortedStudents = students
            .map(student => ({
                id: student.id,
                points: student.badges?.reduce((sum, badge) => sum + (badge?.points || 0), 0) || 0
            }))
            .sort((a, b) => b.points - a.points);

        // Find user's rank
        const rankIndex = sortedStudents.findIndex(student => student.id === user.id);
        return rankIndex !== -1 ? rankIndex + 1 : null;
    }, [students, user]);

    // Get rank suffix (1st, 2nd, 3rd, 4th, etc.)
    const getRankSuffix = (rank) => {
        if (!rank) return 'th';
        const lastDigit = rank % 10;
        const lastTwoDigits = rank % 100;

        if (lastTwoDigits >= 11 && lastTwoDigits <= 13) return 'th';
        if (lastDigit === 1) return 'st';
        if (lastDigit === 2) return 'nd';
        if (lastDigit === 3) return 'rd';
        return 'th';
    };

    // Mock goals data (keeping for now)
    const mockGoals = [
        { id: 1, title: 'Complete React Course', progress: 75, total: 100 },
        { id: 2, title: 'Submit 5 Projects', progress: 3, total: 5 },
        { id: 3, title: 'Attend 10 Workshops', progress: 7, total: 10 },
    ];

    // Simulate new achievement
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 5000);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="space-y-6 max-w-7xl">
            {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} />}

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card shadow-card rounded-2xl p-8 relative overflow-hidden"
            >
                <div className="absolute inset-0 gradient-accent opacity-10" />
                <div className="relative z-10">
                    <h1 className="text-3xl lg:text-4xl font-bold mb-2">My Progress</h1>
                    <p className="text-muted-foreground text-lg">Track your coding journey and achievements</p>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={Code2} label="Total Points" value={user?.badges?.reduce((sum, badge) => sum + (badge?.points || 0), 0) || 0} index={0} gradient="gradient-primary" />
                <StatCard icon={Trophy} label="Rank" value={userRank || '--'} suffix={userRank ? getRankSuffix(userRank) : ''} index={1} gradient="gradient-accent" />
                <StatCard icon={Target} label="Goals Completed" value={8} suffix="/12" index={2} gradient="gradient-success" />
                <StatCard icon={Calendar} label="Days Active" value={45} index={3} gradient="gradient-primary" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Learning Goals */}
                <Card className="glass-card shadow-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="w-5 h-5" />
                            Learning Goals
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {mockGoals.map((goal, index) => (
                            <motion.div
                                key={goal.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="space-y-2"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium">{goal.title}</span>
                                    <span className="text-sm text-muted-foreground">
                                        {goal.progress}/{goal.total}
                                    </span>
                                </div>
                                <Progress value={(goal.progress / goal.total) * 100} className="h-3" />
                            </motion.div>
                        ))}
                    </CardContent>
                </Card>

                {/* Coding Streak Calendar */}
                <Card className="glass-card shadow-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Coding Streak
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center mb-6">
                            <div className="text-5xl font-bold gradient-primary bg-clip-text text-transparent mb-2">
                                23
                            </div>
                            <p className="text-muted-foreground">Days in a row 🔥</p>
                        </div>
                        <div className="grid grid-cols-7 gap-2">
                            {[...Array(28)].map((_, i) => {
                                const hasActivity = i < 23;
                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: i * 0.02 }}
                                        className={`aspect-square rounded-md ${hasActivity ? 'gradient-primary' : 'bg-secondary'
                                            }`}
                                    />
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Badges & Achievements */}
            <Card className="glass-card shadow-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Award className="w-5 h-5" />
                        Badges & Achievements ({userBadges.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {userBadges.length === 0 ? (
                        <div className="text-center py-12">
                            <Award className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-xl font-semibold mb-2">No Badges Earned Yet</h3>
                            <p className="text-muted-foreground">
                                Keep coding and participating to earn your first badge!
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {userBadges.map((badge, index) => (
                                <motion.div
                                    key={badge._id || index}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    className="aspect-square rounded-xl p-4 flex flex-col items-center justify-center gap-2 glass-card shadow-glow cursor-pointer"
                                >
                                    <div className="text-4xl">{badge.icon}</div>
                                    <p className="text-xs font-medium text-center">{badge.name}</p>
                                    <Badge variant="outline" className="text-xs">
                                        {badge.points} pts
                                    </Badge>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default StudentDashboard;