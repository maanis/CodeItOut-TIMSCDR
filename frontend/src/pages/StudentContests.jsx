import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Clock, Users, Play, AlertCircle, Calendar, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useContests } from '@/hooks/useContests';
import { useNavigate } from 'react-router-dom';

const StudentContests = () => {
    const [page, setPage] = useState(1);
    const limit = 10;
    const { data, isLoading, error } = useContests(page, limit);
    const contests = data?.quizzes || [];
    const pagination = data?.pagination || { page: 1, pages: 1 };
    const navigate = useNavigate();

    const handleJoinContest = (contestId, status) => {
        if (status === 'upcoming') {
            // Navigate to waiting room
            navigate(`/contests/${contestId}/waiting`);
        } else if (status === 'ongoing') {
            // Navigate to quiz interface
            navigate(`/contests/${contestId}/take`);
        }
    };

    const handleViewResults = (contestId) => {
        navigate(`/contests/${contestId}/results`);
    };

    const canJoinContest = (status) => {
        return status === 'upcoming' || status === 'ongoing';
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'upcoming': return 'secondary';
            case 'ongoing': return 'default';
            case 'completed': return 'outline';
            default: return 'outline';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Contests</h1>
                    <p className="text-muted-foreground">Join coding contests and test your skills</p>
                </div>
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Error loading contests: {error.message}
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid gap-6">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                        <Card key={index}>
                            <CardHeader>
                                <Skeleton className="h-6 w-1/3" />
                                <Skeleton className="h-4 w-1/2" />
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : contests.length === 0 ? (
                    <Card>
                        <CardContent className="text-center py-8">
                            <Trophy className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">No contests available at the moment</p>
                        </CardContent>
                    </Card>
                ) : (
                    contests.map((contest) => (
                        <Card key={contest._id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            <Trophy className="w-5 h-5" />
                                            {contest.title}
                                            <Badge variant={getStatusColor(contest.status)}>
                                                {contest.status}
                                            </Badge>
                                        </CardTitle>
                                        <p className="text-muted-foreground mt-1">{contest.description}</p>
                                    </div>
                                    {canJoinContest(contest.status) && (
                                        <Button
                                            onClick={() => handleJoinContest(contest._id, contest.status)}
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            <Play className="w-4 h-4 mr-1" />
                                            Join Contest
                                        </Button>
                                    )}
                                    {contest.status === 'completed' && (
                                        <Button
                                            onClick={() => handleViewResults(contest._id)}
                                            variant="outline"
                                        >
                                            <Eye className="w-4 h-4 mr-1" />
                                            View Results
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm">{contest.timer} min timer</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Trophy className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm">{contest.questions?.length || 0} questions</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm">Created {new Date(contest.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                {contest.status === 'completed' && (
                                    <Alert>
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>
                                            This contest has ended. You can no longer participate.
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
            {pagination && pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-4">
                    <Button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>
                        Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">Page {pagination.page} of {pagination.pages}</span>
                    <Button disabled={page >= pagination.pages} onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}>
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
};

export default StudentContests;