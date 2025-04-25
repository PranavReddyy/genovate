import { cn } from "@/lib/utils";
import { motion } from "framer-motion";


export function BentoGrid({
    className,
    children,
}) {
    return (
        <div
            className={cn("grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-5 w-full max-w-7xl mx-auto px-4", className)}
        >
            {children}
        </div>
    );
}

export function BentoGridItem({
    className,
    title,
    description,
    header,
    icon,
    children,
    colSpan = "col-span-1 md:col-span-3 lg:col-span-4",
    rowSpan = "row-span-1",
    variant = "default",
}) {
    return (
        <div
            className={cn(
                "group/bento relative flex flex-col justify-between overflow-hidden rounded-xl border bg-black-900/5 p-4 backdrop-blur-md transition duration-200 dark:bg-black/20 dark:shadow-inner",
                colSpan,
                rowSpan,
                variant === "default" && "dark:bg-zinc-900 dark:border-white/[0.1] bg-white border border-neutral-200/80",
                variant === "transparent" && "bg-white/30 dark:bg-zinc-900/40 backdrop-blur-sm border border-white/20 dark:border-zinc-800/30",
                className
            )}
        >
            <div className={cn("transition duration-200", variant === "default" && "group-hover/bento:translate-x-1")}>
                {header && <div className="mb-4">{header}</div>}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {icon}
                        <div>
                            <h2 className={cn(
                                "font-semibold tracking-wide",
                                variant === "default" ? "text-neutral-800 dark:text-neutral-200" : "text-white"
                            )}>
                                {title}
                            </h2>
                            <p className={cn(
                                "text-xs tracking-tight",
                                variant === "default" ? "text-neutral-500 dark:text-neutral-400" : "text-white/70"
                            )}>
                                {description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-2 flex-grow">{children}</div>
        </div>
    );
}