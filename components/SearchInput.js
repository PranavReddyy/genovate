"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";

export function SearchInput({
    placeholder = "Search for a gene...",
    onChange,
    onSubmit,
    value: externalValue
}) {
    const [internalValue, setInternalValue] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const value = externalValue !== undefined ? externalValue : internalValue;
    const inputRef = useRef(null);

    const handleChange = (e) => {
        setInternalValue(e.target.value);
        if (onChange) onChange(e);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (value.trim() && onSubmit) {
            onSubmit(e);
        }
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            className="w-full max-w-xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div
                className={`flex items-center bg-white dark:bg-zinc-800 rounded-xl overflow-hidden shadow-sm transition-all duration-300 border ${isFocused
                    ? "border-blue-500/50 shadow-lg shadow-blue-500/10"
                    : "border-gray-200/70 dark:border-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600/50"
                    }`}
            >
                <div className="flex-1 relative">
                    <input
                        ref={inputRef}
                        type="text"
                        value={value}
                        onChange={handleChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder={placeholder}
                        className="w-full py-3.5 px-5 bg-transparent outline-none text-black dark:text-white font-mono text-sm"
                    />

                    {value.length > 0 && (
                        <motion.button
                            type="button"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 p-1 rounded-full"
                            onClick={() => {
                                setInternalValue("");
                                if (onChange) onChange({ target: { value: "" } });
                                inputRef.current?.focus();
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <path d="m15 9-6 6" />
                                <path d="m9 9 6 6" />
                            </svg>
                        </motion.button>
                    )}
                </div>

                <div className="p-1.5 pr-2">
                    <button
                        type="submit"
                        disabled={!value.trim()}
                        className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-green-500 text-white py-2.5 px-6 font-mono text-sm disabled:opacity-50 transition-all flex items-center justify-center group hover:shadow-md disabled:cursor-not-allowed"
                    >
                        <motion.div
                            className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"
                            whileTap={{ opacity: 0.15 }}
                        />
                        <span className="relative z-10 flex items-center gap-2">
                            <span>Search</span>
                            <motion.svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                initial={{ x: -3, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                            >
                                <path d="M5 12h14" />
                                <path d="m12 5 7 7-7 7" />
                            </motion.svg>
                        </span>
                    </button>
                </div>
            </div>
        </motion.form>
    );
}