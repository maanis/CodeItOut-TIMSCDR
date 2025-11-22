import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Camera, Sparkles, ArrowLeft, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Register = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    // Stage state: 'info', 'verify-otp', 'complete'
    const [stage, setStage] = useState('info');
    const [isLoading, setIsLoading] = useState(false);

    // Registration form data
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    // Profile image
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // OTP verification
    const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
    const [otpEmail, setOtpEmail] = useState('');

    // Username validation
    const [usernameError, setUsernameError] = useState('');
    const [usernameFeedback, setUsernameFeedback] = useState('');

    // Safe window dimensions
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;

    // Redirect if already logged in
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if (storedUser && storedToken) {
            try {
                const user = JSON.parse(storedUser);
                if (user.role === 'teacher') {
                    navigate('/admin/dashboard');
                } else if (user.role === 'student') {
                    navigate('/dashboard');
                }
            } catch (error) {
                console.error('Error parsing stored user:', error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Validate username in real-time
        if (name === 'username') {
            if (value.length < 3 && value.length > 0) {
                setUsernameError('Username must be at least 3 characters');
            } else if (value.length > 30) {
                setUsernameError('Username must be at most 30 characters');
            } else if (value && !/^[a-zA-Z0-9_-]+$/.test(value)) {
                setUsernameError('Only letters, numbers, underscores, and hyphens allowed');
            } else {
                setUsernameError('');
            }
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate image type and size
            if (!file.type.startsWith('image/')) {
                toast.error('Please upload a valid image file');
                return;
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB
                toast.error('Image size must be less than 5MB');
                return;
            }

            setProfileImage(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // ========== STAGE 1: Enter Information ==========
    const handleSendOTP = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.name.trim()) {
            toast.error('Please enter your name');
            return;
        }
        if (!formData.username.trim()) {
            toast.error('Please enter a username');
            return;
        }
        if (usernameError) {
            toast.error(usernameError);
            return;
        }
        if (!formData.email) {
            toast.error('Please enter your email');
            return;
        }
        if (!formData.password) {
            toast.error('Please enter a password');
            return;
        }
        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        if (!profileImage) {
            toast.error('Please upload a profile image');
            return;
        }

        setIsLoading(true);

        try {
            // Send OTP for email verification
            const response = await axios.post(`${API_URL}/auth/send-otp`, {
                email: formData.email,
            });

            if (response.data.success) {
                setOtpEmail(formData.email);
                setStage('verify-otp');
                toast.success('OTP sent to your email');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send OTP');
        } finally {
            setIsLoading(false);
        }
    };

    // ========== STAGE 2: Verify OTP ==========
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
            // Verify OTP
            const response = await axios.post(`${API_URL}/auth/verify-otp`, {
                email: otpEmail,
                otp,
            });

            if (response.data.success) {
                setStage('complete');
                toast.success('Email verified successfully!');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid OTP');
        } finally {
            setIsLoading(false);
        }
    };

    // ========== STAGE 3: Complete Registration ==========
    const handleCompleteRegistration = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Create FormData for multipart upload
            const registrationData = new FormData();
            registrationData.append('name', formData.name);
            registrationData.append('username', formData.username);
            registrationData.append('email', formData.email);
            registrationData.append('password', formData.password);
            registrationData.append('profileImage', profileImage);

            const response = await axios.post(`${API_URL}/auth/register`, registrationData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                // Save token and user data
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));

                toast.success('Welcome to CodeItOut! 🎉');

                // Redirect based on role
                const role = response.data.user.role;
                if (role === 'teacher') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/dashboard');
                }
            }
        } catch (error) {
            if (error.response?.status === 400) {
                toast.error(error.response?.data?.message || 'Registration failed');
            } else {
                toast.error('Failed to complete registration');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setIsLoading(true);

        try {
            const response = await axios.post(`${API_URL}/auth/send-otp`, {
                email: otpEmail,
            });

            if (response.data.success) {
                setOtpCode(['', '', '', '', '', '']);
                toast.success('OTP resent to your email');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to resend OTP');
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
                            Join the Coding Club
                        </h1>
                        <p className="text-muted-foreground">
                            {stage === 'info' && 'Create your account to get started'}
                            {stage === 'verify-otp' && 'Verify your email address'}
                            {stage === 'complete' && 'You\'re all set!'}
                        </p>
                    </motion.div>

                    {/* Progress indicator */}
                    <div className="flex gap-2 mb-8">
                        <div className={`h-1 flex-1 rounded-full transition-colors ${stage === 'info' || stage === 'verify-otp' || stage === 'complete' ? 'bg-primary' : 'bg-muted'}`} />
                        <div className={`h-1 flex-1 rounded-full transition-colors ${stage === 'verify-otp' || stage === 'complete' ? 'bg-primary' : 'bg-muted'}`} />
                        <div className={`h-1 flex-1 rounded-full transition-colors ${stage === 'complete' ? 'bg-primary' : 'bg-muted'}`} />
                    </div>

                    {/* STAGE 1: Enter Information */}
                    {stage === 'info' && (
                        <motion.form
                            onSubmit={handleSendOTP}
                            className="space-y-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <div>
                                <Label htmlFor="name" className="flex items-center gap-2 mb-2">
                                    <User className="w-4 h-4" />
                                    Full Name
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="h-11"
                                />
                            </div>

                            <div>
                                <Label htmlFor="username" className="flex items-center gap-2 mb-2">
                                    <User className="w-4 h-4" />
                                    Username
                                </Label>
                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    placeholder="john_doe123"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    required
                                    className={`h-11 ${usernameError ? 'border-red-500' : ''}`}
                                />
                                {usernameError && (
                                    <p className="text-xs text-red-500 mt-1">{usernameError}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                                    <Mail className="w-4 h-4" />
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="h-11"
                                />
                            </div>

                            <div>
                                <Label htmlFor="password" className="flex items-center gap-2 mb-2">
                                    <Lock className="w-4 h-4" />
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                    className="h-11"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    {formData.password.length < 6 ? `${6 - formData.password.length} characters remaining` : '✓ Password is strong'}
                                </p>
                            </div>

                            <div>
                                <Label htmlFor="confirmPassword" className="flex items-center gap-2 mb-2">
                                    <Lock className="w-4 h-4" />
                                    Confirm Password
                                </Label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    required
                                    className={`h-11 ${formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-500' : ''}`}
                                />
                                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                    <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                                )}
                            </div>

                            {/* Profile Image Upload */}
                            <div>
                                <Label className="flex items-center gap-2 mb-2">
                                    <Camera className="w-4 h-4" />
                                    Profile Image
                                </Label>
                                <div className="space-y-3">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full h-11"
                                    >
                                        <Camera className="w-4 h-4 mr-2" />
                                        {profileImage ? 'Change Image' : 'Upload Profile Image'}
                                    </Button>
                                    {imagePreview && (
                                        <div className="flex flex-col items-center gap-2">
                                            <img
                                                src={imagePreview}
                                                alt="Profile preview"
                                                className="w-20 h-20 rounded-full object-cover border-2 border-primary/20"
                                            />
                                            <p className="text-xs text-muted-foreground">Image selected ✓</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-11 gradient-primary text-white font-semibold"
                                disabled={isLoading || !!usernameError}
                            >
                                {isLoading ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                    >
                                        <Sparkles className="w-5 h-5" />
                                    </motion.div>
                                ) : (
                                    'Continue to Verification'
                                )}
                            </Button>
                        </motion.form>
                    )}

                    {/* STAGE 2: Verify OTP */}
                    {stage === 'verify-otp' && (
                        <motion.form
                            onSubmit={handleVerifyOTP}
                            className="space-y-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
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
                                onClick={handleResendOTP}
                                className="w-full text-sm text-primary hover:underline"
                                disabled={isLoading}
                            >
                                Didn't receive code? Resend OTP
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setStage('info');
                                    setOtpCode(['', '', '', '', '', '']);
                                }}
                                className="w-full text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Registration
                            </button>
                        </motion.form>
                    )}

                    {/* STAGE 3: Complete */}
                    {stage === 'complete' && (
                        <motion.div
                            className="text-center space-y-6"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <motion.div
                                className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Check className="w-8 h-8 text-green-500" />
                            </motion.div>

                            <div>
                                <h2 className="text-2xl font-bold text-foreground mb-2">Email Verified!</h2>
                                <p className="text-muted-foreground text-sm">
                                    Your account is ready. Complete registration by confirming your details.
                                </p>
                            </div>

                            <div className="bg-muted rounded-lg p-4 text-left space-y-2">
                                <p className="text-sm"><span className="font-semibold">Name:</span> {formData.name}</p>
                                <p className="text-sm"><span className="font-semibold">Username:</span> {formData.username}</p>
                                <p className="text-sm"><span className="font-semibold">Email:</span> {formData.email}</p>
                            </div>

                            <Button
                                onClick={handleCompleteRegistration}
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
                                    'Complete Registration'
                                )}
                            </Button>
                        </motion.div>
                    )}

                    {/* Footer */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-center text-sm text-muted-foreground mt-6"
                    >
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary hover:underline font-semibold">
                            Sign in here
                        </Link>
                    </motion.p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;