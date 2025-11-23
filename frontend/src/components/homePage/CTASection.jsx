import { Button } from "@/components/ui/button";

const CTASection = () => {
    return (
        <section className="py-20 relative">
            <div className="container mx-auto px-6">
                <div className="glass-card rounded-3xl p-12 md:p-16 text-center max-w-4xl mx-auto neon-border">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Join the TIMSCDR<br />Coding Committee
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        A community of innovators, creators, and future-ready developers at Thakur Institute of Management Studies, Career Development & Research.
                    </p>
                    <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-12 text-lg shadow-lg shadow-primary/30">
                        Get Started
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
