import { BentoGridItem } from "./BentoGrid";
import React from "react";

// Helper function to format JSON as pretty key-value pairs
function PrettyJson({ data }) {
    // If data is not an object or is null, just return it as a string
    if (!data || typeof data !== 'object') {
        return <span className="text-neutral-800 dark:text-neutral-200">{String(data)}</span>;
    }

    // If data is an array
    if (Array.isArray(data)) {
        return (
            <div className="space-y-2.5">
                {data.map((item, idx) => (
                    <div key={idx} className="bg-gray-50 dark:bg-zinc-800/50 rounded-lg p-3">
                        {typeof item === 'object' ? (
                            Object.entries(item).map(([key, value], i) => (
                                <div key={i} className="flex flex-wrap mb-1.5 last:mb-0">
                                    <span className="font-medium text-blue-600 dark:text-blue-400 min-w-[100px] mr-2">{key}:</span>
                                    <span className="text-neutral-800 dark:text-neutral-200 flex-1">
                                        {typeof value === 'string' && value.length > 60
                                            ? `${value.substring(0, 60)}...`
                                            : String(value)}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <span>{String(item)}</span>
                        )}
                    </div>
                ))}
            </div>
        );
    }

    // If data is an object
    return (
        <div className="space-y-2.5">
            {Object.entries(data).map(([key, value], index) => (
                <div key={index} className="mb-2.5 last:mb-0">
                    <div className="flex flex-wrap">
                        <span className="font-medium text-blue-600 dark:text-blue-400 min-w-[100px] mr-2">{key}:</span>
                        <span className="text-neutral-800 dark:text-neutral-200 flex-1">
                            {Array.isArray(value)
                                ? value.join(", ")
                                : typeof value === 'object' && value !== null
                                    ? JSON.stringify(value).length > 60
                                        ? JSON.stringify(value).substring(0, 60) + "..."
                                        : JSON.stringify(value)
                                    : typeof value === 'string' && value.length > 60
                                        ? `${value.substring(0, 60)}...`
                                        : String(value)}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function ResultCard({
    title,
    description,
    data,
    icon,
    isLoading = false,
    colSpan = "col-span-1 md:col-span-3 lg:col-span-4",
    rowSpan = "row-span-1",
    variant = "default"
}) {
    return (
        <BentoGridItem
            title={title}
            description={description}
            icon={
                <div className="p-2 w-fit rounded-full bg-gradient-to-r from-blue-600/10 via-purple-500/10 to-green-500/10 dark:bg-neutral-800">
                    {icon}
                </div>
            }
            header={
                <div className="flex justify-between items-start">
                    <span className="text-xs font-mono font-medium text-neutral-500 dark:text-neutral-400">
                        {isLoading ? "Loading..." : "Results"}
                    </span>
                    {data && !isLoading && (
                        <span className="text-xs font-mono bg-green-100 text-green-800 px-2 py-1 rounded-md dark:bg-green-900/50 dark:text-green-100">
                            Found
                        </span>
                    )}
                    {!data && !isLoading && (
                        <span className="text-xs font-mono bg-amber-100 text-amber-800 px-2 py-1 rounded-md dark:bg-amber-900/50 dark:text-amber-100">
                            No data
                        </span>
                    )}
                </div>
            }
            className="transition-all duration-300 font-roboto"
            colSpan={colSpan}
            rowSpan={rowSpan}
            variant={variant}
        >
            <div className="mt-4 text-sm">
                {isLoading ? (
                    <div className="animate-pulse space-y-2">
                        <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded-md w-3/4"></div>
                        <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded-md w-1/2"></div>
                        <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded-md w-5/6"></div>
                    </div>
                ) : (
                    <div className="text-xs leading-relaxed">
                        {data ? (
                            <div className="pt-1">
                                <PrettyJson data={data} />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-20 text-neutral-500 dark:text-neutral-400 bg-neutral-100/50 dark:bg-neutral-800/50 rounded-lg">
                                No data available
                            </div>
                        )}
                    </div>
                )}
            </div>
        </BentoGridItem>
    );
}