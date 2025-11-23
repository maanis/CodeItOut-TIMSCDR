import { ChevronRight } from "lucide-react";
// import developerChar from "@/assets/developer-character.png";

const ProcessSection = () => {
    const steps = [
        { title: "Join & Get Started", description: "Sign up and become part of our coding community" },
        { title: "Participate in Events", description: "Attend workshops, hackathons, and coding challenges" },
        { title: "Build Projects", description: "Create real-world projects with mentorship support" },
        { title: "Explore and Customize", description: "Dive deeper into specialized tech domains" },
    ];

    return (
        <section className="py-20 relative">
            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                    <div className="glass-card rounded-3xl p-8 lg:p-12 animate-scale-in">
                        <img
                            src='/dev.png'
                            alt="Developer Character"
                            className="w-full max-w-md mx-auto"
                        />
                    </div>

                    <div className="animate-fade-in">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            Simplified Process,<br />
                            Outstanding Results.
                        </h2>
                        <p className="text-muted-foreground mb-8 leading-relaxed">
                            At TIMSCDR Coding Committee, we believe in making tech education accessible and rewarding. Our streamlined approach ensures every member can grow.
                        </p>

                        <div className="space-y-4">
                            {steps.map((step, i) => (
                                <div
                                    key={i}
                                    className="glass-card rounded-2xl p-4 flex items-center justify-between hover:neon-border transition-all group cursor-pointer"
                                >
                                    <div>
                                        <h3 className="font-semibold mb-1">{step.title}</h3>
                                        <p className="text-sm text-muted-foreground">{step.description}</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProcessSection;
