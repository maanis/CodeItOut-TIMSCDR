import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Instagram, ArrowUpRight, Terminal, ShieldCheck, Mail, Cpu } from 'lucide-react';

// --- Dummy Data ---
const mentorData = {
    name: "Prof. Anamika",
    role: "Faculty Mentor",
    designation: "Assistant Professor, CS Dept",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2788&auto=format&fit=crop",
    socials: { linkedin: "#", mail: "mailto:anamika@college.edu" }
};

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

const SocialLink = ({ href, icon }) => (
    <a
        href={href}
        className="text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:scale-110 transition-all duration-200"
    >
        {icon}
    </a>
);

// --- COMPACT MENTOR BAR ---
const MentorBar = ({ mentor }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative w-full mb-12 group"
        >
            {/* The Container */}
            <div className="flex flex-col md:flex-row md:items-center justify-between bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 rounded-lg relative overflow-hidden transition-all hover:border-emerald-500/30">

                {/* Background Tech GFX */}
                <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-neutral-100 dark:from-neutral-800/30 to-transparent pointer-events-none" />

                <div className="flex items-center gap-5 z-10">
                    {/* Avatar with Ring */}
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full p-[2px] border-2 border-emerald-500/30 group-hover:border-emerald-500 transition-colors">
                            <img
                                src={mentor.image}
                                alt={mentor.name}
                                className="w-full h-full rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                            />
                        </div>
                        {/* Admin Badge */}
                        <div className="absolute -bottom-1 -right-1 bg-neutral-900 text-emerald-500 border border-neutral-700 p-1 rounded-full">
                            <ShieldCheck size={12} fill="currentColor" className="text-emerald-900 dark:text-emerald-950" />
                        </div>
                    </div>

                    {/* Text Info */}
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-neutral-900 dark:text-white uppercase tracking-tight">
                                {mentor.name}
                            </h3>
                            <span className="hidden md:inline-flex px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-500 border border-emerald-200 dark:border-emerald-500/20">
                                ROOT_ADMIN
                            </span>
                        </div>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
                            {mentor.designation}
                        </p>
                        <div className="md:hidden mt-1 inline-flex px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-500 border border-emerald-200 dark:border-emerald-500/20">
                            ROOT_ADMIN
                        </div>
                    </div>
                </div>

                {/* Actions / Right Side */}
                <div className="mt-4 md:mt-0 flex items-center gap-6 z-10 pl-2 md:pl-0 border-l-2 md:border-l-0 border-emerald-500 md:border-transparent">
                    <div className="hidden md:block text-right">
                        <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">System Status</div>
                        <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2 justify-end">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            MONITORING ACTIVE
                        </div>
                    </div>

                    <div className="h-8 w-[1px] bg-neutral-200 dark:bg-neutral-800 hidden md:block" />

                    <div className="flex items-center gap-3">
                        <a href={mentor.socials.mail} className="p-2 text-neutral-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-all">
                            <Mail size={18} />
                        </a>
                        <a href={mentor.socials.linkedin} className="p-2 text-neutral-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-all">
                            <Linkedin size={18} />
                        </a>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const Card = ({ member }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative w-full h-[400px] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors duration-300 overflow-hidden"
        >
            <div className="absolute inset-0 bg-[size:24px_24px] opacity-30 dark:opacity-20 
        bg-[linear-gradient(to_right,#d4d4d4_1px,transparent_1px),linear-gradient(to_bottom,#d4d4d4_1px,transparent_1px)] 
        dark:bg-[linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)]"
            />

            {/* Top Bar */}
            <div className="absolute top-0 left-0 w-full h-8 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-3 z-20 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm">
                <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                    <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                </div>
                <div className="text-[9px] font-mono text-neutral-400 dark:text-neutral-500">ID: {`DEV-0${member.id}`}</div>
            </div>

            {/* Image Area */}
            <div className="absolute inset-0 pt-8 pb-16 px-3 flex items-center justify-center overflow-hidden">
                <div className="relative w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500 ease-out">
                    <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover object-top opacity-90 dark:opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    />
                    {/* Scanline */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/20 dark:via-emerald-500/10 to-transparent translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000 ease-in-out z-10 pointer-events-none" />
                </div>
            </div>

            {/* Info Panel */}
            <div className="absolute bottom-0 left-0 w-full bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 p-4 z-20">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-tight">
                            {member.name}
                        </h3>
                        <p className="text-emerald-600 dark:text-emerald-500 text-xs font-mono mt-0.5">
                            {`> ${member.role}`}
                        </p>
                    </div>
                    <StatusDot status={member.status} />
                </div>

                {/* Socials - Slide Up */}
                <div className="h-0 group-hover:h-10 overflow-hidden transition-all duration-300 ease-out">
                    <div className="flex items-center gap-3 pt-2 border-t border-neutral-200 dark:border-neutral-900 mt-2">
                        <SocialLink href={member.socials.github} icon={<Github size={16} />} />
                        <SocialLink href={member.socials.linkedin} icon={<Linkedin size={16} />} />
                        <SocialLink href={member.socials.instagram} icon={<Instagram size={16} />} />
                        <div className="flex-grow" />
                        <a href="#" className="text-[10px] text-neutral-500 hover:text-emerald-600 dark:hover:text-white flex items-center gap-1 transition-colors">
                            PORTFOLIO <ArrowUpRight size={10} />
                        </a>
                    </div>
                </div>
            </div>

            {/* Corner Accents */}
            <div className="absolute top-8 right-0 w-2 h-2 border-t border-r border-emerald-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-emerald-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.div>
    );
};

const CoreTeam = () => {
    return (
        <section className="min-h-screen w-full bg-neutral-50 dark:bg-neutral-950 py-20 px-4 md:px-8 transition-colors duration-300">

            {/* Main Header */}
            <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-200 dark:border-neutral-800 pb-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Cpu size={20} className="text-emerald-600 dark:text-emerald-500" />
                        <span className="font-mono text-emerald-600 dark:text-emerald-500 text-sm">/system_architecture/core</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-neutral-900 dark:text-white tracking-tighter uppercase">
                        Committee <span className="text-neutral-300 dark:text-neutral-700">Mainframe</span>
                    </h2>
                </div>
                <p className="text-neutral-500 dark:text-neutral-400 max-w-xs text-xs font-mono leading-relaxed text-right md:text-left">
          // Initializing Protocol: TEAM_DISPLAY.<br />
          // Status: ALL SYSTEMS OPERATIONAL.
                </p>
            </div>

            <div className="max-w-7xl mx-auto">

                {/* New Compact Mentor Bar */}
                <MentorBar mentor={mentorData} />

                {/* Student Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {teamMembers.map((member) => (
                        <Card key={member.id} member={member} />
                    ))}
                </div>
            </div>

        </section>
    );
};

export default CoreTeam;