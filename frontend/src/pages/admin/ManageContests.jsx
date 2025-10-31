import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Play, Square, Trophy, Calendar, Clock, Eye, Sparkles, X, Wand2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

    // Generate questions state
    const [showGenerate, setShowGenerate] = useState(false);
    const [keywords, setKeywords] = useState([]);
    const [currentKeyword, setCurrentKeyword] = useState('');
    const [numQuestions, setNumQuestions] = useState(5);
    const [difficulty, setDifficulty] = useState('medium');
    const [isGenerating, setIsGenerating] = useState(false);

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
        // Reset generate form
        setShowGenerate(false);
        setKeywords([]);
        setCurrentKeyword('');
        setNumQuestions(5);
        setDifficulty('medium');
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

    // Keyword management
    const addKeyword = () => {
        if (currentKeyword.trim() && !keywords.includes(currentKeyword.trim())) {
            setKeywords([...keywords, currentKeyword.trim()]);
            setCurrentKeyword('');
        }
    };

    const removeKeyword = (keywordToRemove) => {
        setKeywords(keywords.filter(k => k !== keywordToRemove));
    };

    const handleKeywordKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addKeyword();
        }
    };

    // Generate questions with Gemini API
    const generateQuestions = async () => {
        if (keywords.length === 0) {
            alert('Please add at least one keyword');
            return;
        }

        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
            alert('Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
            return;
        }

        setIsGenerating(true);
        try {
            const prompt = `Generate ${numQuestions} multiple-choice questions about ${keywords.join(', ')} at ${difficulty} difficulty level.

Requirements:
- Each question must have exactly 4 options
- Only one correct answer per question
- Questions should be technical and educational
- Points should be assigned based on difficulty: easy=1, medium=2, hard=3
- Return ONLY valid JSON array in this exact format:

[
  {
    "questionText": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Correct Option",
    "points": 2
  }
]

Topic keywords: ${keywords.join(', ')}
Difficulty: ${difficulty}
Number of questions: ${numQuestions}`;
            console.log(prompt)
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Gemini API error:', response.status, errorData);
                throw new Error(`Gemini API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
            }

            const data = await response.json();
            const generatedText = data.candidates[0].content.parts[0].text;
            console.log(generatedText)

            // Extract JSON from the response (remove markdown formatting if present)
            const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
            if (!jsonMatch) {
                throw new Error('Invalid response format from Gemini');
            }

            const questions = JSON.parse(jsonMatch[0]);

            // Validate the generated questions
            if (!Array.isArray(questions) || questions.length === 0) {
                throw new Error('No questions generated');
            }

            // Validate each question structure
            questions.forEach((q, index) => {
                if (!q.questionText || !Array.isArray(q.options) || q.options.length !== 4 || !q.correctAnswer || !q.points) {
                    throw new Error(`Question ${index + 1} has invalid structure`);
                }
                if (!q.options.includes(q.correctAnswer)) {
                    throw new Error(`Question ${index + 1}: correct answer must be one of the options`);
                }
            });

            // Set the generated questions
            setFormData({ ...formData, questions });
            setQuestionsJson(JSON.stringify(questions, null, 2));
            setShowGenerate(false);

            // Reset generate form
            setKeywords([]);
            setCurrentKeyword('');
            setNumQuestions(5);
            setDifficulty('medium');

        } catch (error) {
            console.error('Error generating questions:', error);
            let errorMessage = 'Failed to generate questions';

            if (error.message.includes('Gemini API error')) {
                errorMessage = error.message;
            } else if (error.message.includes('fetch')) {
                errorMessage = 'Network error: Please check your internet connection';
            } else if (error.message.includes('JSON')) {
                errorMessage = 'Invalid response format from AI service';
            } else if (error.message) {
                errorMessage = error.message;
            }

            alert(errorMessage);
        } finally {
            setIsGenerating(false);
        }
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
                            // Reset generate form
                            setShowGenerate(false);
                            setKeywords([]);
                            setCurrentKeyword('');
                            setNumQuestions(5);
                            setDifficulty('medium');
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
                                    <div className="flex items-center justify-between mb-2">
                                        <Label htmlFor="questions">Questions (JSON)</Label>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setShowGenerate(!showGenerate)}
                                            className="flex items-center gap-2"
                                        >
                                            <Sparkles className="w-4 h-4" />
                                            Generate with AI
                                        </Button>
                                    </div>

                                    {showGenerate && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="mb-4 p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20"
                                        >
                                            <h4 className="font-medium mb-3 flex items-center gap-2">
                                                <Wand2 className="w-4 h-4" />
                                                Generate Questions with Gemini AI
                                            </h4>

                                            <div className="space-y-4">
                                                {/* Keywords */}
                                                <div>
                                                    <Label className="text-sm">Keywords (press Enter to add)</Label>
                                                    <div className="flex flex-wrap gap-2 mb-2">
                                                        {keywords.map((keyword, index) => (
                                                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                                                {keyword}
                                                                <X
                                                                    className="w-3 h-3 cursor-pointer hover:text-red-500"
                                                                    onClick={() => removeKeyword(keyword)}
                                                                />
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                    <Input
                                                        value={currentKeyword}
                                                        onChange={(e) => setCurrentKeyword(e.target.value)}
                                                        onKeyPress={handleKeywordKeyPress}
                                                        placeholder="Add keywords (e.g., React, JavaScript, MERN)"
                                                        className="mb-2"
                                                    />
                                                </div>

                                                {/* Number of questions and difficulty */}
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <Label className="text-sm">Number of Questions</Label>
                                                        <Input
                                                            type="number"
                                                            min="1"
                                                            max="20"
                                                            value={numQuestions}
                                                            onChange={(e) => setNumQuestions(parseInt(e.target.value) || 5)}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="text-sm">Difficulty</Label>
                                                        <Select value={difficulty} onValueChange={setDifficulty}>
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="easy">Easy</SelectItem>
                                                                <SelectItem value="medium">Medium</SelectItem>
                                                                <SelectItem value="hard">Hard</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>

                                                {/* Generate button */}
                                                <Button
                                                    type="button"
                                                    onClick={generateQuestions}
                                                    disabled={isGenerating || keywords.length === 0}
                                                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                                                >
                                                    {isGenerating ? (
                                                        <>
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                            Generating...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Sparkles className="w-4 h-4 mr-2" />
                                                            Generate Questions
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </motion.div>
                                    )}

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