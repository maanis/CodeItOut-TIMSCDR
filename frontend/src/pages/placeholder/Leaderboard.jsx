import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStudents } from '@/hooks/useStudents';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Leaderboard = () => {
    const { data: students = [], isLoading } = useStudents();

    // Calculate leaderboard from real student data
    const leaderboard = useMemo(() => {
        if (!students.length) return [];

        return students
            .map(student => ({
                id: student.id,
                name: student.name,
                avatar: student.avatarUrl ? `${API_BASE_URL}${student.avatarUrl}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`,
                points: student.badges?.reduce((sum, badge) => sum + (badge?.points || 0), 0) || 0,
                approvedProjects: student.projects?.length || 0,
                badgesCount: student.badges?.length || 0
            }))
            .sort((a, b) => b.points - a.points)
            .map((student, index) => ({
                ...student,
                rank: index + 1
            }));
    }, [students]);

    const getRankIcon = (rank) => {
        switch (rank) {
            case 1: return <Trophy className="w-8 h-8 text-yellow-500" />;
            case 2: return <Medal className="w-8 h-8 text-gray-400" />;
            case 3: return <Award className="w-8 h-8 text-orange-500" />;
            default: return <Star className="w-6 h-6 text-blue-500" />;
        }
    };

    const getRankColor = (rank) => {
        switch (rank) {
            case 1: return 'from-yellow-400 text-white to-yellow-600';
            case 2: return 'from-gray-300 text-white to-gray-500';
            case 3: return 'from-orange-400 text-white to-orange-600';
            default: return 'from-blue-400 text-white to-blue-600';
        }
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 w-full gap-5 flex items-center justify-start"
            >
                <Trophy className="w-8 h-8 mb-2 text-primary" />
                <div>
                    <h1 className="text-2xl font-bold mb-1">🏆 Leaderboard</h1>
                    <p className="text-sm text-muted-foreground">Top coders in our community</p>
                </div>
            </motion.div>

            {/* Top 3 Podium */}
            {leaderboard.length >= 3 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                >
                    {/* 2nd Place */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="order-1 md:order-1"
                    >
                        <Card className="glass-card shadow-card text-center p-6 relative">
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                    2
                                </div>
                            </div>
                            <CardContent className="pt-8">
                                <Avatar className="w-20 h-20 mx-auto mb-4">
                                    <AvatarImage src={leaderboard[1]?.avatar} />
                                    <AvatarFallback className="text-xl">{leaderboard[1]?.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <h3 className="text-xl font-bold mb-2">{leaderboard[1]?.name}</h3>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                    <p className="font-semibold text-lg text-primary">{leaderboard[1]?.points} points</p>
                                    <p>{leaderboard[1]?.badgesCount} badges • {leaderboard[1]?.approvedProjects} projects</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* 1st Place */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="order-2 md:order-2"
                    >
                        <Card className="glass-card shadow-card text-center p-6 relative border-2 border-yellow-400">
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white shadow-xl">
                                    <Trophy className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <CardContent className="pt-10">
                                <Avatar className="w-24 h-24 mx-auto mb-4 ring-4 ring-yellow-400/30">
                                    <AvatarImage src={leaderboard[0]?.avatar} />
                                    <AvatarFallback className="text-2xl">{leaderboard[0]?.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <h3 className="text-2xl font-bold mb-2">{leaderboard[0]?.name}</h3>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                    <p className="font-semibold text-xl text-primary">{leaderboard[0]?.points} points</p>
                                    <p>{leaderboard[0]?.badgesCount} badges • {leaderboard[0]?.approvedProjects} projects</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* 3rd Place */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="order-3 md:order-3"
                    >
                        <Card className="glass-card shadow-card text-center p-6 relative">
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                    3
                                </div>
                            </div>
                            <CardContent className="pt-8">
                                <Avatar className="w-20 h-20 mx-auto mb-4">
                                    <AvatarImage src={leaderboard[2]?.avatar} />
                                    <AvatarFallback className="text-xl">{leaderboard[2]?.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <h3 className="text-xl font-bold mb-2">{leaderboard[2]?.name}</h3>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                    <p className="font-semibold text-lg text-primary">{leaderboard[2]?.points} points</p>
                                    <p>{leaderboard[2]?.badgesCount} badges • {leaderboard[2]?.approvedProjects} projects</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            )}

            {/* Full Leaderboard */}
            <Card className="glass-card shadow-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Star className="w-5 h-5" />
                        Full Rankings
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isLoading ? (
                        // Loading skeleton
                        Array.from({ length: 7 }).map((_, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50"
                            >
                                <div className="w-12 h-12 rounded-full bg-muted animate-pulse"></div>
                                <div className="w-12 h-12 rounded-full bg-muted animate-pulse"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-5 bg-muted rounded animate-pulse"></div>
                                    <div className="h-4 bg-muted rounded w-1/3 animate-pulse"></div>
                                </div>
                                <div className="w-16 h-6 bg-muted rounded animate-pulse"></div>
                            </motion.div>
                        ))
                    ) : leaderboard.length === 0 ? (
                        <div className="text-center py-12">
                            <Trophy className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-xl font-semibold mb-2">No Students Yet</h3>
                            <p className="text-muted-foreground">Students will appear here once they join and earn badges.</p>
                        </div>
                    ) : (
                        leaderboard.map((entry, index) => (
                            <motion.div
                                key={entry.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`flex items-center gap-4 p-4 rounded-lg hover:bg-secondary/50 transition-colors ${index < 3 ? 'bg-secondary/30' : ''
                                    }`}
                            >
                                <div className={`w-12 h-12 rounded-full  ${getRankColor(entry.rank)} flex items-center justify-center text-white font-bold`}>
                                    {entry.rank <= 3 ? getRankIcon(entry.rank) : entry.rank}
                                </div>
                                <Avatar className="w-12 h-12">
                                    <AvatarImage src={entry.avatar} />
                                    <AvatarFallback>{entry.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <h4 className="font-semibold">{entry.name}</h4>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span>{entry.badgesCount} badges</span>
                                        <span>{entry.approvedProjects} projects</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg text-primary">{entry.points}</p>
                                    <p className="text-xs text-muted-foreground">points</p>
                                </div>
                            </motion.div>
                        ))
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Leaderboard;