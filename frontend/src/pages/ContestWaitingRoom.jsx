import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useContests, useContest } from '@/hooks/useContests';

const ContestWaitingRoom = () => {
    const { id } = useParams();
    console.log(id)
    const navigate = useNavigate();
    const { data: contest, isLoading, error } = useContest(id);
    const [timeUntilStart, setTimeUntilStart] = useState('');

    console.log(contest)

    useEffect(() => {
        if (!contest || isLoading) return;

        const interval = setInterval(() => {
            if (contest.status === 'ongoing') {
                navigate(`/contests/${id}/take`);
                return;
            }

            // For upcoming contests, show waiting message
            setTimeUntilStart('Contest hasn\'t started yet. Please wait for the admin to start it.');
        }, 1000);

        return () => clearInterval(interval);
    }, [contest, id, navigate, isLoading]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="text-center py-8">
                        <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4 animate-spin" />
                        <p className="text-muted-foreground">Loading contest...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error || !contest) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="text-center py-8">
                        <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">
                            {error ? 'Failed to load contest' : 'Contest not found'}
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-2xl mx-4"
            >
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                            <Clock className="w-6 h-6" />
                            Waiting for Contest to Start
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold mb-2">{contest.title}</h2>
                            <p className="text-muted-foreground">{contest.description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-muted p-3 rounded-lg">
                                <div className="font-medium">Duration</div>
                                <div className="text-muted-foreground">{contest.timer} minutes</div>
                            </div>
                            <div className="bg-muted p-3 rounded-lg">
                                <div className="font-medium">Questions</div>
                                <div className="text-muted-foreground">{contest.questions?.length || 0} questions</div>
                            </div>
                        </div>

                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                {timeUntilStart}
                            </AlertDescription>
                        </Alert>

                        <div className="flex gap-4 justify-center">
                            <Button
                                variant="outline"
                                onClick={() => navigate('/dashboard/contests')}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Contests
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default ContestWaitingRoom;