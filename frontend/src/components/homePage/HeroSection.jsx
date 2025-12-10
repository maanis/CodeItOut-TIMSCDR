import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { memo } from "react";
import { Spotlight } from '../ui/spotlight-new'

const HeroSection = memo(() => {
    const navigate = useNavigate();
    return (
        <section className="relative min-h-screen flex items-center dark:bg-neutral-950 justify-center overflow-hidden pt-32 pb-20">
            {/* Animated gradient background - will-change for GPU acceleration */}
            <div className="absolute inset-0 will-change-transform">
                <Spotlight />
            </div>

            <div className="absolute dark:hidden inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20 dark:from-purple-900/30 dark:via-background dark:to-blue-900/30 pointer-events-none" />

            {/* Animated glow orbs - optimized with will-change */}
            <div className="absolute max-sm:hidden top-1/4 left-[33%] w-72 h-72 bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl animate-pulse will-change-transform pointer-events-none" />
            <div className="absolute max-sm:hidden bottom-1/4 right-[33%] w-72 h-72 bg-secondary/20 dark:bg-secondary/20 rounded-full blur-3xl animate-pulse will-change-transform pointer-events-none" style={{ animationDelay: "1s" }} />

            <div className="container py-20 mx-auto px-6 relative z-10">
                <div className="text-center max-w-5xl mx-auto">
                    {/* Main heading */}
                    <div className="mb-8 relative z-50">
                        <h1 className="max-w-5xl bg-gradient-to-r from-foreground/60 via-foreground to-foreground/60 bg-clip-text text-center text-4xl font-semibold tracking-tighter text-transparent dark:from-muted-foreground/55 dark:via-foreground dark:to-muted-foreground/55 sm:text-5xl xl:text-7xl/none will-change-auto">
                            Built for the era of{" "}
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent dark:from-cyan-400 dark:via-purple-400 dark:to-pink-400">
                                AI-native development
                            </span>
                        </h1>

                        <p className="text-sm max-sm:mt-4 my-2 sm:text-lg md:text-lg text-muted-foreground max-w-3xl mx-auto">
                            Empowering the next generation of developers at TIMSCDR through innovation,
                            collaboration, and cutting-edge technology.
                        </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap items-center justify-center gap-4 mb-16 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                        <Button
                            onClick={() => navigate('/testLogin')}
                            size="lg"
                            className="bg-gradient-to-r from-primary via-secondary to-accent text-white hover:opacity-90 rounded-full px-5 py-6 max-sm:py-3 text-sm sm:text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 will-change-transform"
                        >
                            <Sparkles className="w-5 h-5 mr-2" />
                            Join the Committee
                        </Button>
                        <Button
                            size="lg"
                            variant="secondary"
                            className="bg-card hover:bg-card/80 text-card-foreground rounded-full px-10 py-6 max-sm:py-3 text-sm sm:text-lg font-semibold shadow-lg border border-border will-change-transform"
                        >
                            Learn More
                        </Button>
                    </div>

                    {/* Stats Cards - optimized with contain and will-change */}
                    <div
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto animate-fade-in"
                        style={{ animationDelay: "0.4s", contain: "layout" }}
                    >
                        {/* Card 1 */}
                        <div className="stat-card shadow-lg rounded-3xl p-8 border border-white/10 backdrop-blur-md will-change-auto">
                            <div className="text-5xl md:text-6xl font-bold dark:text-white text-primary mb-4">
                                4x
                            </div>
                            <div className="text-sm md:text-base text-muted-foreground dark:text-white/70 uppercase tracking-wider font-medium">
                                Faster Skill Development <br /> with AI-Powered Learning
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="stat-card shadow-lg rounded-3xl p-8 border border-white/10 backdrop-blur-md will-change-auto">
                            <div className="text-5xl md:text-6xl font-bold dark:text-white text-primary mb-4">
                                75%
                            </div>
                            <div className="text-sm md:text-base text-muted-foreground dark:text-white/70 uppercase tracking-wider font-medium">
                                Of Members <br /> Actively Contributing
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="stat-card shadow-lg rounded-3xl p-8 border border-white/10 backdrop-blur-md will-change-auto">
                            <div className="text-5xl md:text-6xl font-bold dark:text-white text-primary mb-4">
                                30%
                            </div>
                            <div className="text-sm md:text-base text-muted-foreground dark:text-white/70 uppercase tracking-wider font-medium">
                                Better Placement <br /> Success Rate
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
});

HeroSection.displayName = "HeroSection";

export default HeroSection;
