// import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { MobileMenuProvider } from "@/contexts/MobileMenuContext";
import Login from "./pages/Login";
import TestLogin from "./pages/TestLogin";
import TestRegister from "./pages/TestRegister";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import StudentDashboard from "./pages/StudentDashboard";
import StudentContests from "./pages/StudentContests";
import ContestWaitingRoom from "./pages/ContestWaitingRoom";
import TakeContest from "./pages/TakeContest";
import ContestResults from "./pages/ContestResults";
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
import ManageContests from "./pages/admin/ManageContests";
import AdminContestResults from "./pages/admin/AdminContestResults";
import Logs from "./pages/admin/Logs";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import Index from "./components/homePage";
import ProblemsListPage from "./components/InterviewPrep/pages/ProblemsListPage";
import ProblemDetailPage from "./components/InterviewPrep/data/ProblemDetailPage";

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
                <MobileMenuProvider>
                    <TooltipProvider>
                        {/* <Toaster /> */}
                        <Sonner />
                        <BrowserRouter>
                            <Routes>
                                <Route path="/" element={<Index />} />
                                <Route path="/problems" element={<ProblemsListPage />} />
                                <Route path="/problem/:id" element={<ProblemDetailPage />} />
                                <Route path="/testLogin" element={<TestLogin />} />
                                <Route path="/testRegister" element={<TestRegister />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/contests/:id/waiting" element={<ContestWaitingRoom />} />
                                <Route path="/contests/:id/take" element={<TakeContest />} />
                                <Route path="/contests/:id/results" element={<ContestResults />} />
                                <Route path="/adminn/contests/:id/results" element={<AdminContestResults />} />
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
                                    <Route path="contests" element={<StudentContests />} />
                                    {/* <Route path="contests/:id/waiting" element={<ContestWaitingRoom />} />
                                    <Route path="contests/:id/take" element={<TakeContest />} />
                                    <Route path="contests/:id/results" element={<ContestResults />} /> */}
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
                                        // <ProtectedRoute allowedRole="admin">
                                        <AdminDashboardLayout />
                                        // </ProtectedRoute>
                                    }
                                >
                                    <Route path="dashboard" element={<AdminDashboard />} />
                                    <Route path="announcements" element={<ManageAnnouncements />} />
                                    <Route path="events" element={<ManageEvents />} />
                                    <Route path="students" element={<ManageStudents />} />
                                    <Route path="community" element={<ManageCommunity />} />
                                    <Route path="contests" element={<ManageContests />} />
                                    {/* <Route path="contests/:id/results" element={<AdminContestResults />} /> */}
                                    <Route path="badges" element={<ManageBadges />} />
                                    <Route path="leaderboard" element={<ManageLeaderboard />} />
                                    <Route path="projects" element={<ManageProjects />} />
                                    <Route path="logs" element={<Logs />} />
                                    <Route path="settings" element={<Settings />} />
                                </Route>

                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </BrowserRouter>
                    </TooltipProvider>
                </MobileMenuProvider>
            </AuthProvider>
        </ThemeProvider>
    </QueryClientProvider>
);

export default App;