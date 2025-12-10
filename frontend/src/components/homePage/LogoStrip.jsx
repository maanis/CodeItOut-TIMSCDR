import React from "react";
import { motion } from "framer-motion";
import {
    Code2, Database, Cloud, Cpu, Terminal, Boxes,
    GitBranch, Globe, Server, Shield, Layers, Command
} from "lucide-react";

const LogoStrip = () => {
    const logos = [
        { icon: Code2, name: "React" },
        { icon: Database, name: "MongoDB" },
        { icon: Cloud, name: "Cloudflare" },
        { icon: Cpu, name: "Node.js" },
        { icon: Terminal, name: "Python" },
        { icon: Boxes, name: "Docker" },
        { icon: GitBranch, name: "Git" },
        { icon: Globe, name: "Next.js" },
        { icon: Server, name: "AWS" },
        { icon: Shield, name: "Auth0" },
        { icon: Layers, name: "Stack" },
        { icon: Command, name: "CLI" },
    ];

    // Duplicate the logos to ensure a seamless loop
    const duplicatedLogos = [...logos, ...logos];

    return (
        <section className="py-12 border-y dark:bg-gradient-to-b dark:from-neutral-900 dark:to-neutral-950 border-white/5 overflow-hidden">
            <div className="container mx-auto px-6 relative">

                {/* Gradient Mask for fading edges */}
                <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">

                    <motion.div
                        className="flex gap-12 md:gap-24 w-max"
                        initial={{ x: 0 }}
                        animate={{ x: "-50%" }}
                        transition={{
                            duration: 60, // Slower speed for smoother perception
                            ease: "linear",
                            repeat: Infinity,
                        }}
                        style={{ willChange: "transform" }} // Hardware acceleration
                    >
                        {duplicatedLogos.map((logo, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-3 text-muted-foreground/50 hover:text-foreground transition-colors duration-300 cursor-default flex-shrink-0"
                            >
                                <logo.icon className="w-6 h-6" />
                                <span className="text-sm font-medium whitespace-nowrap">{logo.name}</span>
                            </div>
                        ))}
                    </motion.div>

                </div>

            </div>
        </section>
    );
};

export default LogoStrip;