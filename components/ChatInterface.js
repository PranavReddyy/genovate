"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H7.5z" clipRule="evenodd" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
    </svg>
);

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
    </svg>
);

const AIIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M16.5 7.5h-9v9h9v-9z" />
        <path fillRule="evenodd" d="M8.25 2.25A.75.75 0 019 3v.75h2.25V3a.75.75 0 011.5 0v.75H15V3a.75.75 0 011.5 0v.75h.75a3 3 0 013 3v.75H21A.75.75 0 0121 9h-.75v2.25H21a.75.75 0 010 1.5h-.75V15H21a.75.75 0 010 1.5h-.75v.75a3 3 0 01-3 3h-.75V21a.75.75 0 01-1.5 0v-.75h-2.25V21a.75.75 0 01-1.5 0v-.75H9V21a.75.75 0 01-1.5 0v-.75h-.75a3 3 0 01-3-3v-.75H3A.75.75 0 013 15h.75v-2.25H3a.75.75 0 010-1.5h.75V9H3a.75.75 0 010-1.5h.75v-.75a3 3 0 013-3h.75V3a.75.75 0 01.75-.75zM6 6.75A.75.75 0 016.75 6h10.5a.75.75 0 01.75.75v10.5a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V6.75z" clipRule="evenodd" />
    </svg>
);

