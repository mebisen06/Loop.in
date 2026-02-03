'use client';

import DeveloperCard from '@/components/team/DeveloperCard';
import { motion } from 'framer-motion';

const TEAM_MEMBERS = [
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
        linkedinUrl: "https://www.linkedin.com/in/pranshu-samadhiya-415052380?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
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

export default function DevelopersPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <motion.div
                className="text-center mb-16"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4 font-serif">
                    Meet the Minds
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    The passionate team of developers and mentors who brought Loop.in to life.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {TEAM_MEMBERS.map((member, index) => (
                    <motion.div
                        key={member.name}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                        <DeveloperCard {...member} />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
