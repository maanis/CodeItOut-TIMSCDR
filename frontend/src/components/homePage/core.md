<!-- {import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Instagram, ArrowUpRight, Terminal, ShieldCheck, Mail } from 'lucide-react';

// --- Dummy Data ---
const mentorData = {
name: "Prof. Anamika",
role: "Faculty_Mentor",
designation: "Assistant Professor, CS Dept",
image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2788&auto=format&fit=crop", // Professional placeholder
quote: "// Guiding the next generation of system architects. access_level: ADMIN",
socials: { linkedin: "#", mail: "mailto:anamika@college.edu" }
};

const teamMembers = [
{
id: 1,
name: "Aarav Patel",
role: "System_Architect",
image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2787&auto=format&fit=crop",
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

// --- NEW MENTOR CARD COMPONENT ---
const MentorCard = ({ mentor }) => {
return (
<motion.div
initial={{ opacity: 0, y: -20 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
className="relative w-full max-w-4xl mx-auto mb-20 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all duration-500 overflow-hidden group" >
{/_ Striped Background Pattern for Admin _/}
<div className="absolute inset-0 opacity-[0.03] pointer-events-none"
style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px' }}
/>

        <div className="flex flex-col md:flex-row h-full">
            {/* Image Section */}
            <div className="w-full md:w-2/5 relative h-64 md:h-auto overflow-hidden border-b md:border-b-0 md:border-r border-neutral-200 dark:border-neutral-800">
                <div className="absolute top-4 left-4 z-20 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 tracking-widest uppercase flex items-center gap-1">
                    <ShieldCheck size={12} /> Root_Admin
                </div>
                <img
                    src={mentor.image}
                    alt={mentor.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
                {/* Horizontal Scanline */}
                <div className="absolute inset-0 bg-emerald-500/10 h-1 w-full top-0 group-hover:top-[100%] transition-all duration-[2s] ease-linear opacity-0 group-hover:opacity-100" />
            </div>

            {/* Content Section */}
            <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col justify-center relative">
                <div className="mb-4">
                    <div className="flex items-center gap-2 mb-1">
                         <div className="h-[1px] w-8 bg-emerald-500" />
                         <span className="text-xs font-mono text-emerald-600 dark:text-emerald-500 uppercase tracking-widest">Faculty Mentor</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white uppercase tracking-tight">
                        {mentor.name}
                    </h2>
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium mt-1">
                        {mentor.designation}
                    </p>
                </div>

                <div className="bg-neutral-50 dark:bg-neutral-950 border-l-2 border-emerald-500 p-4 mb-6">
                    <p className="font-mono text-xs md:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                        "{mentor.quote}"
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold uppercase tracking-wider hover:bg-emerald-600 dark:hover:bg-emerald-400 transition-colors">
                        <Mail size={14} /> Contact Faculty
                    </button>
                    <SocialLink href={mentor.socials.linkedin} icon={<Linkedin size={20} />} />
                </div>

                {/* Decorative Background Tech */}
                <div className="absolute bottom-4 right-4 text-[10px] font-mono text-neutral-300 dark:text-neutral-800 select-none">
                    SYS_ID: FAC-01
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
className="group relative w-full h-[420px] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors duration-300 overflow-hidden" >
<div className="absolute inset-0 bg-[size:24px_24px] opacity-30 dark:opacity-20
        bg-[linear-gradient(to_right,#d4d4d4_1px,transparent_1px),linear-gradient(to_bottom,#d4d4d4_1px,transparent_1px)]
        dark:bg-[linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)]"
      />

      <div className="absolute top-0 left-0 w-full h-10 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-4 z-20 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
          <div className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
        </div>
        <div className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500">ID: {`DEV-00${member.id}`}</div>
      </div>

      <div className="absolute inset-0 pt-10 pb-20 px-4 flex items-center justify-center overflow-hidden">
        <div className="relative w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500 ease-out">
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover object-center opacity-90 dark:opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/20 dark:via-emerald-500/10 to-transparent translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000 ease-in-out z-10 pointer-events-none" />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 p-5 z-20">
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

      <div className="absolute top-10 right-0 w-3 h-3 border-t border-r border-emerald-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-emerald-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>

);
};

const DevTeamShowcase = () => {
return (
<section className="min-h-screen w-full bg-neutral-50 dark:bg-neutral-950 py-20 px-4 md:px-8 transition-colors duration-300">

      {/* Main Header */}
      <div className="max-w-7xl mx-auto mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-200 dark:border-neutral-800 pb-8">
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
          // Architects, designers, and engineers building the future.
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Mentor Section - Placed prominently above the grid */}
        <div className="mb-8">
            <h3 className="text-sm font-mono text-neutral-400 mb-6 uppercase tracking-widest pl-1 border-l-2 border-emerald-500">
                System Administrator
            </h3>
            <MentorCard mentor={mentorData} />
        </div>

        {/* Student Grid */}
        <div className="mb-8">
            <h3 className="text-sm font-mono text-neutral-400 mb-6 uppercase tracking-widest pl-1 border-l-2 border-neutral-500">
                Active Nodes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {teamMembers.map((member) => (
                    <Card key={member.id} member={member} />
                ))}
            </div>
        </div>
      </div>

    </section>

);
};

export default DevTeamShowcase;} -->

<!-- {
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

const CoreTeam = () => {
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

export default CoreTeam;
} -->
