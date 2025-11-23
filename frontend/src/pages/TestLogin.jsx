import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spotlight } from '@/components/ui/spotlight-new';
import { toast } from 'sonner';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const TestLogin = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (!formData.email || !formData.password) {
                toast.error('Please fill in all fields');
                setIsLoading(false);
                return;
            }

            const response = await axios.post(`${API_URL}/auth/login-email`, {
                email: formData.email,
                password: formData.password,
            });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                login(response.data.user);
                toast.success('Login successful!');

                // Navigate based on role
                const redirectPath = response.data.user.role === 'admin' ? '/admin/dashboard' : '/dashboard';
                navigate(redirectPath);
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed. Please try again.';
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
            {/* <div className="absolute max-sm:hidden top-1/4 left-[10%] w-96 h-96 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute max-sm:hidden bottom-1/4 right-[10%] w-96 h-96 bg-secondary/10 dark:bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} /> */}

            <div className="w-full px-4 relative z-10">
                <div className="max-w-sm mx-auto">
                    {/* Heading */}
                    <motion.div
                        className="text-center mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-lg sm:text-3xl font-bold bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent dark:from-muted-foreground dark:via-cyan-400 dark:to-purple-400 mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-muted-foreground dark:text-neutral-400 text-xs sm:text-xs">
                            Sign in to your account
                        </p>
                    </motion.div>

                    {/* Login Card */}
                    <motion.div
                        className="rounded-lg p-6 border border-border/50 dark:border-neutral-700/50 bg-card/50 dark:bg-neutral-950/40 backdrop-blur-xl shadow-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
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
                                        placeholder="Enter your password"
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

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-primary via-secondary to-accent text-white hover:opacity-90 rounded-lg py-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                            >
                                {isLoading ? (
                                    <span>Signing in...</span>
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </Button>

                            {/* Divider */}
                            <div className="relative my-3">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-border/50 dark:border-neutral-700/50" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="px-2 bg-card dark:bg-neutral-950/40 text-muted-foreground dark:text-neutral-500 text-xs">
                                        Or
                                    </span>
                                </div>
                            </div>

                            {/* Alternative Login Options */}
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="border-border/50 dark:border-neutral-700/50 hover:bg-background dark:hover:bg-neutral-900/50 text-foreground dark:text-neutral-200 font-semibold rounded-lg py-4 text-sm"
                                >
                                    Username
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="border-border/50 dark:border-neutral-700/50 hover:bg-background dark:hover:bg-neutral-900/50 text-foreground dark:text-neutral-200 font-semibold rounded-lg py-4 text-sm"
                                >
                                    OTP
                                </Button>
                            </div>
                        </form>

                        {/* Footer Links */}
                        <div className="mt-5 space-y-2 text-center">
                            <p className="text-xs text-muted-foreground dark:text-neutral-500">
                                Don't have an account?{' '}
                                <button
                                    onClick={() => navigate('/testRegister')}
                                    className="text-primary dark:text-cyan-400 hover:underline font-semibold transition-colors"
                                >
                                    Sign up
                                </button>
                            </p>
                            <p className="text-xs text-muted-foreground dark:text-neutral-500">
                                <button
                                    onClick={() => navigate('/login')}
                                    className="text-primary dark:text-cyan-400 hover:underline font-semibold transition-colors"
                                >
                                    Full login
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
                        <div className="flex items-center justify-center gap-6 text-muted-foreground dark:text-neutral-600">
                            <span className="text-sm font-semibold">🔒 Secure & Encrypted</span>
                            <span className="text-sm font-semibold">⚡ Lightning Fast</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default TestLogin;
