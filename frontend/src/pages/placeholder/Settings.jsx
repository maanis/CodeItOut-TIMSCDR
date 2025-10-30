import { motion } from 'framer-motion';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card shadow-card rounded-2xl p-8"
        >
            <div className="text-center">
                <SettingsIcon className="w-16 h-16 mx-auto mb-4 text-primary" />
                <h1 className="text-3xl font-bold mb-2">Settings</h1>
                <p className="text-muted-foreground">Settings page coming soon...</p>
            </div>
        </motion.div>
    );
};

export default Settings;