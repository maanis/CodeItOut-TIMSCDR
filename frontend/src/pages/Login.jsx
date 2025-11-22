import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Sparkles, User, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Login = () => {
    const [activeTab, setActiveTab] = useState('username'); // username, email, otp
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    // Tab 1: Username & Password
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Tab 2: Email & Password
    const [emailLogin, setEmailLogin] = useState('');
    const [passwordLogin, setPasswordLogin] = useState('');

    // Tab 3: OTP Login
    const [otpEmail, setOtpEmail] = useState('');
    const [otpStage, setOtpStage] = useState('send'); // send, verify, reset
    const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
    const [resetToken, setResetToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Safe window dimensions
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;

    // ========== TAB 1: Username & Password ==========
    const handleUsernameLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post(`${API_URL}/auth/login-username`, {
                username,
                password,
            });

            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));

                toast.success('Welcome back! 🎉');
                navigate('/dashboard');
            }
        } catch (error) {
            if (error.response?.status === 403) {
                toast.error('Email not verified. Please verify your email first.');
            } else {
                toast.error(error.response?.data?.message || 'Invalid credentials');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // ========== TAB 2: Email & Password ==========
    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                email: emailLogin,
                password: passwordLogin,
            });

            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));

                toast.success('Welcome back! 🎉');
                navigate('/dashboard');
            }
        } catch (error) {
            if (error.response?.status === 403) {
                toast.error('Email not verified. Please verify your email first.');
            } else {
                toast.error(error.response?.data?.message || 'Invalid credentials');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // ========== TAB 3: OTP Login ==========
    const handleSendOTP = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post(`${API_URL}/auth/login-send-otp`, {
                email: otpEmail,
            });

            if (response.data.success) {
                setOtpStage('verify');
                toast.success('OTP sent to your email');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send OTP');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpChange = (index, value) => {
        if (value.length > 1) return;
        const newOtp = [...otpCode];
        newOtp[index] = value;
        setOtpCode(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        const otp = otpCode.join('');

        if (otp.length !== 6) {
            toast.error('Please enter a 6-digit OTP');
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post(`${API_URL}/auth/login-verify`, {
                email: otpEmail,
                otp,
            });

            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));

                toast.success('Login successful! 🎉');
                navigate('/dashboard');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid OTP');
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post(`${API_URL}/auth/forgot-password`, {
                email: otpEmail,
            });

            if (response.data.success) {
                setOtpStage('reset');
                toast.success('Password reset OTP sent. Check your email.');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send reset link');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post(`${API_URL}/auth/reset-password`, {
                token: resetToken,
                password: newPassword,
            });

            if (response.data.success) {
                toast.success('Password reset successful!');
                setOtpStage('send');
                setOtpEmail('');
                setResetToken('');
                setNewPassword('');
                setConfirmPassword('');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reset password');
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
                        <p className="text-muted-foreground">Welcome back</p>
                    </motion.div>

                    {/* Tabs Navigation */}
                    <div className="flex gap-2 mb-6 bg-muted rounded-lg p-1">
                        <button
                            onClick={() => setActiveTab('username')}
                            className={`flex-1 py-2 px-3 rounded font-medium text-sm transition-all ${activeTab === 'username'
                                    ? 'bg-primary text-white'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <User className="w-4 h-4" />
                                Username
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('email')}
                            className={`flex-1 py-2 px-3 rounded font-medium text-sm transition-all ${activeTab === 'email'
                                    ? 'bg-primary text-white'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Mail className="w-4 h-4" />
                                Email
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('otp')}
                            className={`flex-1 py-2 px-3 rounded font-medium text-sm transition-all ${activeTab === 'otp'
                                    ? 'bg-primary text-white'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Key className="w-4 h-4" />
                                OTP
                            </div>
                        </button>
                    </div>

                    {/* Tab 1: Username & Password */}
                    {activeTab === 'username' && (
                        <motion.form
                            onSubmit={handleUsernameLogin}
                            className="space-y-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <div>
                                <Label htmlFor="username" className="flex items-center gap-2 mb-2">
                                    <User className="w-4 h-4" />
                                    Username
                                </Label>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="john_doe"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="h-11"
                                />
                            </div>

                            <div>
                                <Label htmlFor="password1" className="flex items-center gap-2 mb-2">
                                    <Lock className="w-4 h-4" />
                                    Password
                                </Label>
                                <Input
                                    id="password1"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="h-11"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-11 gradient-primary text-white font-semibold"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                    >
                                        <Sparkles className="w-5 h-5" />
                                    </motion.div>
                                ) : (
                                    'Sign In'
                                )}
                            </Button>
                        </motion.form>
                    )}

                    {/* Tab 2: Email & Password */}
                    {activeTab === 'email' && (
                        <motion.form
                            onSubmit={handleEmailLogin}
                            className="space-y-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <div>
                                <Label htmlFor="email2" className="flex items-center gap-2 mb-2">
                                    <Mail className="w-4 h-4" />
                                    Email
                                </Label>
                                <Input
                                    id="email2"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={emailLogin}
                                    onChange={(e) => setEmailLogin(e.target.value)}
                                    required
                                    className="h-11"
                                />
                            </div>

                            <div>
                                <Label htmlFor="password2" className="flex items-center gap-2 mb-2">
                                    <Lock className="w-4 h-4" />
                                    Password
                                </Label>
                                <Input
                                    id="password2"
                                    type="password"
                                    placeholder="••••••••"
                                    value={passwordLogin}
                                    onChange={(e) => setPasswordLogin(e.target.value)}
                                    required
                                    className="h-11"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-11 gradient-primary text-white font-semibold"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                    >
                                        <Sparkles className="w-5 h-5" />
                                    </motion.div>
                                ) : (
                                    'Sign In'
                                )}
                            </Button>

                            <button
                                type="button"
                                onClick={() => setActiveTab('otp')}
                                className="w-full text-sm text-primary hover:underline"
                            >
                                Forgot your password?
                            </button>
                        </motion.form>
                    )}

                    {/* Tab 3: OTP Login */}
                    {activeTab === 'otp' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6"
                        >
                            {/* Send OTP Stage */}
                            {otpStage === 'send' && (
                                <form onSubmit={handleSendOTP} className="space-y-6">
                                    <div>
                                        <Label htmlFor="otp-email" className="flex items-center gap-2 mb-2">
                                            <Mail className="w-4 h-4" />
                                            Email
                                        </Label>
                                        <Input
                                            id="otp-email"
                                            type="email"
                                            placeholder="you@example.com"
                                            value={otpEmail}
                                            onChange={(e) => setOtpEmail(e.target.value)}
                                            required
                                            className="h-11"
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full h-11 gradient-primary text-white font-semibold"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Sending...' : 'Send OTP'}
                                    </Button>
                                </form>
                            )}

                            {/* Verify OTP Stage */}
                            {otpStage === 'verify' && (
                                <form onSubmit={handleVerifyOTP} className="space-y-6">
                                    <div className="text-center mb-4">
                                        <p className="text-sm text-muted-foreground">
                                            Enter the 6-digit code sent to <br />
                                            <span className="font-semibold text-foreground">{otpEmail}</span>
                                        </p>
                                    </div>

                                    <div className="flex gap-2 justify-center">
                                        {otpCode.map((digit, index) => (
                                            <Input
                                                key={index}
                                                id={`otp-${index}`}
                                                type="text"
                                                inputMode="numeric"
                                                maxLength="1"
                                                value={digit}
                                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Backspace' && !digit && index > 0) {
                                                        document.getElementById(`otp-${index - 1}`)?.focus();
                                                    }
                                                }}
                                                className="h-12 w-12 text-center text-lg font-bold"
                                            />
                                        ))}
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full h-11 gradient-primary text-white font-semibold"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Verifying...' : 'Verify OTP'}
                                    </Button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setOtpStage('send');
                                            setOtpCode(['', '', '', '', '', '']);
                                        }}
                                        className="w-full text-sm text-primary hover:underline"
                                    >
                                        Back to Email
                                    </button>
                                </form>
                            )}

                            {/* Reset Password Stage */}
                            {otpStage === 'reset' && (
                                <form onSubmit={handleResetPassword} className="space-y-4">
                                    <div>
                                        <Label htmlFor="reset-token" className="flex items-center gap-2 mb-2">
                                            <Key className="w-4 h-4" />
                                            Reset Token
                                        </Label>
                                        <Input
                                            id="reset-token"
                                            type="text"
                                            placeholder="Paste token from email"
                                            value={resetToken}
                                            onChange={(e) => setResetToken(e.target.value)}
                                            required
                                            className="h-11"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="new-pass" className="flex items-center gap-2 mb-2">
                                            <Lock className="w-4 h-4" />
                                            New Password
                                        </Label>
                                        <Input
                                            id="new-pass"
                                            type="password"
                                            placeholder="••••••••"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                            className="h-11"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="confirm-pass" className="flex items-center gap-2 mb-2">
                                            <Lock className="w-4 h-4" />
                                            Confirm Password
                                        </Label>
                                        <Input
                                            id="confirm-pass"
                                            type="password"
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            className="h-11"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full h-11 gradient-primary text-white font-semibold"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Resetting...' : 'Reset Password'}
                                    </Button>
                                </form>
                            )}
                        </motion.div>
                    )}

                    {/* Footer */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-center text-sm text-muted-foreground mt-6"
                    >
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary hover:underline font-semibold">
                            Register here
                        </Link>
                    </motion.p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;