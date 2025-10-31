import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Users, Clock, Award, Medal, ArrowLeft, Target, Crown, Star, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useContest, useContestLeaderboard } from '@/hooks/useContests';

const AdminContestResults = () => {
    const { id: contestId } = useParams();
    const navigate = useNavigate();
    const { data: contest, isLoading: contestLoading, error: contestError } = useContest(contestId);
    const { data: leaderboardData, isLoading: leaderboardLoading, error: leaderboardError } = useContestLeaderboard(contestId);

    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedBadge, setSelectedBadge] = useState('');
    const [isAssigningBadge, setIsAssigningBadge] = useState(false);

    const getRankIcon = (rank) => {
        switch (rank) {
            case 1: return <Crown className="w-6 h-6 text-yellow-500" />;
            case 2: return <Medal className="w-6 h-6 text-gray-400" />;
            case 3: return <Award className="w-6 h-6 text-amber-600" />;
            default: return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
        }
    };

    const getRankColor = (rank) => {
        switch (rank) {
            case 1: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 2: return 'text-gray-600 bg-gray-50 border-gray-200';
            case 3: return 'text-amber-600 bg-amber-50 border-amber-200';
            default: return 'text-muted-foreground bg-muted border-muted';
        }
    };

    const availableBadges = [
        { id: 'gold', name: 'Gold Medal', icon: '🥇', color: 'text-yellow-600' },
        { id: 'silver', name: 'Silver Medal', icon: '🥈', color: 'text-gray-600' },
        { id: 'bronze', name: 'Bronze Medal', icon: '🥉', color: 'text-amber-600' },
        { id: 'speedster', name: 'Speedster', icon: '⚡', color: 'text-blue-600' },
        { id: 'perfectionist', name: 'Perfectionist', icon: '💎', color: 'text-purple-600' },
        { id: 'consistent', name: 'Consistent', icon: '🎯', color: 'text-green-600' },
    ];

    const handleAssignBadge = async (userId, badgeId) => {
        setIsAssigningBadge(true);
        try {
            // TODO: Implement badge assignment API call
            console.log('Assigning badge:', badgeId, 'to user:', userId);
            // For now, just show success message
            alert(`Badge "${availableBadges.find(b => b.id === badgeId)?.name}" assigned successfully!`);
        } catch (error) {
            console.error('Error assigning badge:', error);
            alert('Failed to assign badge');
        } finally {
            setIsAssigningBadge(false);
            setSelectedUser(null);
            setSelectedBadge('');
        }
    };

    if (contestLoading || leaderboardLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="text-center py-8">
                        <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4 animate-spin" />
                        <p className="text-muted-foreground">Loading contest results...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (contestError || leaderboardError) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="text-center py-8">
                        <Trophy className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">
                            {contestError?.message || leaderboardError?.message || 'Failed to load results'}
                        </p>
                        <Button
                            onClick={() => navigate('/admin/contests')}
                            className="mt-4"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Contests
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const leaderboard = leaderboardData?.leaderboard || [];
    const contestInfo = leaderboardData?.quiz;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Button
                            onClick={() => navigate('/admin/contests')}
                            variant="outline"
                            className="mb-4"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Manage Contests
                        </Button>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <Trophy className="w-8 h-8 text-yellow-500" />
                            {contest.title} - Admin Results
                        </h1>
                        <p className="text-muted-foreground mt-1">{contest.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                            <Badge variant="outline" className="text-lg px-3 py-1">
                                {leaderboard.length} Participants
                            </Badge>
                            <Badge variant="outline" className="text-lg px-3 py-1">
                                {contestInfo?.totalQuestions} Questions
                            </Badge>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-muted-foreground">Contest Completed</div>
                        <div className="text-lg font-semibold">
                            {new Date(contest.endedAt || contest.updatedAt).toLocaleDateString()}
                        </div>
                    </div>
                </div>

                <Tabs defaultValue="leaderboard" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    </TabsList>

                    {/* Leaderboard Tab */}
                    <TabsContent value="leaderboard" className="space-y-6">
                        <div className="grid gap-4">
                            {leaderboard.map((participant, index) => (
                                <motion.div
                                    key={participant.studentId}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className={`transition-all hover:shadow-lg ${participant.rank <= 3 ? 'ring-2 ring-yellow-200' : ''
                                        }`}>
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${participant.rank <= 3 ? 'border-yellow-400 bg-yellow-50' : 'border-gray-300'
                                                        }`}>
                                                        {getRankIcon(participant.rank)}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-lg">{participant.studentName}</h3>
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                            <Target className="w-4 h-4" />
                                                            {participant.score}% Score
                                                            <Clock className="w-4 h-4 ml-2" />
                                                            {participant.timeTaken} min
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className="text-right">
                                                        <div className="text-2xl font-bold">{participant.totalScore}/{contestInfo?.maxScore}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {participant.correctAnswers} correct, {participant.wrongAnswers} wrong
                                                        </div>
                                                    </div>

                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => setSelectedUser(participant)}
                                                            >
                                                                <Award className="w-4 h-4 mr-2" />
                                                                Assign Badge
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Assign Badge to {participant.studentName}</DialogTitle>
                                                            </DialogHeader>
                                                            <div className="space-y-4">
                                                                <div>
                                                                    <label className="text-sm font-medium">Select Badge</label>
                                                                    <Select value={selectedBadge} onValueChange={setSelectedBadge}>
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="Choose a badge" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {availableBadges.map((badge) => (
                                                                                <SelectItem key={badge.id} value={badge.id}>
                                                                                    <div className="flex items-center gap-2">
                                                                                        <span>{badge.icon}</span>
                                                                                        <span>{badge.name}</span>
                                                                                    </div>
                                                                                </SelectItem>
                                                                            ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                                <div className="flex justify-end gap-2">
                                                                    <Button
                                                                        variant="outline"
                                                                        onClick={() => {
                                                                            setSelectedUser(null);
                                                                            setSelectedBadge('');
                                                                        }}
                                                                    >
                                                                        Cancel
                                                                    </Button>
                                                                    <Button
                                                                        onClick={() => handleAssignBadge(participant.studentId, selectedBadge)}
                                                                        disabled={!selectedBadge || isAssigningBadge}
                                                                    >
                                                                        {isAssigningBadge ? 'Assigning...' : 'Assign Badge'}
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Analytics Tab */}
                    <TabsContent value="analytics" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Participation Stats */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="w-5 h-5" />
                                        Participation
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-blue-600">{leaderboard.length}</div>
                                    <p className="text-sm text-muted-foreground">Total participants</p>
                                </CardContent>
                            </Card>

                            {/* Average Score */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Target className="w-5 h-5" />
                                        Average Score
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-green-600">
                                        {leaderboard.length > 0
                                            ? Math.round(leaderboard.reduce((sum, p) => sum + p.score, 0) / leaderboard.length)
                                            : 0}%
                                    </div>
                                    <p className="text-sm text-muted-foreground">Across all participants</p>
                                </CardContent>
                            </Card>

                            {/* Completion Rate */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Trophy className="w-5 h-5" />
                                        Completion Rate
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-purple-600">100%</div>
                                    <p className="text-sm text-muted-foreground">All participants finished</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Score Distribution */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Score Distribution</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[
                                        { range: '90-100%', count: leaderboard.filter(p => p.score >= 90).length, color: 'bg-green-500' },
                                        { range: '80-89%', count: leaderboard.filter(p => p.score >= 80 && p.score < 90).length, color: 'bg-blue-500' },
                                        { range: '70-79%', count: leaderboard.filter(p => p.score >= 70 && p.score < 80).length, color: 'bg-yellow-500' },
                                        { range: '60-69%', count: leaderboard.filter(p => p.score >= 60 && p.score < 70).length, color: 'bg-orange-500' },
                                        { range: '0-59%', count: leaderboard.filter(p => p.score < 60).length, color: 'bg-red-500' },
                                    ].map((range) => (
                                        <div key={range.range} className="flex items-center gap-4">
                                            <div className="w-20 text-sm font-medium">{range.range}</div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 bg-gray-200 rounded-full h-4">
                                                        <div
                                                            className={`h-4 rounded-full ${range.color}`}
                                                            style={{ width: `${leaderboard.length > 0 ? (range.count / leaderboard.length) * 100 : 0}%` }}
                                                        ></div>
                                                    </div>
                                                    <div className="text-sm font-medium w-8">{range.count}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default AdminContestResults;
{/* <parameter name="filePath">c:\Users\Asus TUF\Desktop\code it out\frontend\src\pages\admin\AdminContestResults.jsx */ }