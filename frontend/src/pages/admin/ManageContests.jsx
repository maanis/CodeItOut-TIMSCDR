import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Play, Square, Trophy, Calendar, Clock, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useContests, createContest, updateContest, deleteContest, startContest, stopContest } from '@/hooks/useContests';

const ManageContests = () => {
    const { data: contests = [], isLoading, error, refetch } = useContests();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [countdowns, setCountdowns] = useState({});

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        timer: '',
        questions: []
    });
    const [questionsJson, setQuestionsJson] = useState('');

    // Handle countdown timers for ongoing contests
    useEffect(() => {
        const interval = setInterval(() => {
            const newCountdowns = {};
            const quizzesToStop = [];

            contests.forEach(contest => {
                if (contest.status === 'ongoing' && contest.startedAt) {
                    const startTime = new Date(contest.startedAt).getTime();
                    const durationMs = contest.timer * 60 * 1000; // Convert minutes to milliseconds
                    const endTime = startTime + durationMs;
                    const now = new Date().getTime();
                    const remaining = Math.max(0, endTime - now);

                    if (remaining > 0) {
                        const minutes = Math.floor(remaining / (1000 * 60));
                        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
                        newCountdowns[contest._id] = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                    } else {
                        newCountdowns[contest._id] = '00:00';
                        // Mark quiz for auto-stop
                        if (remaining <= 0) {
                            quizzesToStop.push(contest._id);
                        }
                    }
                }
            });

            setCountdowns(newCountdowns);

            // Auto-stop quizzes that have run out of time
            quizzesToStop.forEach(async (quizId) => {
                try {
                    await stopContest(quizId);
                    refetch();
                } catch (error) {
                    console.error('Auto-stop quiz error:', error);
                }
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [contests, refetch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Validate questions JSON
            if (!questionsJson.trim()) {
                throw new Error('Questions are required');
            }
            const parsedQuestions = JSON.parse(questionsJson);
            if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
                throw new Error('Questions must be a non-empty array');
            }

            const finalFormData = {
                ...formData,
                questions: parsedQuestions
            };

            if (editingId) {
                await updateContest(editingId, finalFormData);
            } else {
                await createContest(finalFormData);
            }
            setIsDialogOpen(false);
            setFormData({
                title: '',
                description: '',
                timer: '',
                questions: []
            });
            setQuestionsJson('');
            setEditingId(null);
            refetch();
        } catch (error) {
            if (error.message.includes('JSON')) {
                alert('Invalid JSON format for questions. Please check your syntax.');
            } else {
                alert(error.message || 'Failed to save contest');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (contest) => {
        setEditingId(contest._id);
        setFormData({
            title: contest.title,
            description: contest.description,
            timer: contest.timer || '',
            questions: contest.questions || []
        });
        setQuestionsJson(JSON.stringify(contest.questions || [], null, 2));
        setIsDialogOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this contest?')) {
            try {
                await deleteContest(id);
                refetch();
            } catch (error) {
                // Error handled in hook
            }
        }
    };

    const handleStartContest = async (id) => {
        if (window.confirm('Are you sure you want to start this contest?')) {
            try {
                await startContest(id);
                refetch();
            } catch (error) {
                // Error handled in hook
            }
        }
    };

    const handleStopContest = async (id) => {
        if (window.confirm('Are you sure you want to stop this contest?')) {
            try {
                await stopContest(id);
                refetch();
            } catch (error) {
                // Error handled in hook
            }
        }
    };

    const handleViewResults = (contestId) => {
        navigate(`/adminn/contests/${contestId}/results`);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Manage Contests</h1>
                    <p className="text-muted-foreground">Create and manage coding contests</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => {
                            setEditingId(null);
                            setFormData({
                                title: '',
                                description: '',
                                timer: '',
                                questions: []
                            });
                            setQuestionsJson('');
                        }}>
                            <Plus className="w-4 h-4 mr-2" />
                            Create Contest
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingId ? 'Edit Contest' : 'Create New Contest'}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="col-span-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="timer">Timer (minutes)</Label>
                                    <Input
                                        id="timer"
                                        type="number"
                                        value={formData.timer}
                                        onChange={(e) => setFormData({ ...formData, timer: e.target.value })}
                                        placeholder="Enter contest duration in minutes"
                                        required
                                    />
                                </div>
                                <div className="col-span-2">
                                    <Label htmlFor="questions">Questions (JSON)</Label>
                                    <Textarea
                                        id="questions"
                                        value={questionsJson}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setQuestionsJson(value);
                                            try {
                                                const parsed = JSON.parse(value);
                                                setFormData({ ...formData, questions: parsed });
                                            } catch (error) {
                                                // Keep the current questions if JSON is invalid
                                            }
                                        }}
                                        placeholder='[{"questionText": "What is 2+2?", "options": ["3", "4", "5"], "correctAnswer": "4", "points": 10}]'
                                        rows={8}
                                        required
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        Enter questions as JSON array with questionText, options (array), correctAnswer, and points fields.
                                    </p>
                                </div>

                            </div>

                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : (editingId ? 'Update' : 'Create')}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {error && (
                <div className="text-red-500 text-center py-4">
                    Error loading contests: {error.message}
                </div>
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
                            <p className="text-muted-foreground">No contests created yet</p>
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
                                            <Badge variant={
                                                contest.status === 'upcoming' ? 'secondary' :
                                                    contest.status === 'ongoing' ? 'default' :
                                                        'outline'
                                            }>
                                                {contest.status}
                                            </Badge>
                                        </CardTitle>
                                        <p className="text-muted-foreground mt-1">{contest.description}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        {contest.status === 'upcoming' && (
                                            <Button
                                                size="sm"
                                                onClick={() => handleStartContest(contest._id)}
                                                className="bg-green-600 hover:bg-green-700"
                                            >
                                                <Play className="w-4 h-4 mr-1" />
                                                Start
                                            </Button>
                                        )}
                                        {contest.status === 'ongoing' && (
                                            <Button
                                                size="sm"
                                                onClick={() => handleStopContest(contest._id)}
                                                className="bg-red-600 hover:bg-red-700"
                                            >
                                                <Square className="w-4 h-4 mr-1" />
                                                Stop
                                            </Button>
                                        )}
                                        {contest.status === 'completed' && (
                                            <Button
                                                size="sm"
                                                onClick={() => handleViewResults(contest._id)}
                                                className="bg-purple-600 hover:bg-purple-700"
                                            >
                                                <Eye className="w-4 h-4 mr-1" />
                                                View Results
                                            </Button>
                                        )}
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleEdit(contest)}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleDelete(contest._id)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm">
                                            {contest.status === 'ongoing' && countdowns[contest._id]
                                                ? `Time left: ${countdowns[contest._id]}`
                                                : `${contest.timer} min timer`
                                            }
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Trophy className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm">{contest.questions?.length || 0} questions</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm">
                                            {contest.status === 'ongoing' && contest.startedAt
                                                ? `Started ${new Date(contest.startedAt).toLocaleTimeString()}`
                                                : `Created ${new Date(contest.createdAt).toLocaleDateString()}`
                                            }
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default ManageContests;