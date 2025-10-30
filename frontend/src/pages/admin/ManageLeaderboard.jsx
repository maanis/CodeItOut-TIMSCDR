import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useStudents } from '@/hooks/useStudents';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ManageLeaderboard = () => {
    const { data: students = [], isLoading, refetch } = useStudents();

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
                rank: index + 1,
                change: 'same' // For now, we'll keep it simple
            }));
    }, [students]);

    const handleRefresh = () => {
        refetch();
        toast.success('Leaderboard refreshed!');
    };

    const getRankColor = (rank) => {
        switch (rank) {
            case 1: return 'from-yellow-400 to-yellow-600';
            case 2: return 'from-gray-300 to-gray-500';
            case 3: return 'from-orange-400 to-orange-600';
            default: return 'from-blue-400 to-blue-600';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Manage Leaderboard</h1>
                    <p className="text-muted-foreground mt-1">View and refresh top coders</p>
                </div>
                <Button className="gradient-primary text-white" onClick={handleRefresh}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Rankings
                </Button>
            </div>

            <div className="grid gap-4">
                {isLoading ? (
                    // Loading skeleton
                    Array.from({ length: 5 }).map((_, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-card p-6 rounded-xl"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-muted animate-pulse"></div>
                                <div className="w-14 h-14 rounded-full bg-muted animate-pulse"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-5 bg-muted rounded animate-pulse"></div>
                                    <div className="h-4 bg-muted rounded w-1/3 animate-pulse"></div>
                                </div>
                                <div className="w-12 h-6 bg-muted rounded animate-pulse"></div>
                            </div>
                        </motion.div>
                    ))
                ) : leaderboard.length === 0 ? (
                    <div className="text-center py-12">
                        <Trophy className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No Students Yet</h3>
                        <p className="text-muted-foreground">Students will appear here once they join and earn badges.</p>
                    </div>
                ) : (
                    leaderboard.slice(0, 10).map((entry, index) => (
                        <motion.div
                            key={entry.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-card p-6 rounded-xl"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getRankColor(entry.rank)} flex items-center justify-center text-white font-bold text-xl`}>
                                    {entry.rank <= 3 ? <Trophy className="w-8 h-8" /> : entry.rank}
                                </div>
                                <Avatar className="w-14 h-14">
                                    <AvatarImage src={entry.avatar} />
                                    <AvatarFallback>{entry.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold">{entry.name}</h3>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span>{entry.points} points</span>
                                        <span>{entry.badgesCount} badges</span>
                                        <span>{entry.approvedProjects} projects</span>
                                    </div>
                                </div>
                                <Badge variant={entry.change === 'up' ? 'default' : entry.change === 'down' ? 'destructive' : 'secondary'}>
                                    {entry.change === 'up' ? '↑' : entry.change === 'down' ? '↓' : '→'}
                                </Badge>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ManageLeaderboard;