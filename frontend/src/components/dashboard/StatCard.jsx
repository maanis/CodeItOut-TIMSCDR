import { motion } from 'framer-motion';
import CountUp from 'react-countup';

const StatCard = ({ icon: Icon, label, value, suffix = '', gradient = 'gradient-primary', index = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="glass-card shadow-card rounded-xl p-6 relative overflow-hidden group"
        >
            <div className={`absolute inset-0 ${gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${gradient} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                </div>

                <div className="text-3xl font-bold mb-2">
                    <CountUp end={value} duration={2} suffix={suffix} />
                </div>

                <p className="text-sm text-muted-foreground">{label}</p>
            </div>
        </motion.div>
    );
};

export default StatCard;