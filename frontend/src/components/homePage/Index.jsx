import Navigation from "./Navigation";
import HeroSection from "./HeroSection";
import OverviewSection from "./OverviewSection";
import LogoStrip from "./LogoStrip";
import FeaturesSection from "./FeaturesSection";
import ProcessSection from "./ProcessSection";
import LeaderboardSection from "./LeaderboardSection";
import TestimonialsSection from "./TestimonialsSection";
import CTASection from "./CTASection";
import Footer from "./Footer";
import SmoothScroll from "./SmoothScroll";

const Index = () => {
    return (
        <>
            <Navigation />
            <SmoothScroll>
                <div className="gradient-bg min-h-screen text-foreground">
                    <div id="home">
                        <HeroSection />
                    </div>
                    <div id="overview">
                        <OverviewSection />
                    </div>
                    <LogoStrip />
                    <div id="features">
                        <FeaturesSection />
                    </div>
                    <div id="process">
                        <ProcessSection />
                    </div>
                    <div id="leaderboard">
                        <LeaderboardSection />
                    </div>
                    <div id="testimonials">
                        <TestimonialsSection />
                    </div>
                    <div id="contact">
                        <CTASection />
                    </div>
                    <Footer />
                </div>
            </SmoothScroll>
        </>
    );
};

export default Index;
