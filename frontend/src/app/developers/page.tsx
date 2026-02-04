'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import Image from 'next/image';

interface TeamMember {
    name: string;
    role: string;
    imageSrc: string;
    githubUrl: string;
    linkedinUrl: string;
}

const TEAM_MEMBERS: TeamMember[] = [
    {
        name: "Yogesh Sanodiya",
        role: "Mentor",
        imageSrc: "/team/member1.jpg",
        githubUrl: "https://github.com/yogeshsanodiya59-web",
        linkedinUrl: "https://www.linkedin.com/in/yogesh-sanodiya-8a2816298/"
    },
    {
        name: "Pranshu Samadhiya",
        role: "Team Member",
        imageSrc: "/team/member2.jpg",
        githubUrl: "https://github.com/pranshu1899",
        linkedinUrl: "https://www.linkedin.com/in/pranshu-samadhiya-415052380"
    },
    {
        name: "Meet Bisen",
        role: "Team Member",
        imageSrc: "/team/member3.jpg",
        githubUrl: "https://github.com/mebisen06",
        linkedinUrl: "https://www.linkedin.com/in/meetbisen/"
    },
    {
        name: "Suhani Choudhary",
        role: "Team Member",
        imageSrc: "/team/member4.jpg",
        githubUrl: "https://github.com/suhaniamitchoudhary26-stack",
        linkedinUrl: "https://www.linkedin.com/in/suhani-choudhary-a66230379/"
    }
];

// Spring transition config for buttery smooth 60fps animations
const springTransition = {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
    mass: 0.8,
};

