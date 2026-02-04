'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

interface ParallaxBackgroundProps {
    children: ReactNode;
    className?: string;
}

/**
 * A 3-layer parallax background that reacts to mouse movement.
 * - Layer 0 (Void): Mesh gradient, moves slowest
 * - Layer 1 (Glass Plane): Mid-speed
 * - Layer 2 (Content): Foreground, most responsive
 */
export default function ParallaxBackground({ children, className = '' }: ParallaxBackgroundProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Normalize to -1..1
            const x = (e.clientX - rect.left - centerX) / centerX;
            const y = (e.clientY - rect.top - centerY) / centerY;

            setMousePosition({ x, y });
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('mousemove', handleMouseMove);
        }

        return () => {
            if (container) {
                container.removeEventListener('mousemove', handleMouseMove);
            }
        };
    }, []);

    // Different parallax speeds for each layer
    const voidOffset = {
        x: mousePosition.x * 15, // Slowest
        y: mousePosition.y * 15,
    };

    const glassOffset = {
        x: mousePosition.x * 8, // Mid
        y: mousePosition.y * 8,
    };

    return (
        <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
            {/* Layer 0: The Void - Animated Mesh Gradient */}
            <div
                className="absolute inset-0 pointer-events-none transition-transform duration-300 ease-out"
                style={{
                    transform: `translate3d(${voidOffset.x}px, ${voidOffset.y}px, 0)`,
                }}
            >
                {/* Multiple radial gradients for mesh effect */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: `
                            radial-gradient(ellipse 80% 50% at 20% 30%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
                            radial-gradient(ellipse 60% 60% at 80% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
                            radial-gradient(ellipse 70% 50% at 70% 80%, rgba(236, 72, 153, 0.12) 0%, transparent 50%),
                            radial-gradient(ellipse 50% 70% at 10% 90%, rgba(16, 185, 129, 0.12) 0%, transparent 50%),
                            radial-gradient(ellipse 100% 100% at 50% 50%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.2) 100%)
                        `,
                        backgroundSize: '200% 200%',
                        animation: 'gradientShift 20s ease infinite',
                    }}
                />
                {/* Floating orbs */}
                <div className="absolute w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl animate-float-slow" style={{ top: '10%', left: '10%' }} />
                <div className="absolute w-80 h-80 rounded-full bg-purple-500/10 blur-3xl animate-float-medium" style={{ top: '60%', right: '10%' }} />
                <div className="absolute w-64 h-64 rounded-full bg-pink-500/10 blur-3xl animate-float-fast" style={{ bottom: '10%', left: '30%' }} />
            </div>

            {/* Layer 1: Glass Plane effect (optional shimmer) */}
            <div
                className="absolute inset-0 pointer-events-none transition-transform duration-200 ease-out"
                style={{
                    transform: `translate3d(${glassOffset.x}px, ${glassOffset.y}px, 0)`,
                }}
            >
                {/* Subtle noise texture overlay */}
                <div className="absolute inset-0 opacity-[0.015] bg-noise" />
            </div>

            {/* Layer 2: Content (most responsive, handled by children) */}
            <div className="relative z-10">
                {children}
            </div>

            {/* Keyframes for animations */}
            <style jsx>{`
                @keyframes gradientShift {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0px) translateX(0px); }
                    50% { transform: translateY(-30px) translateX(20px); }
                }
                @keyframes float-medium {
                    0%, 100% { transform: translateY(0px) translateX(0px); }
                    50% { transform: translateY(25px) translateX(-15px); }
                }
                @keyframes float-fast {
                    0%, 100% { transform: translateY(0px) translateX(0px); }
                    50% { transform: translateY(-20px) translateX(10px); }
                }
                .animate-float-slow {
                    animation: float-slow 15s ease-in-out infinite;
                }
                .animate-float-medium {
                    animation: float-medium 12s ease-in-out infinite;
                }
                .animate-float-fast {
                    animation: float-fast 10s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
