import { createContext, useContext, useState } from 'react';

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            const parsedUser = JSON.parse(stored);
            // Ensure avatar URL is properly formatted
            if (parsedUser.avatar && parsedUser.avatar.startsWith('/uploads/')) {
                parsedUser.avatar = `${API_BASE_URL}${parsedUser.avatar}`;
            }
            return parsedUser;
        }
        return null;
    });

    const login = async (email, password) => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();

            // Store the token in localStorage
            if (data.token) {
                localStorage.setItem('token', data.token);
            }

            console.log(data)

            const userData = {
                id: data.user.id,
                name: data.user.name,
                email: data.user.email,
                role: data.user.role || (data.user.email.toLowerCase().includes('admin') ? 'admin' : 'student'), // Use role from backend, fallback to frontend logic
                avatar: data.user.avatarUrl ? (data.user.avatarUrl.startsWith('/uploads/') ? `${API_BASE_URL}${data.user.avatarUrl}` : data.user.avatarUrl) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.email}`,
                ...(data.user.role === 'student' && { badges: data.user.badges || [] })
            };

            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const registerStudent = async (name, roll, email, password, profileImage) => {
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('roll', roll);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('image', profileImage);

            const response = await fetch('http://localhost:5000/api/auth/register-student', {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Registration failed');
            }

            const data = await response.json();

            console.log(data)

            const userData = {
                id: data.student.id,
                name: data.student.name,
                email: data.student.email,
                roll: data.student.roll,
                role: 'student',
                avatar: data.student.avatarUrl ? (data.student.avatarUrl.startsWith('/uploads/') ? `${API_BASE_URL}${data.student.avatarUrl}` : data.student.avatarUrl) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.student.email}`,
                badges: data.student.badges || []
            };

            if (data.token) {
                localStorage.setItem('token', data.token);
            }

            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    const refreshUser = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch('http://localhost:5000/api/auth/is-authenticated', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                if (data.authenticated) {
                    const userType = data.teacher ? 'teacher' : 'student';
                    const userData = data[userType];

                    const updatedUserData = {
                        id: userData.id,
                        name: userData.name,
                        email: userData.email,
                        role: user?.role || 'student', // Keep existing role
                        avatar: userData.avatarUrl ? (userData.avatarUrl.startsWith('/uploads/') ? `${API_BASE_URL}${userData.avatarUrl}` : userData.avatarUrl) : user?.avatar,
                        ...(userType === 'student' && { badges: userData.badges || [] })
                    };

                    setUser(updatedUserData);
                    localStorage.setItem('user', JSON.stringify(updatedUserData));
                }
            }
        } catch (error) {
            console.error('Failed to refresh user data:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, registerStudent, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}