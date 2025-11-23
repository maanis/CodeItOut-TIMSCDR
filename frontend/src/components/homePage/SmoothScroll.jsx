import React, { useEffect, useRef } from "react";
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.css";

const SmoothScroll = ({ children }) => {
    const scrollRef = useRef(null);
    const locomotiveScrollRef = useRef(null);

    useEffect(() => {
        if (!scrollRef.current) return;

        // Initialize Locomotive Scroll
        locomotiveScrollRef.current = new LocomotiveScroll({
            el: scrollRef.current,
            smooth: true,
            smoothMobile: false,
            resetNativeScroll: true,
            multiplier: 1,
            lerp: 0.1,
            smartphone: { smooth: false },
            tablet: { smooth: false },
        });

        // Emit custom event for navbar
        locomotiveScrollRef.current.on("scroll", (args) => {
            const event = new CustomEvent("locomotiveScroll", { detail: args });
            document.dispatchEvent(event);
        });

        // Update scroll on window resize
        const handleResize = () => {
            locomotiveScrollRef.current?.update();
        };
        window.addEventListener("resize", handleResize);

        // Handle smooth scroll for anchor links
        const handleAnchorClick = (e) => {
            const target = e.target;
            const anchor = target.closest && target.closest('a[href^="#"]');
            if (anchor) {
                e.preventDefault();
                const href = anchor.getAttribute("href");
                if (href && href !== "#") {
                    const targetElement = document.querySelector(href);
                    if (targetElement && locomotiveScrollRef.current) {
                        locomotiveScrollRef.current.scrollTo(targetElement, {
                            duration: 1000,
                            offset: -100,
                        });
                    }
                }
            }
        };
        document.addEventListener("click", handleAnchorClick);

        // Initial update
        setTimeout(() => {
            locomotiveScrollRef.current?.update();
        }, 100);

        return () => {
            window.removeEventListener("resize", handleResize);
            document.removeEventListener("click", handleAnchorClick);
            locomotiveScrollRef.current?.destroy();
        };
    }, []);

    return (
        <div data-scroll-container ref={scrollRef}>
            {children}
        </div>
    );
};

export default SmoothScroll;