export default function ChatInterface({
    topic,
    followupQuery,
    setFollowupQuery,
    followupResults,
    loadingFollowup,
    handleFollowUpSubmit,
    chatInputRef,
    onClose,
    chatContainerRef
}) {
    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (chatContainerRef?.current) {
            // Scroll immediately without animation for instant feedback
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;

            // Then do a smooth scroll as a fallback
            setTimeout(() => {
                chatContainerRef?.current?.scrollTo({
                    top: chatContainerRef.current.scrollHeight,
                    behavior: "smooth"
                });
            }, 50);
        }
    }, [followupResults, loadingFollowup]);

    useEffect(() => {
        // Focus input on mount
        if (chatInputRef?.current) {
            chatInputRef.current.focus();
        }

        // Ensure chat is scrolled to bottom with multiple attempts
        const scrollToBottom = () => {
            if (chatContainerRef?.current) {
                // Immediate scroll
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
        };

        // Execute scroll multiple times to ensure it works
        scrollToBottom();
        const timers = [
            setTimeout(scrollToBottom, 10),
            setTimeout(scrollToBottom, 50),
            setTimeout(scrollToBottom, 100),
            setTimeout(scrollToBottom, 300)
        ];

        return () => {
            timers.forEach(timer => clearTimeout(timer));
        };
    }, []);

    const messageVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, transition: { duration: 0.2 } }
    };

    const bubbleVariants = {
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 500, damping: 30 } },
        tap: { scale: 0.98 }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.1,
                duration: 0.3
            }
        },
        exit: {
            opacity: 0,
            y: 10,
            transition: {
                duration: 0.2
            }
        }
    };

    return (
        <motion.div
            className="w-full h-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="rounded-xl overflow-hidden backdrop-blur-md bg-gradient-to-br from-black/90 to-blue-900/10 border border-white/10 h-full flex flex-col shadow-2xl">
                {/* Chat header with enhanced styling */}
                <div className="px-5 py-4 border-b border-white/10 bg-gradient-to-r from-blue-900/40 via-purple-900/20 to-black/40 flex justify-between items-center">
                    <motion.h3
                        className="font-semibold text-white/90 flex items-center gap-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                    >
                        <span className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-1.5 flex items-center justify-center">
                            <ChatIcon />
                        </span>
                        <span>
                            Exploring <span className="text-blue-400 font-mono">{topic}</span>
                        </span>
                    </motion.h3>
                </div>

                {/* Chat messages with enhanced animations */}
                <motion.div
                    ref={chatContainerRef}
                    className="flex-1 overflow-y-auto p-4 md:p-5 flex flex-col gap-6 custom-scrollbar"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Welcome message */}
                    <motion.div
                        className="flex items-start gap-3"
                        variants={messageVariants}
                    >
                        <motion.div
                            className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600/50 to-blue-600/50 flex items-center justify-center text-white shadow-lg"
                            variants={bubbleVariants}
                            initial="initial"
                            animate="animate"
                        >
                            <AIIcon />
                        </motion.div>
                        <motion.div
                            className="bg-gradient-to-r from-blue-900/10 to-purple-900/10 backdrop-blur-sm p-4 rounded-lg rounded-tl-none border border-white/5 shadow-lg max-w-[90%]"
                            variants={bubbleVariants}
                            initial="initial"
                            animate="animate"
                        >
                            <p className="text-white/90 text-sm">
                                I&apos;ve analyzed information about <span className="font-semibold text-blue-400">{topic}</span>.
                                What specific aspects would you like to explore? You can ask about structure, function,
                                disease associations, drug interactions, or genetic variants.
                            </p>
                        </motion.div>
                    </motion.div>

                    {/* Follow-up conversations */}
                    <AnimatePresence>
                        {followupResults.map((item, index) => {
                            // Important console logging to debug the message structure
                            console.log(`Rendering message ${index}:`, item);

                            return (
                                <motion.div
                                    key={index}
                                    className="flex flex-col gap-4"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {/* User message */}
                                    {item.type === "user" && (
                                        <motion.div
                                            className="flex items-start gap-3 justify-end"
                                            variants={messageVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                        >
                                            <motion.div
                                                className="bg-gradient-to-r from-blue-600/20 to-blue-400/20 backdrop-blur-sm rounded-lg rounded-br-none p-3 border border-blue-500/20 shadow-lg max-w-[80%]"
                                                variants={bubbleVariants}
                                                initial="initial"
                                                animate="animate"
                                            >
                                                <p className="text-white/90 text-sm">{item.query}</p>
                                            </motion.div>
                                            <motion.div
                                                className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600/30 to-blue-400/30 flex items-center justify-center text-white shadow-lg"
                                                variants={bubbleVariants}
                                                initial="initial"
                                                animate="animate"
                                            >
                                                <UserIcon />
                                            </motion.div>
                                        </motion.div>
                                    )}

                                    {/* AI response */}
                                    {item.type === "ai" && (
                                        <motion.div
                                            className="flex items-start gap-3"
                                            variants={messageVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                        >
                                            <motion.div
                                                className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600/50 to-blue-600/50 flex items-center justify-center text-white shadow-lg"
                                                variants={bubbleVariants}
                                                initial="initial"
                                                animate="animate"
                                            >
                                                <AIIcon />
                                            </motion.div>
                                            <motion.div
                                                className={`${item.error ? 'bg-gradient-to-r from-red-900/20 to-red-700/10 border-red-500/30' : 'bg-gradient-to-r from-blue-900/10 to-purple-900/10 border-white/5'} backdrop-blur-sm rounded-lg rounded-tl-none p-4 flex-1 border shadow-lg max-w-[90%]`}
                                                variants={bubbleVariants}
                                                initial="initial"
                                                animate="animate"
                                            >
                                                <p className="text-white/90 text-sm whitespace-pre-wrap">{item.response}</p>
                                            </motion.div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                    {/* Loading indicator for follow-up */}
                    <AnimatePresence>
                        {loadingFollowup && (
                            <motion.div
                                className="flex items-start gap-3"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600/50 to-blue-600/50 flex items-center justify-center text-white shadow-lg">
                                    <AIIcon />
                                </div>
                                <div className="bg-gradient-to-r from-blue-900/10 to-purple-900/10 backdrop-blur-sm rounded-lg rounded-tl-none p-4 border border-white/10 shadow-lg">
                                    <div className="flex items-center gap-2">
                                        <motion.div
                                            className="w-2 h-2 rounded-full bg-blue-400"
                                            animate={{
                                                scale: [0.5, 1, 0.5],
                                                opacity: [0.5, 1, 0.5]
                                            }}
                                            transition={{
                                                repeat: Infinity,
                                                duration: 1.5,
                                                delay: 0
                                            }}
                                        />
                                        <motion.div
                                            className="w-2 h-2 rounded-full bg-purple-400"
                                            animate={{
                                                scale: [0.5, 1, 0.5],
                                                opacity: [0.5, 1, 0.5]
                                            }}
                                            transition={{
                                                repeat: Infinity,
                                                duration: 1.5,
                                                delay: 0.2
                                            }}
                                        />
                                        <motion.div
                                            className="w-2 h-2 rounded-full bg-blue-400"
                                            animate={{
                                                scale: [0.5, 1, 0.5],
                                                opacity: [0.5, 1, 0.5]
                                            }}
                                            transition={{
                                                repeat: Infinity,
                                                duration: 1.5,
                                                delay: 0.4
                                            }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Chat input with enhanced design */}
                <div className="p-4 border-t border-white/10 bg-black/50 backdrop-blur-lg">
                    <form onSubmit={handleFollowUpSubmit} className="flex gap-2">
                        <motion.input
                            ref={chatInputRef}
                            type="text"
                            value={followupQuery}
                            onChange={(e) => setFollowupQuery(e.target.value)}
                            placeholder={`Ask anything about ${topic}...`}
                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-transparent transition-all shadow-inner"
                            initial={{ opacity: 0.8, y: 0 }} // Changed from y:10 to y:0 for immediate visibility
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }} // Faster transition
                            spellCheck={false}
                            autoComplete="off"
                        />
                        <motion.button
                            type="submit"
                            disabled={loadingFollowup || !followupQuery.trim()}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-3 rounded-lg disabled:opacity-30 transition-all shadow-md flex items-center justify-center"
                            whileHover={{ scale: 1.05, boxShadow: "0 0 8px rgba(120, 120, 255, 0.5)" }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4, type: "spring", stiffness: 500, damping: 30 }}
                        >
                            <SendIcon />
                        </motion.button>
                    </form>
                </div>
            </div>
        </motion.div>
    );
}