import { useEffect, useState, useRef } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

const CustomCursor = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [variant, setVariant] = useState("default");
    const [isMobile, setIsMobile] = useState(false);
    const cursorRef = useRef(null);

    const cursorX = useMotionValue(0);
    const cursorY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const checkMobile = () => {
            const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            const isSmallScreen = window.innerWidth < 768;
            setIsMobile(isTouchDevice || isSmallScreen);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        if (isMobile) return;

        const handleMouseMove = (e) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
            setIsVisible(true);
        };

        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseEnter = () => setIsVisible(true);

        const handleMouseOver = (e) => {
            const target = e.target;

            if (
                target.tagName === "BUTTON" ||
                target.tagName === "A" ||
                target.closest("button") ||
                target.closest("a") ||
                target.closest("[data-cursor='hover']")
            ) {
                setVariant("hover");
                return;
            }

            const section = target.closest("[data-cursor-section]");
            if (section) {
                const sectionType = section.getAttribute("data-cursor-section");
                setVariant(sectionType || "default");
                return;
            }

            setVariant("default");
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseover", handleMouseOver);
        document.addEventListener("mouseleave", handleMouseLeave);
        document.addEventListener("mouseenter", handleMouseEnter);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseover", handleMouseOver);
            document.removeEventListener("mouseleave", handleMouseLeave);
            document.removeEventListener("mouseenter", handleMouseEnter);
        };
    }, [isMobile, cursorX, cursorY]);

    if (isMobile) return null;

    const variants = {
        default: {
            width: 12,
            height: 12,
            backgroundColor: "hsl(var(--primary))",
            border: "none",
            boxShadow: "none",
        },
        hover: {
            width: 48,
            height: 48,
            backgroundColor: "transparent",
            border: "2px solid hsl(var(--primary))",
            boxShadow: "0 0 20px hsl(var(--primary) / 0.3)",
        },
        glow: {
            width: 24,
            height: 24,
            backgroundColor: "hsl(var(--primary) / 0.3)",
            border: "none",
            boxShadow: "0 0 30px hsl(var(--primary) / 0.6), 0 0 60px hsl(var(--primary) / 0.3)",
        },
        ring: {
            width: 32,
            height: 32,
            backgroundColor: "transparent",
            border: "2px solid hsl(var(--accent))",
            boxShadow: "0 0 15px hsl(var(--accent) / 0.4)",
        },
    };

    return (
        <>
            <style>{`
        * { cursor: none !important; }
        @media (max-width: 767px) {
          * { cursor: auto !important; }
        }
      `}</style>
            <motion.div
                ref={cursorRef}
                className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full mix-blend-difference"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                animate={{
                    ...variants[variant],
                    opacity: isVisible ? 1 : 0,
                }}
                transition={{
                    type: "spring",
                    damping: 20,
                    stiffness: 300,
                    opacity: { duration: 0.2 },
                }}
            />
            {variant === "hover" && (
                <motion.div
                    className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full bg-primary"
                    style={{
                        x: cursorXSpring,
                        y: cursorYSpring,
                        translateX: "-50%",
                        translateY: "-50%",
                    }}
                    initial={{ width: 0, height: 0, opacity: 0 }}
                    animate={{ width: 6, height: 6, opacity: isVisible ? 1 : 0 }}
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                />
            )}
        </>
    );
};

export default CustomCursor;
