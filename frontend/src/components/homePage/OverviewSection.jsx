import React from 'react';
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.1
        }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
};

const OverviewSection = () => {
    return (
        <section className="py-20 dark:bg-gradient-to-b dark:from-neutral-950 dark:to-neutral-900 relative">
            <div className="container mx-auto px-6">
                <motion.div
                    className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {/* Left card */}
                    <motion.div
                        className="glass-card rounded-3xl p-8 cursor-pointer"
                        variants={cardVariants}
                        whileHover={{ y: -8, transition: { duration: 0.3 } }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <motion.div
                                whileHover={{ rotate: 10, scale: 1.1 }}
                                className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20"
                            >
                                <span className="text-2xl">👍</span>
                            </motion.div>
                            <motion.div
                                whileHover={{ rotate: -10, scale: 1.1 }}
                                className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg shadow-pink-500/20"
                            >
                                <span className="text-2xl">⏱️</span>
                            </motion.div>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Stay Connected</h3>
                        <p className="text-sm text-muted-foreground">
                            Join our vibrant community of developers and innovators
                        </p>
                    </motion.div>

                    {/* Center card - Overview */}
                    <motion.div
                        className="glass-card rounded-3xl p-8 md:col-span-1 cursor-pointer"
                        variants={cardVariants}
                        whileHover={{ y: -8, transition: { duration: 0.3 } }}
                    >
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold mb-4">Overview</h2>
                            <div className="flex justify-center gap-2 mb-4">
                                {[
                                    { from: 'from-blue-400', to: 'to-cyan-500' },
                                    { from: 'from-purple-400', to: 'to-pink-500' },
                                    { from: 'from-green-400', to: 'to-emerald-500' }
                                ].map((gradient, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ y: -5, zIndex: 10 }}
                                        className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradient.from} ${gradient.to} border-2 border-background ${i > 0 ? '-ml-3' : ''}`}
                                    />
                                ))}
                            </div>
                            <p className="text-xs text-muted-foreground">Active Contributors</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-4 text-center"
                            >
                                <div className="text-3xl font-bold mb-1">370+</div>
                                <div className="text-xs text-muted-foreground">Total Members</div>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl p-4 text-center"
                            >
                                <div className="text-3xl font-bold mb-1">75%</div>
                                <div className="text-xs text-muted-foreground">Growth Rate</div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Right card */}
                    <motion.div
                        className="glass-card rounded-3xl p-8 cursor-pointer"
                        variants={cardVariants}
                        whileHover={{ y: -8, transition: { duration: 0.3 } }}
                    >
                        <div className="mb-6">
                            <div className="w-full h-32 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 flex items-center justify-center overflow-hidden">
                                <motion.div
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [0.6, 0.3, 0.6]
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400"
                                />
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Ready to Code</h3>
                        <p className="text-sm text-muted-foreground">
                            Access resources and start building amazing projects
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default OverviewSection;