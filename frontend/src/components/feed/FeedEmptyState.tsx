import { motion } from 'framer-motion';

interface FeedEmptyStateProps {
    onCreatePost: () => void;
}

export default function FeedEmptyState({ onCreatePost }: FeedEmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-lg border border-slate-200 text-center"
        >
            <div className="bg-slate-50 p-4 rounded-full mb-4">
                <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            </div>

            <h3 className="text-xl font-serif font-bold text-slate-800 mb-2">The campus is quiet... too quiet.</h3>
            <p className="text-slate-500 max-w-sm mb-8 leading-relaxed">
                There are no discussions yet. Why not break the silence and share something with your peers?
            </p>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onCreatePost}
                className="px-6 py-2.5 bg-blue-700 text-white font-medium rounded-md shadow-sm hover:bg-blue-800 transition-colors flex items-center gap-2"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Start the Discussion
            </motion.button>
        </motion.div>
    );
}
