import { cn } from "@/lib/utils";
import React from "react";

export function GridSmallBackgroundDemo() {
    return (
        <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden bg-white dark:bg-black">
            {/* Grid pattern */}
            <div
                className={cn(
                    "absolute inset-0",
                    "[background-size:20px_20px]",
                    "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
                    "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
                )}
            />

            {/* Gradient dots overlay */}
            <div className="absolute top-20 left-1/4 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
            <div className="absolute top-40 right-1/4 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-32 left-1/3 w-72 h-72 bg-green-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

            {/* Radial gradient overlay for faded effect */}
            <div
                className="absolute inset-0 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"
            />
        </div>
    );
}