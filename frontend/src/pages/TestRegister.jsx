import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spotlight } from '@/components/ui/spotlight-new';
import { toast } from 'sonner';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const TestRegister = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.name || !formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
            toast.error('Please fill in all fields');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return false;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error('Please enter a valid email');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post(`${API_URL}/auth/register`, {
                name: formData.name,
                username: formData.username,
                email: formData.email,
                password: formData.password,
            });

            if (response.data.message) {
                toast.success('Registration successful! Please log in.');
                navigate('/testLogin');
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed. Please try again.';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background dark:bg-neutral-950">
            {/* Animated gradient background */}
            <Spotlight />

            <div className="absolute dark:hidden inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />

            {/* Animated glow orbs */}
            <div className="absolute max-sm:hidden top-1/4 left-[10%] w-96 h-96 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute max-sm:hidden bottom-1/4 right-[10%] w-96 h-96 bg-secondary/10 dark:bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

            <div className="w-full px-4 relative z-10">
                <div className="max-w-sm mx-auto">
                    {/* Heading */}
                    <motion.div
                        className="text-center mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent dark:from-muted-foreground dark:via-cyan-400 dark:to-purple-400 mb-2">
                            Create Account
                        </h1>
                        <p className="text-muted-foreground dark:text-neutral-400 text-xs sm:text-sm">
                            Join TIMSCDR today
                        </p>
                    </motion.div>

                    {/* Register Card */}
                    <motion.div
                        className="rounded-2xl p-6 border border-border/50 dark:border-neutral-700/50 bg-card/50 dark:bg-neutral-950/40 backdrop-blur-xl shadow-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Full Name Input */}
                            <div className="space-y-1.5">
                                <Label htmlFor="name" className="text-foreground dark:text-neutral-200 font-semibold text-sm">
                                    Full Name
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground dark:text-neutral-500" />
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="pl-9 h-9 text-sm bg-background/50 dark:bg-neutral-900/50 border-border/50 dark:border-neutral-700/50 focus:border-primary dark:focus:border-cyan-400 text-foreground dark:text-neutral-100 placeholder:text-muted-foreground dark:placeholder:text-neutral-600"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* Username Input */}
                            <div className="space-y-1.5">
                                <Label htmlFor="username" className="text-foreground dark:text-neutral-200 font-semibold text-sm">
                                    Username
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground dark:text-neutral-500" />
                                    <Input
                                        id="username"
                                        name="username"
                                        type="text"
                                        placeholder="johndoe"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="pl-9 h-9 text-sm bg-background/50 dark:bg-neutral-900/50 border-border/50 dark:border-neutral-700/50 focus:border-primary dark:focus:border-cyan-400 text-foreground dark:text-neutral-100 placeholder:text-muted-foreground dark:placeholder:text-neutral-600"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* Email Input */}
                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-foreground dark:text-neutral-200 font-semibold text-sm">
                                    Email
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground dark:text-neutral-500" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="pl-9 h-9 text-sm bg-background/50 dark:bg-neutral-900/50 border-border/50 dark:border-neutral-700/50 focus:border-primary dark:focus:border-cyan-400 text-foreground dark:text-neutral-100 placeholder:text-muted-foreground dark:placeholder:text-neutral-600"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="space-y-1.5">
                                <Label htmlFor="password" className="text-foreground dark:text-neutral-200 font-semibold text-sm">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground dark:text-neutral-500" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="pl-9 pr-9 h-9 text-sm bg-background/50 dark:bg-neutral-900/50 border-border/50 dark:border-neutral-700/50 focus:border-primary dark:focus:border-cyan-400 text-foreground dark:text-neutral-100 placeholder:text-muted-foreground dark:placeholder:text-neutral-600"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground dark:text-neutral-500 hover:text-foreground dark:hover:text-neutral-300 transition-colors"
                                        disabled={isLoading}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password Input */}
                            <div className="space-y-1.5">
                                <Label htmlFor="confirmPassword" className="text-foreground dark:text-neutral-200 font-semibold text-sm">
                                    Confirm Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground dark:text-neutral-500" />
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="pl-9 pr-9 h-9 text-sm bg-background/50 dark:bg-neutral-900/50 border-border/50 dark:border-neutral-700/50 focus:border-primary dark:focus:border-cyan-400 text-foreground dark:text-neutral-100 placeholder:text-muted-foreground dark:placeholder:text-neutral-600"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground dark:text-neutral-500 hover:text-foreground dark:hover:text-neutral-300 transition-colors"
                                        disabled={isLoading}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-primary via-secondary to-accent text-white hover:opacity-90 rounded-lg py-5 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                            >
                                {isLoading ? (
                                    <span>Creating account...</span>
                                ) : (
                                    <>
                                        Create Account
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </Button>
                        </form>

                        {/* Footer Links */}
                        <div className="mt-5 space-y-2 text-center">
                            <p className="text-xs text-muted-foreground dark:text-neutral-500">
                                Already have an account?{' '}
                                <button
                                    onClick={() => navigate('/testLogin')}
                                    className="text-primary dark:text-cyan-400 hover:underline font-semibold transition-colors"
                                >
                                    Sign in
                                </button>
                            </p>
                            <p className="text-xs text-muted-foreground dark:text-neutral-500">
                                <button
                                    onClick={() => navigate('/register')}
                                    className="text-primary dark:text-cyan-400 hover:underline font-semibold transition-colors"
                                >
                                    Full registration
                                </button>
                            </p>
                        </div>
                    </motion.div>

                    {/* Trust Indicators */}
                    <motion.div
                        className="mt-6 text-center space-y-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <p className="text-xs text-muted-foreground dark:text-neutral-600 uppercase tracking-wider">
                            Secure & Encrypted
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default TestRegister;
