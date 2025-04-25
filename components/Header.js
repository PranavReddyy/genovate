import React from "react";
import { motion } from "framer-motion";

export default function Header({ compact = false }) {
    return (
        <motion.header
            className={`w-full ${compact ? "py-4" : "py-2 md:py-2"} px-4 md:px-8 flex flex-col items-center transition-all duration-500`}
            layout
        >
            <motion.h1
                className={`${compact ? "text-3xl md:text-4xl" : "text-5xl md:text-6xl"} font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-500 to-green-500 bg-clip-text text-transparent font-mono transition-all duration-500`}
                layout
            >
                Genovate
            </motion.h1>
            {!compact && (
                <motion.p
                    className="mt-4 text-neutral-600 dark:text-neutral-300 text-center max-w-md font-mono text-sm md:text-base"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Search for any human gene or protein to discover insights across multiple biological domains
                </motion.p>
            )}
        </motion.header>
    );
}