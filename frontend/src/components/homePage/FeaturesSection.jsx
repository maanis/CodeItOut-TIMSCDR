import { Calendar, Layers, Rocket, Users } from "lucide-react";

const FeaturesSection = () => {
    const features = [
        {
            icon: Users,
            title: "Collaborative Coding",
            description: "Work together on exciting projects with fellow developers. Share knowledge and grow together.",
        },
        {
            icon: Calendar,
            title: "Tech Workshops",
            description: "Regular hands-on workshops covering the latest technologies and industry best practices.",
        },
        {
            icon: Rocket,
            title: "Open Source Projects",
            description: "Contribute to meaningful open source projects and build your portfolio while learning.",
        },
        {
            icon: Layers,
            title: "AI & ML Bootcamps",
            description: "Deep dive into artificial intelligence and machine learning with expert-led bootcamps.",
        },
    ];

    return (
        <section className="py-20 relative" id="features">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">Platform Features</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Unlock the full potential of tech learning with our comprehensive platform designed to simplify your coding journey.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {features.map((feature, i) => (
                        <div
                            key={i}
                            className="glass-card rounded-3xl p-8 hover:neon-border transition-all duration-300 animate-scale-in group"
                            style={{ animationDelay: `${i * 0.1}s` }}
                        >
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <feature.icon className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
