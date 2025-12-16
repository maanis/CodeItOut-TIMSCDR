import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Instagram, ArrowUpRight, Hash, Terminal } from 'lucide-react';

// --- Dummy Data ---
const teamMembers = [
    {
        id: 1,
        name: "Manish Jha",
        role: "Developer",
        image: "/manish.png",
        socials: { linkedin: "#", github: "#", instagram: "#" },
        status: "online"
    },
    {
        id: 2,
        name: "Sanya Ver",
        role: "FullStack_Lead",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787&auto=format&fit=crop",
        socials: { linkedin: "#", github: "#", instagram: "#" },
        status: "busy"
    },
    {
        id: 3,
        name: "Rohan Das",
        role: "UI_UX_Designer",
        image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=2787&auto=format&fit=crop",
        socials: { linkedin: "#", github: "#", instagram: "#" },
        status: "away"
    },
    {
        id: 4,
        name: "Meera Iyer",
        role: "DevOps_Eng",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2864&auto=format&fit=crop",
        socials: { linkedin: "#", github: "#", instagram: "#" },
        status: "online"
    },
];

// --- Sub-components ---

const StatusDot = ({ status }) => {
    const colors = {
        online: "bg-emerald-500",
        busy: "bg-amber-500",
        away: "bg-neutral-400 dark:bg-neutral-500"
    };
    return (
        <div className={`flex items-center gap-2 px-2 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800`}>
            <span className={`w-2 h-2 rounded-full ${colors[status] || "bg-neutral-400"} animate-pulse`} />
            <span className="text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-mono">{status}</span>
        </div>
    );
};

const Card = ({ member }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative w-full h-[420px] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors duration-300 overflow-hidden"
        >
            {/* 1. Background Grid & Decoration - Adapted for Light/Dark */}
            <div className="absolute inset-0 bg-[size:24px_24px] opacity-30 dark:opacity-20 
        bg-[linear-gradient(to_right,#d4d4d4_1px,transparent_1px),linear-gradient(to_bottom,#d4d4d4_1px,transparent_1px)] 
        dark:bg-[linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)]"
            />

            {/* Top Bar (Tech decoration) */}
            <div className="absolute top-0 left-0 w-full h-10 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-4 z-20 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
                <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                    <div className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                </div>
                <div className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500">ID: {`DEV-00${member.id}`}</div>
            </div>

            {/* 2. Main Image Area */}
            <div className="absolute inset-0 pt-10 pb-20 px-4 flex items-center justify-center overflow-hidden">
                <div className="relative w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500 ease-out">
                    <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover object-center opacity-90 dark:opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    />
                    {/* Scanline Effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/20 dark:via-emerald-500/10 to-transparent translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000 ease-in-out z-10 pointer-events-none" />
                </div>
            </div>

            {/* 3. Info Panel (Bottom) */}
            <div className="absolute bottom-0 left-0 w-full bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 p-5 z-20">

                {/* Name & Role */}
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-tight">
                            {member.name}
                        </h3>
                        <p className="text-emerald-600 dark:text-emerald-500 text-sm font-mono mt-1">
                            {`> ${member.role}`}
                        </p>
                    </div>
                    <StatusDot status={member.status} />
                </div>

                {/* Hidden/Revealed Socials */}
                <div className="h-0 group-hover:h-12 overflow-hidden transition-all duration-300 ease-out">
                    <div className="flex items-center gap-4 pt-3 border-t border-neutral-200 dark:border-neutral-900 mt-3">
                        <SocialLink href={member.socials.github} icon={<Github size={18} />} />
                        <SocialLink href={member.socials.linkedin} icon={<Linkedin size={18} />} />
                        <SocialLink href={member.socials.instagram} icon={<Instagram size={18} />} />
                        <div className="flex-grow" />
                        <a href="#" className="text-xs text-neutral-500 hover:text-emerald-600 dark:hover:text-white flex items-center gap-1 transition-colors">
                            PORTFOLIO <ArrowUpRight size={12} />
                        </a>
                    </div>
                </div>
            </div>

            {/* Corner Accents */}
            <div className="absolute top-10 right-0 w-3 h-3 border-t border-r border-emerald-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-emerald-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.div>
    );
};

const SocialLink = ({ href, icon }) => (
    <a
        href={href}
        className="text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:scale-110 transition-all duration-200"
    >
        {icon}
    </a>
);

const DevTeamShowcase = () => {
    return (
        <section className="min-h-screen w-full bg-neutral-50 dark:bg-neutral-950 py-20 px-4 md:px-8 transition-colors duration-300">

            {/* Header Section */}
            <div className="max-w-7xl mx-auto mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-200 dark:border-neutral-600 pb-8">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Terminal size={20} className="text-emerald-600 dark:text-emerald-500" />
                        <span className="font-mono text-emerald-600 dark:text-emerald-500 text-sm">/committee_manifest.json</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-neutral-900 dark:text-white tracking-tighter uppercase">
                        Core <span className="text-neutral-300 dark:text-neutral-700">Team</span>
                    </h2>
                </div>
                <p className="text-neutral-500 dark:text-neutral-400 max-w-sm text-sm font-mono leading-relaxed text-right md:text-left">
          // A collective of developers, designers, and innovators building the future of our digital campus.
                </p>
            </div>

            {/* Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {teamMembers.map((member) => (
                    <Card key={member.id} member={member} />
                ))}
            </div>

        </section>
    );
};

export default DevTeamShowcase;