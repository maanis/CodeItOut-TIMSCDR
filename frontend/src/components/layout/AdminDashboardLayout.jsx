import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import AdminSidebar from './AdminSidebar';

const AdminDashboardLayout = () => {
    return (
        <div className="flex h-screen">
            <AdminSidebar />
            <main className="flex-1 overflow-y-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="p-6 lg:p-8"
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};

export default AdminDashboardLayout;