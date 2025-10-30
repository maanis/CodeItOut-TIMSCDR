import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2, Mail, Lock, User, Hash, Camera, Sparkles, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        roll: '',
        email: '',
        password: ''
    });
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { registerStudent } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    // Safe window dimensions with fallbacks
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (!profileImage) {
                toast.error('Please upload a profile image for face recognition');
                setIsLoading(false);
                return;
            }

            await registerStudent(formData.name, formData.roll, formData.email, formData.password, profileImage);
            toast.success('Registration successful! Welcome to the coding club! 🎉');
            navigate('/dashboard');
        } catch (error) {
            toast.error('Registration failed. Please try again.');
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
                    {/* Back to login link */}

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
                        <p className="text-muted-foreground">Create your account to get started</p>
                    </motion.div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex">
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
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
                            </motion.div>

                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.35 }}
                            >
                                <Label htmlFor="roll" className="flex items-center gap-2 mb-2">
                                    <Hash className="w-4 h-4" />
                                    Roll Number
                                </Label>
                                <Input
                                    id="roll"
                                    name="roll"
                                    type="text"
                                    placeholder="CS001"
                                    value={formData.roll}
                                    onChange={handleInputChange}
                                    required
                                    className="h-11"
                                />
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
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
                        </motion.div>

                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.45 }}
                        >
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
                        </motion.div>

                        {/* Profile Image Upload */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Label className="flex items-center gap-2 mb-2">
                                <Camera className="w-4 h-4" />
                                Profile Image (Required for face recognition)
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
                                    <div className="flex justify-center">
                                        <img
                                            src={imagePreview}
                                            alt="Profile preview"
                                            className="w-20 h-20 rounded-full object-cover border-2 border-primary/20"
                                        />
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.55 }}
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
                                    'Create Account'
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
                        Already have an account?{' '}
                        <Link to="/" className="text-primary hover:underline">
                            Sign in here
                        </Link>
                    </motion.p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;