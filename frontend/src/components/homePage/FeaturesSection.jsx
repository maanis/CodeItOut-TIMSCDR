import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Calendar, Layers, Rocket, Users } from "lucide-react";

// --- Matrix Rain Component (Background Effect) ---
const MatrixRain = ({ color }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let animationFrameId;

        // Set canvas size
        const resizeCanvas = () => {
            if (canvas.parentElement) {
                canvas.width = canvas.parentElement.offsetWidth;
                canvas.height = canvas.parentElement.offsetHeight;
            }
        };
        resizeCanvas();

        // Matrix characters
        const chars = "010101001100101010HEXCODE";
        const charArray = chars.split("");
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = [];

        // Initialize drops
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * -100;
        }

        const draw = () => {
            // Check if dark mode is active to determine trail color
            // This ensures the matrix fades correctly into white (light mode) or black (dark mode)
            const isDark = document.documentElement.classList.contains("dark");

            // Trail color: White with opacity for Light Mode, Dark with opacity for Dark Mode
            ctx.fillStyle = isDark ? "rgba(23, 23, 23, 0.1)" : "rgba(255, 255, 255, 0.2)";

            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = color;
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = charArray[Math.floor(Math.random() * charArray.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        window.addEventListener("resize", resizeCanvas);
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", resizeCanvas);
        };
    }, [color]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"
        />
    );
};

// --- Main Component ---
const FeaturesSection = () => {
    const features = [
        {
            icon: Users,
            title: "Collaborative Coding",
            description: "Work together on exciting projects with fellow developers. Share knowledge and grow together.",
            theme: "from-cyan-400 to-blue-500",
            hex: "#06b6d4"
        },
        {
            icon: Calendar,
            title: "Tech Workshops",
            description: "Regular hands-on workshops covering the latest technologies and industry best practices.",
            theme: "from-purple-400 to-pink-500",
            hex: "#d946ef"
        },
        {
            icon: Rocket,
            title: "Open Source Projects",
            description: "Contribute to meaningful open source projects and build your portfolio while learning.",
            theme: "from-orange-400 to-red-500",
            hex: "#f97316"
        },
        {
            icon: Layers,
            title: "AI & ML Bootcamps",
            description: "Deep dive into artificial intelligence and machine learning with expert-led bootcamps.",
            theme: "from-emerald-400 to-green-500",
            hex: "#10b981"
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <section className="py-24 relative bg-neutral-50 dark:bg-neutral-950 overflow-hidden transition-colors duration-500" id="features">
            {/* Background ambient glow - Adapted for light/dark */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-500/5 dark:bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold mb-6 text-neutral-900 dark:text-white"
                    >
                        Platform Features
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto text-lg"
                    >
                        Unlock the full potential of tech learning with our comprehensive platform designed to simplify your coding journey.
                    </motion.p>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
                >
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            variants={cardVariants}
                            className="group relative h-full"
                        >
                            {/* Hover Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent dark:from-white/10 dark:to-white/0 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            {/* Card Body */}
                            <div className="relative h-full bg-white dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200 dark:border-white/10 rounded-3xl overflow-hidden hover:border-neutral-300 dark:hover:border-white/20 shadow-xl shadow-neutral-200/50 dark:shadow-none transition-all duration-500">

                                {/* Matrix Background Layer */}
                                <MatrixRain color={feature.hex} />

                                <div className="p-8 relative z-10 flex flex-col h-full">
                                    {/* Icon Box */}
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.theme} p-[1px] mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-gray-200/50 dark:shadow-none`}>
                                        <div className="w-full h-full bg-white dark:bg-neutral-900 rounded-2xl flex items-center justify-center relative overflow-hidden transition-colors duration-500">
                                            <div className={`absolute inset-0 bg-gradient-to-br ${feature.theme} opacity-10 dark:opacity-20`} />
                                            <feature.icon className={`w-7 h-7 text-neutral-800 dark:text-white relative z-10`} />
                                        </div>
                                    </div>

                                    {/* Title with Gradient on Hover */}
                                    <h3 className="text-xl font-bold mb-3 text-neutral-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-neutral-900 group-hover:to-neutral-600 dark:group-hover:from-white dark:group-hover:to-white/70 transition-all">
                                        {feature.title}
                                    </h3>

                                    <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed group-hover:text-neutral-900 dark:group-hover:text-neutral-300 transition-colors">
                                        {feature.description}
                                    </p>
                                </div>

                                {/* Bottom Glow Line */}
                                <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${feature.theme} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default FeaturesSection;