export default function DevelopersPage() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        setActiveIndex((prev) => {
            let next = prev + newDirection;
            if (next < 0) next = TEAM_MEMBERS.length - 1;
            if (next >= TEAM_MEMBERS.length) next = 0;
            return next;
        });
    };

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const threshold = 50;
        if (info.offset.x > threshold) {
            paginate(-1);
        } else if (info.offset.x < -threshold) {
            paginate(1);
        }
    };

    // 3D Cylinder rotation calculation
    const getCardStyle = (index: number) => {
        const totalCards = TEAM_MEMBERS.length;
        const anglePerCard = 360 / totalCards;
        const relativeIndex = index - activeIndex;
        const rotation = relativeIndex * anglePerCard;

        // Cylindrical transform
        const radius = 280;
        const translateZ = Math.cos((rotation * Math.PI) / 180) * radius;
        const translateX = Math.sin((rotation * Math.PI) / 180) * radius;
        const opacity = Math.cos((rotation * Math.PI) / 180);
        const scale = 0.7 + (opacity * 0.3);

        return {
            transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotation}deg)`,
            opacity: Math.max(0.3, opacity),
            scale,
            zIndex: Math.round(translateZ + 300),
        };
    };

    const currentMember = TEAM_MEMBERS[activeIndex];

    return (
        <div className="min-h-screen overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #fdfcfb 0%, #f8f9fa 25%, #e8f4fd 50%, #fef9f3 75%, #fdfcfb 100%)' }}>
            {/* Soft Pastel Gradient Background - Light & Airy */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Dreamy Soft Orbs */}
                <div className="absolute top-[5%] left-[10%] w-[600px] h-[600px] bg-gradient-to-br from-sky-200/40 via-blue-100/30 to-transparent rounded-full blur-[150px] animate-float-slow" />
                <div className="absolute bottom-[5%] right-[5%] w-[700px] h-[700px] bg-gradient-to-br from-orange-100/40 via-amber-50/30 to-transparent rounded-full blur-[150px] animate-float-slow-reverse" />
                <div className="absolute top-[30%] right-[20%] w-[500px] h-[500px] bg-gradient-to-br from-rose-100/30 via-pink-50/20 to-transparent rounded-full blur-[130px] animate-pulse-slow" />
                <div className="absolute bottom-[30%] left-[25%] w-[450px] h-[450px] bg-gradient-to-br from-cyan-100/25 via-teal-50/20 to-transparent rounded-full blur-[120px] animate-float-gentle" />

                {/* Subtle Light Rays */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,255,255,0.9),transparent)]" />

                {/* Soft Noise Texture */}
                <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" /%3E%3C/filter%3E%3Crect width="100%" height="100%" filter="url(%23noise)"%3E%3C/rect%3E%3C/svg%3E")' }} />
            </div>

            {/* Header Typography with Multi-Layer Text Shadow */}
            <motion.div
                className="relative z-10 text-center pt-16 pb-8"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
                <motion.p
                    className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 text-sm font-bold uppercase tracking-[0.4em] mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    The Team Behind
                </motion.p>

                {/* Loop.in with Premium Multi-Layer Shadow */}
                <h1 className="premium-heading-light text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 tracking-tighter">
                    Loop.in
                </h1>

                <motion.p
                    className="text-slate-500 text-lg mt-4 max-w-md mx-auto font-light"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    Swipe to explore our passionate team
                </motion.p>
            </motion.div>

            {/* 3D Carousel Container */}
            <div
                ref={containerRef}
                className="relative h-[500px] flex items-center justify-center"
                style={{ perspective: '1200px', perspectiveOrigin: '50% 50%' }}
            >
                <motion.div
                    className="relative w-full max-w-5xl h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.1}
                    onDragEnd={handleDragEnd}
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {TEAM_MEMBERS.map((member, index) => {
                        const style = getCardStyle(index);
                        const isActive = index === activeIndex;

                        return (
                            <motion.div
                                key={member.name}
                                className="absolute w-64 h-80 rounded-[2rem] overflow-hidden will-change-transform"
                                animate={{
                                    x: style.transform.includes('translateX')
                                        ? parseFloat(style.transform.match(/translateX\(([-\d.]+)px\)/)?.[1] || '0')
                                        : 0,
                                    rotateY: parseFloat(style.transform.match(/rotateY\(([-\d.]+)deg\)/)?.[1] || '0'),
                                    scale: style.scale,
                                    opacity: style.opacity,
                                    zIndex: style.zIndex,
                                }}
                                transition={springTransition}
                                style={{
                                    transformStyle: 'preserve-3d',
                                    backfaceVisibility: 'hidden',
                                }}
                                onClick={() => {
                                    if (!isActive) {
                                        const diff = index - activeIndex;
                                        paginate(diff);
                                    }
                                }}
                            >
                                {/* Pulsing Glow Effect for Active Card */}
                                <div
                                    className={`absolute -inset-1 rounded-[2.25rem] ${isActive ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
                                    style={{
                                        background: 'linear-gradient(135deg, #38bdf8, #6366f1, #a855f7, #6366f1, #38bdf8)',
                                        backgroundSize: '300% 300%',
                                        animation: isActive ? 'pulse-glow 3s ease-in-out infinite' : 'none',
                                        filter: 'blur(8px)',
                                    }}
                                />

                                {/* Card Border Gradient */}
                                <div
                                    className={`absolute inset-0 rounded-[2rem] ${isActive ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
                                    style={{
                                        background: 'linear-gradient(135deg, #38bdf8, #6366f1, #a855f7)',
                                        padding: '3px',
                                    }}
                                />

                                {/* Card Content */}
                                <div className="absolute inset-[3px] rounded-[calc(2rem-3px)] overflow-hidden bg-slate-900">
                                    <Image
                                        src={member.imageSrc}
                                        alt={member.name}
                                        fill
                                        className={`object-cover transition-all duration-700 ${isActive ? 'grayscale-0 scale-105' : 'grayscale'}`}
                                        priority
                                    />

                                    {/* Cylindrical Glass Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />

                                    {/* Reflection Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-50" />
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>

            {/* Active Member Info - Outside Image */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeIndex}
                    className="relative z-20 text-center mt-8 px-4"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                    {/* Name with Multi-Layer Gradient & Shadow */}
                    <motion.h2
                        className="premium-name-light text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 via-indigo-700 to-violet-700 mb-3 tracking-tight"
                        layoutId="memberName"
                    >
                        {currentMember.name}
                    </motion.h2>

                    {/* Metallic Shimmer Role Badge */}
                    <motion.div
                        className="inline-block"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ ...springTransition, delay: 0.15 }}
                    >
                        <span className="metallic-badge px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-[0.3em] inline-block">
                            {currentMember.role}
                        </span>
                    </motion.div>

                    {/* Social Links with Spring Scale */}
                    <motion.div
                        className="flex items-center justify-center gap-5 mt-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <motion.a
                            href={currentMember.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-icon-light p-4 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200 text-slate-700 shadow-lg"
                            whileHover={{ scale: 1.2, rotate: 5 }}
                            whileTap={{ scale: 0.95 }}
                            transition={springTransition}
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                        </motion.a>
                        <motion.a
                            href={currentMember.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-icon-light p-4 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 backdrop-blur-xl border border-sky-400 text-white shadow-lg"
                            whileHover={{ scale: 1.2, rotate: -5 }}
                            whileTap={{ scale: 0.95 }}
                            transition={springTransition}
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                            </svg>
                        </motion.a>
                    </motion.div>
                </motion.div>
            </AnimatePresence>

            {/* Magnetic Navigation Dots */}
            <div className="flex items-center justify-center gap-4 mt-10 pb-12">
                {TEAM_MEMBERS.map((_, index) => (
                    <motion.button
                        key={index}
                        onClick={() => {
                            const diff = index - activeIndex;
                            if (diff !== 0) paginate(diff);
                        }}
                        className="magnetic-dot-light relative rounded-full shadow-md"
                        animate={{
                            width: index === activeIndex ? 40 : 12,
                            height: 12,
                            background: index === activeIndex
                                ? 'linear-gradient(90deg, #6366f1, #8b5cf6, #a855f7)'
                                : 'rgba(100,116,139,0.3)',
                        }}
                        whileHover={{
                            scale: 1.3,
                            background: index === activeIndex
                                ? 'linear-gradient(90deg, #6366f1, #8b5cf6, #a855f7)'
                                : 'rgba(100,116,139,0.5)',
                        }}
                        transition={springTransition}
                    />
                ))}
            </div>

            {/* Swipe Hint */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 text-slate-500 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
            >
                <motion.svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ x: [-5, 0, -5] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </motion.svg>
                <span className="font-light tracking-wide">Swipe or drag to explore</span>
                <motion.svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ x: [5, 0, 5] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </motion.svg>
            </motion.div>

            {/* Premium CSS Animations & Effects - Light Theme */}
            <style jsx global>{`
                /* Floating Orbs - Gentle */
                @keyframes float-slow {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -40px) scale(1.05); }
                    66% { transform: translate(-20px, 30px) scale(0.95); }
                }
                
                @keyframes float-slow-reverse {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(-40px, 30px) scale(0.95); }
                    66% { transform: translate(25px, -35px) scale(1.05); }
                }

                @keyframes float-gentle {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(15px, -20px) scale(1.02); }
                }

                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(1.08); }
                }

                .animate-float-slow {
                    animation: float-slow 25s ease-in-out infinite;
                }
                
                .animate-float-slow-reverse {
                    animation: float-slow-reverse 30s ease-in-out infinite;
                }

                .animate-float-gentle {
                    animation: float-gentle 20s ease-in-out infinite;
                }

                .animate-pulse-slow {
                    animation: pulse-slow 10s ease-in-out infinite;
                }

                /* Pulsing Card Glow */
                @keyframes pulse-glow {
                    0%, 100% { 
                        background-position: 0% 50%;
                        opacity: 0.8;
                    }
                    50% { 
                        background-position: 100% 50%;
                        opacity: 1;
                    }
                }

                /* Premium Heading - Light Theme */
                .premium-heading-light {
                    text-shadow: 
                        0 2px 10px rgba(99, 102, 241, 0.3),
                        0 4px 20px rgba(139, 92, 246, 0.2),
                        0 8px 40px rgba(168, 85, 247, 0.15);
                    filter: drop-shadow(0 4px 15px rgba(99, 102, 241, 0.2));
                }

                /* Premium Name - Light Theme */
                .premium-name-light {
                    text-shadow: 
                        0 2px 8px rgba(99, 102, 241, 0.2),
                        0 4px 15px rgba(139, 92, 246, 0.15);
                }

                /* Metallic Shimmer Badge - Light Theme */
                .metallic-badge {
                    background: linear-gradient(
                        110deg,
                        rgba(99, 102, 241, 0.15) 0%,
                        rgba(139, 92, 246, 0.25) 20%,
                        rgba(168, 85, 247, 0.35) 40%,
                        rgba(255, 255, 255, 0.8) 50%,
                        rgba(168, 85, 247, 0.35) 60%,
                        rgba(139, 92, 246, 0.25) 80%,
                        rgba(99, 102, 241, 0.15) 100%
                    );
                    background-size: 200% 100%;
                    animation: shimmer 3s ease-in-out infinite;
                    border: 1px solid rgba(139, 92, 246, 0.4);
                    color: rgba(88, 28, 135, 0.9);
                    box-shadow: 
                        inset 0 1px 0 rgba(255, 255, 255, 0.6),
                        0 4px 15px rgba(139, 92, 246, 0.25),
                        0 2px 4px rgba(0, 0, 0, 0.05);
                }

                @keyframes shimmer {
                    0% { background-position: 100% 0; }
                    100% { background-position: -100% 0; }
                }

                /* Social Icon Hover Glow - Light Theme */
                .social-icon-light {
                    transition: box-shadow 0.3s ease, transform 0.3s ease;
                }
                
                .social-icon-light:hover {
                    box-shadow: 
                        0 8px 25px rgba(99, 102, 241, 0.25),
                        0 4px 10px rgba(0, 0, 0, 0.1);
                }

                /* Magnetic Dot - Light Theme */
                .magnetic-dot-light {
                    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.2);
                    transition: box-shadow 0.3s ease;
                }
                
                .magnetic-dot-light:hover {
                    box-shadow: 0 4px 15px rgba(139, 92, 246, 0.35);
                }

                /* GPU Acceleration for 60fps */
                .will-change-transform {
                    will-change: transform, opacity;
                    transform: translateZ(0);
                }
            `}</style>
        </div>
    );
}
