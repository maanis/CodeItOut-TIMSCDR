import { Code2, Database, Cloud, Cpu, Terminal, Boxes } from "lucide-react";

const LogoStrip = () => {
    const logos = [
        { icon: Code2, name: "React" },
        { icon: Database, name: "MongoDB" },
        { icon: Cloud, name: "Cloudflare" },
        { icon: Cpu, name: "Node.js" },
        { icon: Terminal, name: "Python" },
        { icon: Boxes, name: "Docker" },
    ];

    return (
        <section className="py-12 border-y border-white/5">
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-center gap-12 md:gap-16 flex-wrap opacity-40">
                    {logos.map((logo, i) => (
                        <div key={i} className="flex items-center gap-3 hover:opacity-100 transition-opacity">
                            <logo.icon className="w-6 h-6" />
                            <span className="text-sm font-medium">{logo.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LogoStrip;
