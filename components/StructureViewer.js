"use client";

import { useState, useEffect, useRef } from "react";
import { BentoGridItem } from "./BentoGrid";
import { motion } from "framer-motion";

export default function StructureViewer({
    title,
    description,
    data,
    icon,
    isLoading = false
}) {
    const containerRef = useRef(null);
    const [structureData, setStructureData] = useState(null);
    const [error, setError] = useState(null);
    const [isRendering, setIsRendering] = useState(false);
    const [viewerType, setViewerType] = useState("cartoon"); // cartoon, surface, ball
    const [isRotating, setIsRotating] = useState(true);
    const [activeColor, setActiveColor] = useState("chainid"); // chainid, residue, rainbow
    const [viewerKey, setViewerKey] = useState(Date.now());
    const [currentModel, setCurrentModel] = useState(0);
    const [modelCount, setModelCount] = useState(1);

    useEffect(() => {
        if (isLoading || !data) return;

        const processStructureData = async () => {
            try {
                setIsRendering(true);

                // If we have a PDB ID
                if (data.pdbId) {
                    setStructureData({
                        pdbId: data.pdbId,
                        source: data.source || "PDB",
                        info: data.info || `${data.pdbId} - Protein Data Bank`
                    });
                } else {
                    // If no structure data available
                    setError("No structural data available");
                }
            } catch (err) {
                console.error("Error processing structure:", err);
                setError("Failed to load 3D structure");
            } finally {
                setTimeout(() => setIsRendering(false), 800); // Give a moment for viewer to load
            }
        };

        processStructureData();
    }, [data, isLoading]);

    // Update the viewerKey when any visualization option changes to force iframe reload
    useEffect(() => {
        setViewerKey(Date.now());
    }, [viewerType, isRotating, activeColor, currentModel]);

    // Function to handle model change
    const handleModelChange = (newModel) => {
        if (newModel >= 0 && newModel < modelCount) {
            setCurrentModel(newModel);
        }
    };

    // Receive message from iframe about model count
    useEffect(() => {
        const handleMessage = (event) => {
            // Only accept messages from our iframe
            if (event.data && event.data.type === "modelCount") {
                setModelCount(event.data.count);
                // Reset to model 0 if current is out of bounds
                if (currentModel >= event.data.count) {
                    setCurrentModel(0);
                }
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [currentModel]);

    // Determine if we have data to show
    const hasStructureData = !isLoading && structureData && structureData.pdbId;

    return (
        <BentoGridItem
            title={title}
            description={description}
            icon={
                <div className="p-2 w-fit rounded-full bg-gradient-to-r from-blue-600/30 to-green-500/30">
                    {icon}
                </div>
            }
            colSpan="col-span-1 md:col-span-6 lg:col-span-8"
            rowSpan="row-span-2"
            variant="transparent"
            className="min-h-[400px]"
            header={
                <div className="flex justify-between items-start">
                    <span className="text-xs font-mono font-medium text-white/70">
                        {isLoading ? "Loading..." : isRendering ? "Rendering..." : "Interactive Model"}
                    </span>
                    {hasStructureData && !isLoading && (
                        <span className="text-xs font-mono bg-green-400/20 text-green-100 px-2 py-1 rounded-md">
                            {structureData.source === "AlphaFold" ? "AlphaFold" : "PDB"}
                        </span>
                    )}
                    {!hasStructureData && !isLoading && (
                        <span className="text-xs font-mono bg-amber-400/20 text-amber-100 px-2 py-1 rounded-md">
                            No model
                        </span>
                    )}
                </div>
            }
        >
            <div className="mt-4 h-full relative rounded-lg overflow-hidden pb-10">
                {(isLoading || isRendering) ? (
                    <div className="animate-pulse h-full bg-gray-800/30 rounded-lg flex items-center justify-center">
                        <motion.div
                            animate={{ rotateY: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="w-16 h-16 border-4 border-t-blue-400 border-r-transparent border-b-green-400 border-l-transparent rounded-full"
                        ></motion.div>
                    </div>
                ) : error ? (
                    <div className="w-full h-full bg-gradient-to-br from-red-900/20 via-purple-900/20 to-blue-900/20 rounded-lg flex items-center justify-center">
                        <div className="text-red-400 text-center p-8">
                            {error}
                        </div>
                    </div>
                ) : hasStructureData ? (
                    <div className="w-full h-full relative rounded-lg overflow-hidden">
                        <CustomMolViewer
                            key={viewerKey}
                            pdbId={structureData.pdbId}
                            viewerType={viewerType}
                            isRotating={isRotating}
                            colorScheme={activeColor}
                            modelIndex={currentModel}
                        />

                        {/* Viewer Controls Panel */}
                        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                            {/* Style selector */}
                            <div className="flex gap-1 bg-black/30 backdrop-blur-md p-1 rounded-lg">
                                <button
                                    onClick={() => setViewerType("cartoon")}
                                    className={`px-2 py-1 rounded text-xs font-mono ${viewerType === "cartoon" ? "bg-blue-500/70 text-white" : "text-white/60 hover:text-white"}`}
                                >
                                    Cartoon
                                </button>
                                <button
                                    onClick={() => setViewerType("surface")}
                                    className={`px-2 py-1 rounded text-xs font-mono ${viewerType === "surface" ? "bg-blue-500/70 text-white" : "text-white/60 hover:text-white"}`}
                                >
                                    Surface
                                </button>
                                <button
                                    onClick={() => setViewerType("ball")}
                                    className={`px-2 py-1 rounded text-xs font-mono ${viewerType === "ball" ? "bg-blue-500/70 text-white" : "text-white/60 hover:text-white"}`}
                                >
                                    Ball&Stick
                                </button>
                            </div>

                            {/* Color scheme selector */}
                            <div className="flex gap-1 bg-black/30 backdrop-blur-md p-1 rounded-lg">
                                <button
                                    onClick={() => setActiveColor("chainid")}
                                    className={`px-2 py-1 rounded text-xs font-mono ${activeColor === "chainid" ? "bg-blue-500/70 text-white" : "text-white/60 hover:text-white"}`}
                                >
                                    Chain
                                </button>
                                <button
                                    onClick={() => setActiveColor("residue")}
                                    className={`px-2 py-1 rounded text-xs font-mono ${activeColor === "residue" ? "bg-blue-500/70 text-white" : "text-white/60 hover:text-white"}`}
                                >
                                    Residue
                                </button>
                                <button
                                    onClick={() => setActiveColor("rainbow")}
                                    className={`px-2 py-1 rounded text-xs font-mono ${activeColor === "rainbow" ? "bg-blue-500/70 text-white" : "text-white/60 hover:text-white"}`}
                                >
                                    Rainbow
                                </button>
                            </div>

                            {/* Animation control */}
                            <div className="flex gap-1 bg-black/30 backdrop-blur-md p-1 rounded-lg">
                                <button
                                    onClick={() => setIsRotating(!isRotating)}
                                    className={`px-2 py-1 rounded text-xs font-mono ${isRotating ? "bg-green-500/70 text-white" : "bg-gray-600/50 text-white/60 hover:text-white"}`}
                                >
                                    {isRotating ? "Rotating" : "Paused"}
                                </button>
                            </div>

                            {/* Model selection - only show if multiple models available */}
                            {modelCount > 1 && (
                                <div className="flex flex-col gap-1 bg-black/30 backdrop-blur-md p-2 rounded-lg">
                                    <span className="text-xs font-mono text-white/80">Model: {currentModel + 1}/{modelCount}</span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleModelChange(currentModel - 1)}
                                            disabled={currentModel === 0}
                                            className="px-2 py-1 rounded text-xs font-mono bg-white/10 text-white/70 hover:text-white disabled:opacity-30"
                                        >
                                            ←
                                        </button>
                                        <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500"
                                                style={{ width: `${((currentModel + 1) / modelCount) * 100}%` }}
                                            ></div>
                                        </div>
                                        <button
                                            onClick={() => handleModelChange(currentModel + 1)}
                                            disabled={currentModel === modelCount - 1}
                                            className="px-2 py-1 rounded text-xs font-mono bg-white/10 text-white/70 hover:text-white disabled:opacity-30"
                                        >
                                            →
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-green-900/20 rounded-lg flex items-center justify-center">
                        <div className="text-white/50 text-center p-8">
                            No structural data available for this gene
                        </div>
                    </div>
                )}

                {hasStructureData && structureData.info && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/30 backdrop-blur-sm p-3 text-xs text-white/80">
                        <div className="flex items-center justify-between">
                            <div>{structureData.info}</div>
                            <div className="text-xs opacity-70">{structureData.pdbId}</div>
                        </div>
                    </div>
                )}
            </div>
        </BentoGridItem>
    );
}

// Custom molecular viewer with tailored styling using 3DMol.js correctly
function CustomMolViewer({ pdbId, viewerType, isRotating, colorScheme, modelIndex = 0 }) {
    // Create a properly formed HTML document that sets up 3DMol properly
    const getHTMLContent = () => {
        const viewerStyle = viewerType === "cartoon" ? "cartoon" :
            viewerType === "surface" ? "surface" :
                "ball";

        const colorType = colorScheme === "chainid" ? "chain" :
            colorScheme === "residue" ? "residue" :
                "spectrum";

        // This creates a properly formatted HTML document with inline 3DMol.js code
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>3DMol.js Viewer</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://3dmol.org/build/3Dmol-min.js"></script>
    <style>
        body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; background: transparent; }
        #container { position: relative; width: 100%; height: 100%; }
        #mol-viewer { width: 100%; height: 100%; position: absolute; top: 0; left: 0; }
        .error-message { color: red; padding: 10px; text-align: center; }
        .loading-message { color: white; opacity: 0.7; padding: 10px; text-align: center; }
    </style>
</head>
<body>
    <div id="container">
        <div id="mol-viewer">
            <div class="loading-message">Loading structure...</div>
        </div>
    </div>
    
    <script>
        $(document).ready(function() {
            console.log("3DMol viewer initializing for ${pdbId}");
            console.log("Style: ${viewerStyle}, Color: ${colorType}, Rotating: ${isRotating}, Model: ${modelIndex}");
            
            let viewer = $3Dmol.createViewer($("#mol-viewer"), {
                backgroundColor: "transparent",
                antialias: true,
                outline: true
            });
            
            let pdbUri = "https://files.rcsb.org/view/${pdbId}.pdb";
            
            jQuery.ajax(pdbUri, { 
                success: function(data) {
                    console.log("PDB data loaded successfully");
                    
                    // Add the PDB data as a model
                    viewer.addModel(data, "pdb");
                    
                    // Determine how many models are in the file
                    let modelCount = viewer.getModel().getNumFrames();
                    console.log("Models found:", modelCount);
                    
                    // Send message to parent about model count
                    window.parent.postMessage({
                        type: "modelCount",
                        count: modelCount
                    }, "*");
                    
                    // Set the active model/frame
                    if (modelCount > 1) {
                        console.log("Setting active model to:", ${modelIndex});
                        viewer.getModel().setFrame(${modelIndex});
                    }
                    
                    // Apply the selected style
                    if ("${viewerStyle}" === "cartoon") {
                        console.log("Applying cartoon style");
                        // First clear all styles
                        viewer.setStyle({}, {});
                        
                        // Add cartoon representation
                        viewer.setStyle({}, {cartoon: {thickness: 0.2, arrows: true}});
                        
                        // Apply coloring after setting style
                        if ("${colorType}" === "chain") {
                            viewer.setStyle({}, {cartoon: {colorscheme: "chainid"}});
                        } 
                        else if ("${colorType}" === "residue") {
                            viewer.setStyle({}, {cartoon: {colorscheme: "residueindex"}});
                        }
                        else if ("${colorType}" === "spectrum") {
                            viewer.setStyle({}, {cartoon: {color: "spectrum"}});
                        }
                        
                        // Add hetero atoms as sticks
                        viewer.setStyle({hetflag: true}, {
                            stick: {
                                radius: 0.15,
                                colorscheme: "element", 
                                singleBonds: false
                            }
                        });
                        
                        // Add hydrogens if present
                        viewer.setStyle({elem: "H"}, {sphere: {radius: 0.1, colorscheme: "element"}});
                    } 
                    else if ("${viewerStyle}" === "surface") {
                        console.log("Applying surface style");
                        
                        // First clear previous styles
                        viewer.setStyle({}, {});
                        
                        // Add cartoon for structure reference
                        viewer.setStyle({}, {cartoon: {opacity: 0.3, thickness: 0.1, color: "white"}});
                        
                        // Map color scheme to the 3DMol acceptable format
                        let colorSchemeToUse = "${colorType}" === "chain" ? "chainid" : 
                                              "${colorType}" === "residue" ? "residueindex" : 
                                              "spectral";
                                              
                        // Create transparent molecular surface
                        viewer.addSurface($3Dmol.SurfaceType.VDW, {
                            opacity: 0.8,
                            colorscheme: colorSchemeToUse
                        });
                        
                        // Show hetero atoms clearly
                        viewer.setStyle({hetflag: true}, {
                            stick: {radius: 0.15, colorscheme: "element"}, 
                            sphere: {radius: 0.3, colorscheme: "element"}
                        });
                    }
                    else if ("${viewerStyle}" === "ball") {
                        console.log("Applying ball and stick style");
                        
                        // First clear previous styles
                        viewer.setStyle({}, {});
                        
                        // Standard atoms - smaller, industry-standard representation
                        viewer.setStyle({}, {
                            stick: {radius: 0.15, colorscheme: "${colorType === 'chain' ? 'chainid' : colorType === 'residue' ? 'residueindex' : 'element'}"}, 
                            sphere: {scale: 0.3, colorscheme: "${colorType === 'chain' ? 'chainid' : colorType === 'residue' ? 'residueindex' : 'element'}"}
                        });
                        
                        // Separate style for hetero atoms to highlight them
                        viewer.setStyle({hetflag: true}, {
                            stick: {radius: 0.15, colorscheme: "element"}, 
                            sphere: {scale: 0.4, colorscheme: "element"}
                        });
                    }
                    
                    // Center and zoom to fit the molecule
                    viewer.zoomTo();
                    
                    // Initial render
                    viewer.render();
                    
                    // Set up rotation if enabled
                    if (${isRotating}) {
                        console.log("Setting up rotation");
                        let rotationSpeed = 0.25; // Industry standard slower rotation
                        
                        function rotateMolecule() {
                            viewer.rotate(rotationSpeed, {y: 1});
                            viewer.render();
                            requestAnimationFrame(rotateMolecule);
                        }
                        requestAnimationFrame(rotateMolecule);
                    }
                    
                    console.log("3D rendering complete");
                    
                    // Remove loading message
                    document.querySelector('.loading-message').remove();
                },
                error: function(hdr, status, err) {
                    console.error("Failed to load PDB file:", err);
                    document.getElementById("mol-viewer").innerHTML = 
                        '<div class="error-message">Failed to load structure. Error: ' + (err || status) + '</div>';
                }
            });
        });
    </script>
</body>
</html>
        `;
    };

    // Create a data URL from the HTML content
    const htmlContent = getHTMLContent();
    const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`;

    return (
        <div className="w-full h-full bg-gradient-to-br from-blue-900/10 to-purple-900/10">
            <iframe
                src={dataUrl}
                title={`Protein Structure ${pdbId}`}
                className="w-full h-full border-0"
                style={{
                    borderRadius: "8px",
                    boxShadow: "inset 0 0 20px rgba(0,0,0,0.15)",
                }}
                sandbox="allow-scripts allow-same-origin"
                loading="eager"
            />
        </div>
    );
}