import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2, Mail, Lock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    // Safe window dimensions with fallbacks
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await login(email, password);
            const stored = localStorage.getItem('user');
            const user = stored ? JSON.parse(stored) : null;

            toast.success('Welcome back! 🎉');

            // Role-based navigation
            if (user?.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            toast.error('Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 gradient-primary opacity-10" />
            <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-primary/20 rounded-full"
                        initial={{
                            x: Math.random() * windowWidth,
                            y: Math.random() * windowHeight
                        }}
                        animate={{
                            x: Math.random() * windowWidth,
                            y: Math.random() * windowHeight,
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="glass-card shadow-glow rounded-2xl p-8">
                    {/* Logo and title */}
                    <motion.div
                        className="text-center mb-8"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4">
                            <img src="/logo.png" className='h-16 w-16' alt="" />
                        </div>
                        <h1 className="text-3xl font-bold mb-2 text-foreground">
                            One Place for Every Coder
                        </h1>
                        <p className="text-muted-foreground">Welcome back to the coding club</p>
                    </motion.div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                                <Mail className="w-4 h-4" />
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-11"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Label htmlFor="password" className="flex items-center gap-2 mb-2">
                                <Lock className="w-4 h-4" />
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="h-11"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Button
                                type="submit"
                                className="w-full h-11 gradient-primary text-white font-semibold hover:opacity-90 transition-opacity"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    >
                                        <Sparkles className="w-5 h-5" />
                                    </motion.div>
                                ) : (
                                    'Sign In'
                                )}
                            </Button>
                        </motion.div>
                    </form>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-center text-sm text-muted-foreground mt-6"
                    >
                        Demo: Use any email/password to login as student<br />
                        Use email with "admin" to login as admin<br />
                        <Link to="/register" className="text-primary hover:underline block mt-2">
                            Don't have an account? Register here
                        </Link>
                    </motion.p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;