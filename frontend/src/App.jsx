// import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import StudentDashboard from "./pages/StudentDashboard";
import Events from "./pages/placeholder/Events";
import Projects from "./pages/placeholder/Projects";
import Leaderboard from "./pages/placeholder/Leaderboard";
import Community from "./pages/placeholder/Community";
import Settings from "./pages/placeholder/Settings";
import DashboardLayout from "./components/layout/DashboardLayout";
import AdminDashboardLayout from "./components/layout/AdminDashboardLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageAnnouncements from "./pages/admin/ManageAnnouncements";
import ManageEvents from "./pages/admin/ManageEvents";
import ManageStudents from "./pages/admin/ManageStudents";
import ManageLeaderboard from "./pages/admin/ManageLeaderboard";
import ManageProjects from "./pages/admin/ManageProjects";
import ManageBadges from "./pages/admin/ManageBadges";
import ManageCommunity from "./pages/admin/ManageCommunity";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, allowedRole }) => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/" replace />;
    if (allowedRole && user.role !== allowedRole) {
        return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />;
    }
    return <>{children}</>;
};

const App = () => (
    <QueryClientProvider client={queryClient}>
        <ThemeProvider>
            <AuthProvider>
                <TooltipProvider>
                    {/* <Toaster /> */}
                    <Sonner />
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<Login />} />
                            <Route path="/register" element={<Register />} />

                            {/* Student Routes */}
                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute allowedRole="student">
                                        <DashboardLayout />
                                    </ProtectedRoute>
                                }
                            >
                                <Route index element={<Dashboard />} />
                                <Route path="student" element={<StudentDashboard />} />
                                <Route path="events" element={<Events />} />
                                <Route path="projects" element={<Projects />} />
                                <Route path="leaderboard" element={<Leaderboard />} />
                                <Route path="community" element={<Community />} />
                                <Route path="settings" element={<Settings />} />
                            </Route>

                            {/* Admin Routes */}
                            <Route
                                path="/admin"
                                element={
                                    <ProtectedRoute allowedRole="admin">
                                        <AdminDashboardLayout />
                                    </ProtectedRoute>
                                }
                            >
                                <Route path="dashboard" element={<AdminDashboard />} />
                                <Route path="announcements" element={<ManageAnnouncements />} />
                                <Route path="events" element={<ManageEvents />} />
                                <Route path="students" element={<ManageStudents />} />
                                <Route path="community" element={<ManageCommunity />} />
                                <Route path="badges" element={<ManageBadges />} />
                                <Route path="leaderboard" element={<ManageLeaderboard />} />
                                <Route path="projects" element={<ManageProjects />} />
                                <Route path="settings" element={<Settings />} />
                            </Route>

                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </BrowserRouter>
                </TooltipProvider>
            </AuthProvider>
        </ThemeProvider>
    </QueryClientProvider>
);

export default App;