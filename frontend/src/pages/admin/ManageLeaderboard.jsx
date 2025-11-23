import { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Trophy, ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useLeaderboard, useRebuildLeaderboard } from '@/hooks/useLeaderboard';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ManageLeaderboard = () => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [isRebuilding, setIsRebuilding] = useState(false);

    const { data: leaderboardResponse = {}, isLoading, refetch } = useLeaderboard(page, limit);
    const { data: leaderboard = [], pagination = {} } = leaderboardResponse;

    const getRankColor = (rank) => {
        switch (rank) {
            case 1: return 'from-yellow-400 to-yellow-600';
            case 2: return 'from-gray-300 to-gray-500';
            case 3: return 'from-orange-400 to-orange-600';
            default: return 'from-blue-400 to-blue-600';
        }
    };

    const handleRefresh = async () => {
        try {
            refetch();
            toast.success('Leaderboard refreshed!');
        } catch (error) {
            toast.error('Failed to refresh leaderboard');
        }
    };

    const handleRebuild = async () => {
        try {
            setIsRebuilding(true);
            const response = await axios.post(`${API_BASE_URL}/leaderboard/rebuild`);
            if (response.data.success) {
                toast.success(`Leaderboard rebuilt! Added ${response.data.data.addedCount} students`);
                refetch();
            }
        } catch (error) {
            toast.error('Failed to rebuild leaderboard');
            console.error(error);
        } finally {
            setIsRebuilding(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Manage Leaderboard</h1>
                    <p className="text-muted-foreground mt-1">View and manage top coders - Page {page}</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        className="gradient-primary text-white"
                        onClick={handleRebuild}
                        disabled={isRebuilding}
                    >
                        {isRebuilding ? (
                            <>
                                <Loader className="w-4 h-4 mr-2 animate-spin" />
                                Rebuilding...
                            </>
                        ) : (
                            <>
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Rebuild All
                            </>
                        )}
                    </Button>
                    <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                </div>
            </div>

            <div className="grid gap-4">
                {isLoading ? (
                    // Loading skeleton
                    Array.from({ length: limit }).map((_, index) => (
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
                        <p className="text-muted-foreground">Click "Rebuild All" to populate the leaderboard from database.</p>
                    </div>
                ) : (
                    <>
                        {leaderboard.map((entry, index) => (
                            <motion.div
                                key={entry.studentId}
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
                                        <AvatarFallback>{entry.name?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold">{entry.name}</h3>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <span>{entry.points} points</span>
                                            <span>{entry.badgesCount} badges</span>
                                            <span>{entry.projectsCount} projects</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {/* Pagination Controls */}
                        {pagination.totalPages > 1 && (
                            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                                <p className="text-sm text-muted-foreground">
                                    Showing {(page - 1) * limit + 1} to {Math.min(page * limit, pagination.totalItems)} of {pagination.totalItems} students
                                </p>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1 || isLoading}
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        Previous
                                    </Button>
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: Math.min(5, pagination.totalPages) }).map((_, i) => {
                                            const pageNum = i + 1;
                                            return (
                                                <Button
                                                    key={pageNum}
                                                    variant={page === pageNum ? 'default' : 'ghost'}
                                                    size="sm"
                                                    onClick={() => setPage(pageNum)}
                                                >
                                                    {pageNum}
                                                </Button>
                                            );
                                        })}
                                        {pagination.totalPages > 5 && <span className="text-muted-foreground">...</span>}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                                        disabled={page === pagination.totalPages || isLoading}
                                    >
                                        Next
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ManageLeaderboard;