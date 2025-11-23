import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import {
    Home,
    User,
    Calendar,
    Trophy,
    Code2,
    Users,
    Settings,
    LogOut,
    ChevronUp,
    Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useMobileMenu } from '@/contexts/MobileMenuContext';

const navItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: User, label: 'My Profile', path: '/dashboard/student' },
    { icon: Trophy, label: 'Contests', path: '/dashboard/contests' },
    { icon: Calendar, label: 'Events', path: '/dashboard/events' },
    { icon: Code2, label: 'Projects', path: '/dashboard/projects' },
    { icon: Trophy, label: 'Leaderboard', path: '/dashboard/leaderboard' },
    { icon: Users, label: 'Community', path: '/dashboard/community' },
];

const Sidebar = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const { isMobileMenuOpen, closeMobileMenu } = useMobileMenu();
    const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);

    const handleLogout = () => {
        logout();
        setIsLogoutDialogOpen(false);
        setIsUserMenuOpen(false);
        navigate('/');
    };

    // Click-outside detection for user menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={closeMobileMenu}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "flex flex-col h-screen w-64 border-r border-border bg-card/50 backdrop-blur-sm",
                // Desktop: always visible, normal layout
                "lg:flex lg:relative lg:translate-x-0",
                // Mobile: overlay from left with animation
                "fixed left-0 top-0 z-50 transition-transform duration-300 ease-in-out",
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Header */}
                <div className="p-4 border-b border-border">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                            <img src="/logo.png" className='h-10 w-10 rounded-lg' alt="Logo" />
                            <div className="min-w-0">
                                <h2 className="font-bold text-sm truncate">CodeItOut</h2>
                                <p className="text-xs text-muted-foreground truncate">Student</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-3">
                    <div className="space-y-1">
                        {navItems.map((item, index) => (
                            <motion.div
                                key={item.path}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <NavLink
                                    to={item.path}
                                    end={item.path === '/dashboard'}
                                    className={({ isActive }) =>
                                        cn(
                                            'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium',
                                            isActive
                                                ? 'bg-primary text-primary-foreground shadow-md'
                                                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                                        )
                                    }
                                    onClick={closeMobileMenu}
                                >
                                    {({ isActive }) => (
                                        <>
                                            <item.icon className={cn('w-4 h-4 shrink-0', isActive && 'animate-pulse')} />
                                            <span className="truncate">{item.label}</span>
                                        </>
                                    )}
                                </NavLink>
                            </motion.div>
                        ))}
                    </div>
                </nav>

                {/* Footer - User Menu */}
                <div className="p-3 border-t border-border" ref={userMenuRef}>
                    <button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                    >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shrink-0 overflow-hidden">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt={user?.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-xs font-bold text-primary-foreground">
                                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </span>
                                )}
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-semibold truncate">{user?.name || 'User'}</p>
                                <p className="text-xs text-muted-foreground truncate">{user?.email || 'user@email.com'}</p>
                            </div>
                        </div>
                        <ChevronUp className={cn('w-4 h-4 shrink-0 ml-2 transition-transform', isUserMenuOpen && 'rotate-180')} />
                    </button>

                    {/* User Menu Dropdown */}
                    <motion.div
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={isUserMenuOpen ? { opacity: 1, y: 0, height: 'auto' } : { opacity: 0, y: -10, height: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className={cn('mt-2 p-1 bg-secondary rounded-lg space-y-1 overflow-hidden', !isUserMenuOpen && 'pointer-events-none')}
                    >
                        {/* User Info Header */}
                        <div className="px-3 py-2 border-b border-border mb-1">
                            <p className="font-semibold text-sm">{user?.name || 'User'}</p>
                            <p className="text-xs text-muted-foreground truncate">{user?.email || 'user@email.com'}</p>
                        </div>

                        {/* Settings Link */}
                        <NavLink
                            to="/dashboard/settings"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded text-sm hover:bg-accent transition-colors cursor-pointer"
                        >
                            <Settings className="w-4 h-4" />
                            Settings
                        </NavLink>

                        {/* Sign Out Button */}
                        <button
                            onClick={() => {
                                setIsLogoutDialogOpen(true);
                                setIsUserMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded text-sm text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </motion.div>
                </div>

                {/* Logout Confirmation Dialog */}
                <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
                    <DialogContent className="sm:max-w-[400px]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <LogOut className="w-5 h-5 text-destructive" />
                                Confirm Logout
                            </DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                            <p className="text-muted-foreground">
                                Are you sure you want to logout? You'll need to sign in again to access your account.
                            </p>
                        </div>
                        <DialogFooter className="gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setIsLogoutDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleLogout}
                                className="bg-destructive hover:bg-destructive/90"
                            >
                                Logout
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </aside>
        </>
    );
};

export default Sidebar;