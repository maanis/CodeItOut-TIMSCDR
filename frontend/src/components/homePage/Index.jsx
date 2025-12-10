import { lazy, Suspense } from "react";
import Navigation from "./Navigation";
import HeroSection from "./HeroSection";
import SmoothScroll from "./SmoothScroll";

// Lazy load components that are below the fold
const OverviewSection = lazy(() => import("./OverviewSection"));
const LogoStrip = lazy(() => import("./LogoStrip"));
const FeaturesSection = lazy(() => import("./FeaturesSection"));
const ProcessSection = lazy(() => import("./ProcessSection"));
const LeaderboardSection = lazy(() => import("./LeaderboardSection"));
const TestimonialsSection = lazy(() => import("./TestimonialsSection"));
const CTASection = lazy(() => import("./CTASection"));
const Footer = lazy(() => import("./Footer"));

// Loading fallback component
const SectionFallback = () => (
    <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
    </div>
);

const Index = () => {
    return (
        <>
            {/* Main navigation - always loaded */}
            <Navigation />
            {/* <SmoothScroll> */}
            <div className="gradient-bg min-h-screen text-foreground">
                {/* Hero section - always loaded (above the fold) */}
                <div id="home">
                    <HeroSection />
                </div>

                {/* Lazy loaded sections below the fold */}
                <Suspense fallback={<SectionFallback />}>
                    <div id="overview">
                        <OverviewSection />
                    </div>
                </Suspense>

                <Suspense fallback={null}>
                    <LogoStrip />
                </Suspense>

                <Suspense fallback={<SectionFallback />}>
                    <div id="features">
                        <FeaturesSection />
                    </div>
                </Suspense>

                <Suspense fallback={<SectionFallback />}>
                    <div id="process">
                        <ProcessSection />
                    </div>
                </Suspense>

                <Suspense fallback={<SectionFallback />}>
                    <div id="leaderboard">
                        <LeaderboardSection />
                    </div>
                </Suspense>

                <Suspense fallback={<SectionFallback />}>
                    <div id="testimonials">
                        <TestimonialsSection />
                    </div>
                </Suspense>

                <Suspense fallback={<SectionFallback />}>
                    <div id="contact">
                        <CTASection />
                    </div>
                </Suspense>

                {/* <Suspense fallback={null}> */}
                <Footer />
                {/* </Suspense> */}
            </div>
            {/* </SmoothScroll> */}
        </>
    );
};

export default Index;
