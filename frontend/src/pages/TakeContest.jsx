import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronLeft, ChevronRight, Send, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useContests, useContest, useStartQuizAttempt } from '@/hooks/useContests';

const TakeContest = () => {
    const { id: contestId } = useParams();
    const navigate = useNavigate();
    const { data: contest, isLoading: contestLoading, error: contestError } = useContest(contestId);
    const startAttemptMutation = useStartQuizAttempt();

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
    const [quizData, setQuizData] = useState(null);
    const [attemptError, setAttemptError] = useState(null);

    const questions = quizData?.quiz?.questions || [];

    // Check if all questions are answered
    const allQuestionsAnswered = questions.length > 0 && questions.every((_, index) =>
        answers[index] !== undefined && answers[index] !== null && answers[index] !== ''
    );

    // Count answered questions
    const answeredQuestionsCount = questions.length > 0 ?
        Object.values(answers).filter(answer => answer !== undefined && answer !== null && answer !== '').length : 0;

    // Start quiz attempt when contest is loaded
    useEffect(() => {
        if (contest && contest.status === 'ongoing' && !quizData && !startAttemptMutation.isPending) {
            console.log('Starting quiz attempt for contest:', contestId);
            startAttemptMutation.mutate(contestId, {
                onSuccess: (data) => {
                    console.log('Quiz attempt started successfully:', data);
                    setQuizData(data);
                    setAttemptError(null);
                },
                onError: (error) => {
                    console.error('Failed to start quiz attempt:', error);
                    setAttemptError(error.response?.data?.error || 'Failed to start quiz attempt');
                }
            });
        }
    }, [contest, contestId, quizData, startAttemptMutation]);

    // Prevent text selection and copying
    useEffect(() => {
        const preventSelection = (e) => {
            e.preventDefault();
            return false;
        };

        const preventCopy = (e) => {
            e.preventDefault();
            return false;
        };

        document.addEventListener('selectstart', preventSelection);
        document.addEventListener('copy', preventCopy);
        document.addEventListener('cut', preventCopy);
        document.addEventListener('paste', preventCopy);
        document.addEventListener('contextmenu', preventSelection);

        // Disable keyboard shortcuts
        const preventKeyboard = (e) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                return false;
            }
        };
        document.addEventListener('keydown', preventKeyboard);

        return () => {
            document.removeEventListener('selectstart', preventSelection);
            document.removeEventListener('copy', preventCopy);
            document.removeEventListener('cut', preventCopy);
            document.removeEventListener('paste', preventCopy);
            document.removeEventListener('contextmenu', preventSelection);
            document.removeEventListener('keydown', preventKeyboard);
        };
    }, []);

    // Initialize timer and answers
    useEffect(() => {
        if (quizData && contest.status === 'ongoing' && contest.startedAt) {
            const startTime = new Date(contest.startedAt).getTime();
            const durationMs = quizData.quiz.timer * 60 * 1000;
            const endTime = startTime + durationMs;
            const now = new Date().getTime();
            const remaining = Math.max(0, Math.floor((endTime - now) / 1000));

            setTimeLeft(remaining);

            // Initialize answers array
            const initialAnswers = {};
            questions.forEach((_, index) => {
                initialAnswers[index] = '';
            });
            setAnswers(initialAnswers);
        }
    }, [quizData, contest, questions]);

    // Timer countdown
    useEffect(() => {
        if (timeLeft <= 0 || isSubmitted) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    handleAutoSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, isSubmitted]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswerChange = (questionIndex, answer) => {
        setAnswers(prev => ({
            ...prev,
            [questionIndex]: answer
        }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleAutoSubmit = async () => {
        if (isSubmitted) return;
        setIsSubmitted(true);
        await submitQuiz();
    };

    const handleManualSubmit = () => {
        if (!allQuestionsAnswered) {
            // Show alert or message that all questions must be answered
            alert('Please answer all questions before submitting the quiz.');
            return;
        }
        setShowConfirmSubmit(true);
    };

    const confirmSubmit = async () => {
        setIsSubmitted(true);
        setShowConfirmSubmit(false);
        await submitQuiz();
    };

    const submitQuiz = async () => {
        try {
            // Convert answers object to array format expected by API
            // Ensure responses are in correct order
            const responses = [];
            for (let i = 0; i < questions.length; i++) {
                responses.push({
                    selectedOption: answers[i] || ''
                });
            }

            console.log('Submitting quiz for contestId:', contestId);
            console.log('Answers object:', answers);
            console.log('Questions length:', questions.length);
            console.log('Submitting responses:', responses);
            console.log('Token exists:', !!localStorage.getItem('token'));

            const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/quizzes/${contestId}/submit`;
            console.log('API URL:', apiUrl);

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ responses })
            });

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response data:', errorData);
                throw new Error(errorData.error || 'Failed to submit quiz');
            }

            const result = await response.json();

            console.log('Quiz submitted successfully:', result);

            // Navigate to results page
            navigate(`/contests/${contestId}/results`);
        } catch (error) {
            console.error('Error submitting quiz:', error);
            // Still navigate to contests page on error
            navigate('/dashboard/contests');
        }
    }; if (contestLoading || startAttemptMutation.isPending) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="text-center py-8">
                        <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4 animate-spin" />
                        <p className="text-muted-foreground">
                            {startAttemptMutation.isPending ? 'Starting quiz attempt...' : 'Loading contest...'}
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (contestError || attemptError) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="text-center py-8">
                        <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">
                            {attemptError || contestError?.message || 'Failed to load contest'}
                        </p>
                        <Button
                            onClick={() => navigate('/dashboard/contests')}
                            className="mt-4"
                        >
                            Back to Contests
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (contest.status !== 'ongoing') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="text-center py-8">
                        <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">Contest is not currently active</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!quizData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="text-center py-8">
                        <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4 animate-spin" />
                        <p className="text-muted-foreground">Preparing quiz...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            {/* Header with timer and progress */}
            <div className="bg-white dark:bg-gray-800 shadow-lg border-b">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h1 className="text-xl font-bold">{quizData?.quiz?.title || contest?.title}</h1>
                            <p className="text-sm text-muted-foreground">
                                Question {currentQuestionIndex + 1} of {questions.length}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${timeLeft <= 300 ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                timeLeft <= 600 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                }`}>
                                <Clock className="w-4 h-4" />
                                {formatTime(timeLeft)}
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-sm text-muted-foreground">
                                    {answeredQuestionsCount} / {questions.length} questions answered
                                </div>
                                <Button
                                    onClick={handleManualSubmit}
                                    disabled={isSubmitted || !allQuestionsAnswered}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
                                >
                                    <Send className="w-4 h-4 mr-2" />
                                    Submit Quiz
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <motion.div
                            className="bg-blue-600 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>
            </div>

            {/* Question content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQuestionIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card className="mb-6">
                            <CardContent className="p-6">
                                <h2 className="text-lg font-semibold mb-4">
                                    {currentQuestion?.questionText}
                                </h2>

                                <RadioGroup
                                    value={answers[currentQuestionIndex] || ''}
                                    onValueChange={(value) => handleAnswerChange(currentQuestionIndex, value)}
                                    disabled={isSubmitted}
                                >
                                    {currentQuestion?.options?.map((option, optionIndex) => (
                                        <div key={optionIndex} className="flex items-center space-x-2 mb-3">
                                            <RadioGroupItem
                                                value={option}
                                                id={`option-${optionIndex}`}
                                                disabled={isSubmitted}
                                            />
                                            <Label
                                                htmlFor={`option-${optionIndex}`}
                                                className="flex-1 cursor-pointer"
                                            >
                                                {option}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </CardContent>
                        </Card>

                        {/* Navigation buttons */}
                        <div className="flex justify-between">
                            <Button
                                onClick={handlePrevious}
                                disabled={currentQuestionIndex === 0 || isSubmitted}
                                variant="outline"
                            >
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                Previous
                            </Button>

                            <div className="flex gap-2">
                                {currentQuestionIndex < questions.length - 1 ? (
                                    <Button
                                        onClick={handleNext}
                                        disabled={isSubmitted}
                                    >
                                        Next
                                        <ChevronRight className="w-4 h-4 ml-2" />
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleManualSubmit}
                                        disabled={isSubmitted || !allQuestionsAnswered}
                                        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
                                    >
                                        <Send className="w-4 h-4 mr-2" />
                                        Finish Quiz
                                    </Button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Confirm submit dialog */}
            {showConfirmSubmit && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <Card className="w-full max-w-md mx-4">
                        <CardContent className="p-6 text-center">
                            <AlertCircle className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Submit Quiz?</h3>
                            <p className="text-muted-foreground mb-6">
                                Are you sure you want to submit your quiz? You won't be able to change your answers.
                            </p>
                            <div className="flex gap-4 justify-center">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowConfirmSubmit(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={confirmSubmit}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    Submit
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default TakeContest;