import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const HeroSection = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-20">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20 dark:from-purple-900/30 dark:via-background dark:to-blue-900/30" />

            {/* Animated glow orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 dark:bg-primary/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 dark:bg-secondary/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-5xl mx-auto">
                    {/* Main heading */}
                    <div className="mb-8 animate-fade-in">
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
                            Built for the era of{" "}
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent dark:from-cyan-400 dark:via-purple-400 dark:to-pink-400">
                                AI-native development
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                            Empowering the next generation of developers at TIMSCDR through innovation, collaboration, and cutting-edge technology.
                        </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap items-center justify-center gap-4 mb-16 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                        <Button
                            size="lg"
                            className="bg-gradient-to-r from-primary via-secondary to-accent text-white hover:opacity-90 rounded-full px-10 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                        >
                            <Sparkles className="w-5 h-5 mr-2" />
                            Join the Committee
                        </Button>
                        <Button
                            size="lg"
                            variant="secondary"
                            className="bg-card hover:bg-card/80 text-card-foreground rounded-full px-10 py-6 text-lg font-semibold shadow-lg border border-border"
                        >
                            Learn More
                        </Button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto animate-fade-in" style={{ animationDelay: "0.4s" }}>
                        <div className="glass-card rounded-3xl p-8 border border-border/50 hover:border-primary/50 transition-all duration-300 group">
                            <div className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                                4x
                            </div>
                            <div className="text-sm md:text-base text-muted-foreground uppercase tracking-wider font-medium">
                                Faster Skill Development<br />with AI-Powered Learning
                            </div>
                        </div>

                        <div className="glass-card rounded-3xl p-8 border border-border/50 hover:border-secondary/50 transition-all duration-300 group">
                            <div className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-br from-secondary to-primary bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                                75%
                            </div>
                            <div className="text-sm md:text-base text-muted-foreground uppercase tracking-wider font-medium">
                                Of Members<br />Actively Contributing
                            </div>
                        </div>

                        <div className="glass-card rounded-3xl p-8 border border-border/50 hover:border-accent/50 transition-all duration-300 group">
                            <div className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-br from-accent to-secondary bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                                30%
                            </div>
                            <div className="text-sm md:text-base text-muted-foreground uppercase tracking-wider font-medium">
                                Better Placement<br />Success Rate
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
