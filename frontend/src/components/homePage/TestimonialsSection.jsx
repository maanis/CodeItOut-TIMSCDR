import { Star } from "lucide-react";

const TestimonialsSection = () => {
    const testimonials = [
        {
            name: "Rahul Sharma",
            role: "Final Year CS",
            date: "Mar 15, 2025",
            rating: 5,
            text: "TIMSCDR Coding Committee transformed my coding journey. The workshops and hackathons gave me real-world experience that landed me my dream internship. The community here is incredibly supportive!",
            avatar: "RS"
        },
        {
            name: "Priya Desai",
            role: "Third Year IT",
            date: "Feb 8, 2025",
            rating: 5,
            text: "Joining this committee was the best decision of my college life. The mentorship and hands-on projects helped me build a strong portfolio. I've learned more here than in any classroom.",
            avatar: "PD"
        },
        {
            name: "Arjun Patel",
            role: "Second Year CS",
            date: "Jan 20, 2025",
            rating: 5,
            text: "The AI & ML bootcamps are exceptional. The instructors break down complex concepts beautifully. I went from zero knowledge to building my own ML models in just a few months!",
            avatar: "AP"
        },
        {
            name: "Sneha Reddy",
            role: "Final Year IT",
            date: "Dec 12, 2024",
            rating: 5,
            text: "What I love most is the collaborative environment. Everyone helps each other grow. The open source projects gave me practical GitHub experience that impressed recruiters during placements.",
            avatar: "SR"
        }
    ];

    return (
        <section className="py-20 relative">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">What our members say</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Real experiences from students who've grown their skills and careers with TIMSCDR Coding Committee
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                    {testimonials.map((testimonial, i) => (
                        <div
                            key={i}
                            className="glass-card rounded-3xl p-8 animate-scale-in hover:neon-border transition-all"
                            style={{ animationDelay: `${i * 0.1}s` }}
                        >
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-sm">
                                    {testimonial.avatar}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold">{testimonial.name}</h4>
                                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                </div>
                                <div className="flex gap-0.5">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                            </div>

                            <p className="text-sm leading-relaxed mb-4 text-muted-foreground">
                                {testimonial.text}
                            </p>

                            <div className="text-xs text-muted-foreground">
                                {testimonial.date}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
