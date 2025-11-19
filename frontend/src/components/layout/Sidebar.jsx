import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
    Home,
    User,
    Calendar,
    Trophy,
    Code2,
    Users,
    Settings,
    Sparkles,
    LogOut
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
    // { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
];

const Sidebar = () => {
    const { logout } = useAuth();
    const { isMobileMenuOpen, closeMobileMenu } = useMobileMenu();
    const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setIsLogoutDialogOpen(false);
    };

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
                "flex flex-col w-64 border-r border-border bg-card/50 backdrop-blur-sm",
                // Desktop: always visible, normal layout
                "lg:flex lg:relative lg:translate-x-0",
                // Mobile: overlay from left with animation
                "fixed left-0 top-0 h-full z-50 transition-transform duration-300 ease-in-out",
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-6 border-b border-border">
                    <div className="flex items-center gap-3">
                        <img src="/logo.png" className='h-12 w-12' alt="" />
                        <div>
                            <h2 className="font-bold text-lg">Coding Club</h2>
                            <p className="text-xs text-muted-foreground">Dashboard</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4">
                    <ul className="space-y-2">
                        {navItems.map((item, index) => (
                            <motion.li
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
                                            'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                                            isActive
                                                ? 'bg-primary text-primary-foreground shadow-md'
                                                : 'hover:bg-secondary text-foreground'
                                        )
                                    }
                                    onClick={closeMobileMenu} // Close mobile menu on navigation
                                >
                                    {({ isActive }) => (
                                        <>
                                            <item.icon className={cn('w-5 h-5', isActive && 'animate-pulse')} />
                                            <span className="font-medium">{item.label}</span>
                                        </>
                                    )}
                                </NavLink>
                            </motion.li>
                        ))}
                    </ul>
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-border">
                    <Button
                        onClick={() => {
                            setIsLogoutDialogOpen(true);
                            closeMobileMenu(); // Close mobile menu
                        }}
                        variant="ghost"
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-destructive hover:text-destructive-foreground text-muted-foreground hover:text-white"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </Button>
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