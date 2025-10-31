import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Clock, Users, CheckCircle, XCircle, Medal, ArrowLeft, Target, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useContest, useContestResults, useContestLeaderboard } from '@/hooks/useContests';

const ContestResults = () => {
    const { id: contestId } = useParams();
    const navigate = useNavigate();
    const { data: contest, isLoading: contestLoading, error: contestError } = useContest(contestId);
    const { data: resultsData, isLoading: resultsLoading, error: resultsError } = useContestResults(contestId);
    const { data: leaderboardData, isLoading: leaderboardLoading, error: leaderboardError } = useContestLeaderboard(contestId);
    console.log(resultsData)
    console.log(resultsError)
    const getRankIcon = (rank) => {
        switch (rank) {
            case 1: return <Trophy className="w-5 h-5 text-yellow-500" />;
            case 2: return <Medal className="w-5 h-5 text-gray-400" />;
            case 3: return <Award className="w-5 h-5 text-amber-600" />;
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

    if (contestLoading || resultsLoading || leaderboardLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="text-center py-8">
                        <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4 animate-spin" />
                        <p className="text-muted-foreground">Loading results...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (contestError || resultsError || leaderboardError) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="text-center py-8">
                        <XCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">
                            {contestError?.message || resultsError?.message || leaderboardError?.message || 'Failed to load results'}
                        </p>
                        <Button
                            onClick={() => navigate('/dashboard/contests')}
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Button
                            onClick={() => navigate('/dashboard/contests')}
                            variant="outline"
                            className="mb-4"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Contests
                        </Button>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <Trophy className="w-8 h-8 text-yellow-500" />
                            {contest.title} - Results
                        </h1>
                        <p className="text-muted-foreground mt-1">{contest.description}</p>
                    </div>
                    <Badge variant="outline" className="text-lg px-3 py-1">
                        Completed
                    </Badge>
                </div>

                <Tabs defaultValue="results" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="results">Your Results</TabsTrigger>
                        <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
                    </TabsList>

                    {/* Your Results Tab */}
                    <TabsContent value="results" className="space-y-6">
                        {resultsData?.notParticipated ? (
                            <Card>
                                <CardContent className="text-center py-12">
                                    <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                                    <h3 className="text-xl font-semibold mb-2">You have not participated</h3>
                                    <p className="text-muted-foreground mb-6">
                                        You haven't attempted this contest yet. Complete the contest to see your results here.
                                    </p>
                                    <Button onClick={() => navigate(`/contests/${contestId}/take`)}>
                                        Take Contest
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : resultsData?.attempt ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Score Overview */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Target className="w-5 h-5" />
                                            Your Performance
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="text-center">
                                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${getRankColor(resultsData.attempt.rank)}`}>
                                                {getRankIcon(resultsData.attempt.rank)}
                                                <span className="font-semibold">Rank #{resultsData.attempt.rank}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span>Score</span>
                                                <span className="font-semibold text-lg">{resultsData.attempt.score}%</span>
                                            </div>
                                            <Progress value={resultsData.attempt.score} className="h-2" />

                                            <div className="grid grid-cols-2 gap-4 pt-4">
                                                <div className="text-center">
                                                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                                    <div className="text-2xl font-bold text-green-600">{resultsData.attempt.correctAnswers}</div>
                                                    <div className="text-sm text-muted-foreground">Correct</div>
                                                </div>
                                                <div className="text-center">
                                                    <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                                                    <div className="text-2xl font-bold text-red-600">{resultsData.attempt.wrongAnswers}</div>
                                                    <div className="text-sm text-muted-foreground">Wrong</div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Detailed Stats */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Contest Statistics</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="text-center p-4 bg-muted rounded-lg">
                                                <Clock className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                                                <div className="text-xl font-semibold">{resultsData.attempt.timeTaken} min</div>
                                                <div className="text-sm text-muted-foreground">Time Taken</div>
                                            </div>
                                            <div className="text-center p-4 bg-muted rounded-lg">
                                                <Users className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                                                <div className="text-xl font-semibold">{resultsData.quiz.totalQuestions}</div>
                                                <div className="text-sm text-muted-foreground">Total Questions</div>
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <div className="text-sm text-muted-foreground mb-2">Submitted</div>
                                            <div className="font-medium">
                                                {new Date(resultsData.attempt.submittedAt).toLocaleString()}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ) : (
                            <Card>
                                <CardContent className="text-center py-8">
                                    <XCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground">No results available.</p>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    {/* Leaderboard Tab */}
                    <TabsContent value="leaderboard" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Trophy className="w-5 h-5" />
                                    Contest Leaderboard
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {leaderboardData?.leaderboard?.map((participant, index) => (
                                        <motion.div
                                            key={participant.studentId}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className={`flex items-center justify-between p-4 rounded-lg border ${participant.studentId === resultsData?.attempt?._id
                                                ? 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800'
                                                : 'bg-card'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center justify-center w-10 h-10">
                                                    {getRankIcon(participant.rank)}
                                                </div>
                                                <Avatar className="w-10 h-10">
                                                    <AvatarImage src="" />
                                                    <AvatarFallback>
                                                        {participant.studentName.split(' ').map(n => n[0]).join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-semibold flex items-center gap-2">
                                                        {participant.studentName}
                                                        {participant.studentId === resultsData?.attempt?._id && (
                                                            <Badge variant="secondary" className="text-xs">You</Badge>
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {participant.correctAnswers} correct, {participant.wrongAnswers} wrong
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <div className="text-2xl font-bold">{participant.score}%</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {participant.timeTaken} min
                                                </div>
                                            </div>
                                        </motion.div>
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

export default ContestResults;