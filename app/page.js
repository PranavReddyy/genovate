"use client";

import { useState, useEffect, useRef } from "react";
import { BentoGrid } from "@/components/BentoGrid";
import { GridSmallBackgroundDemo } from "@/components/Background";
import { SearchInput } from "@/components/SearchInput";
import { MultiStepLoader } from "@/components/Loader";
import Header from "@/components/Header";
import ResultCard from "@/components/ResultCard";
import StructureViewer from "@/components/StructureViewer";
import ChatInterface from "@/components/ChatInterface";
import { motion, AnimatePresence } from "framer-motion";

// Icons for the result cards
const FunctionIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M11.25 5.337c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.036 1.007-1.875 2.25-1.875S15 2.34 15 3.375c0 .369-.128.713-.349 1.003-.215.283-.401.604-.401.959 0 .332.278.598.61.578 1.91-.114 3.79-.342 5.632-.676a.75.75 0 0 1 .878.645 49.17 49.17 0 0 1-.908 4.73.75.75 0 0 1-.584.534c-2.18.405-4.768.685-7.475.685-2.707 0-5.295-.28-7.476-.685a.75.75 0 0 1-.583-.534 48.774 48.774 0 0 1-.91-4.73.75.75 0 0 1 .879-.645c1.842.334 3.71.562 5.629.676.332.02.61-.246.61-.578Z" />
    <path fillRule="evenodd" d="M15.75 9.75a.75.75 0 0 1 .75.75v4.94c0 .245.096.485.215.708.276.512.307 1.155.012 1.755-.293.6-.881 1.097-1.977 1.097H9.24c-1.172 0-1.739-.392-2.05-.9-.32-.52-.317-1.172-.317-1.901v-5.67c0-.414.336-.75.75-.75h8.127Z" clipRule="evenodd" />
  </svg>
);

const StructureIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M1.5 7.125c0-1.036.84-1.875 1.875-1.875h6c1.036 0 1.875.84 1.875 1.875v3.75c0 1.036-.84 1.875-1.875 1.875h-6A1.875 1.875 0 0 1 1.5 10.875v-3.75Zm12 1.5c0-1.036.84-1.875 1.875-1.875h5.25c1.035 0 1.875.84 1.875 1.875v8.25c0 1.035-.84 1.875-1.875 1.875h-5.25a1.875 1.875 0 0 1-1.875-1.875v-8.25ZM3 16.125c0-1.036.84-1.875 1.875-1.875h5.25c1.036 0 1.875.84 1.875 1.875v2.25c0 1.035-.84 1.875-1.875 1.875h-5.25A1.875 1.875 0 0 1 3 18.375v-2.25Z" clipRule="evenodd" />
  </svg>
);

const DrugIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M10.5 3.798v5.02a3 3 0 0 1-.879 2.121l-2.377 2.377a9.845 9.845 0 0 1-5.246-5.246l2.377-2.377A3 3 0 0 1 6.496 4.798h4.002Zm-3.747.27a.75.75 0 0 1 .274 1.025.75.75 0 0 1-1.025.274.75.75 0 0 1-.274-1.025.75.75 0 0 1 1.025-.274Z" clipRule="evenodd" />
    <path d="M6 18.75a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
    <path fillRule="evenodd" d="M12.971 3.75a1.5 1.5 0 0 1 1.5 1.5v7.5a1.5 1.5 0 0 1-1.5 1.5H8.531a1.5 1.5 0 0 1-1.5-1.5v-7.5a1.5 1.5 0 0 1 1.5-1.5h4.44Z" clipRule="evenodd" />
    <path d="M14.25 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 16.5 7.5h-1.5a.75.75 0 0 1-.75-.75V5.25Z" />
  </svg>
);

const DiseaseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
  </svg>
);

const InteractionIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M8.161 2.58a1.875 1.875 0 0 1 1.678 0l4.993 2.498c.106.052.23.052.336 0l3.869-1.935A1.875 1.875 0 0 1 21.75 4.82v12.485c0 .71-.401 1.36-1.037 1.677l-4.875 2.437a1.875 1.875 0 0 1-1.676 0l-4.994-2.497a.375.375 0 0 0-.336 0l-3.868 1.935A1.875 1.875 0 0 1 2.25 19.18V6.695c0-.71.401-1.36 1.036-1.677l4.875-2.437ZM9 6a.75.75 0 0 1 .75.75V15a.75.75 0 0 1-1.5 0V6.75A.75.75 0 0 1 9 6Zm6.75 3a.75.75 0 0 0-1.5 0v8.25a.75.75 0 0 0 1.5 0V9Z" clipRule="evenodd" />
  </svg>
);

const VariantIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.986.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clipRule="evenodd" />
  </svg>
);

const RestartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z" clipRule="evenodd" />
  </svg>
);

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

// Export the main component
export default function Home() {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [isSearched, setIsSearched] = useState(false);
  const [error, setError] = useState(null);
  const [hasFollowUp, setHasFollowUp] = useState(false);
  const [followupQuery, setFollowupQuery] = useState("");
  const [followupResults, setFollowupResults] = useState([]);
  const [loadingFollowup, setLoadingFollowup] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(true);
  const chatInputRef = useRef(null);
  const resultsContainerRef = useRef(null);
  const chatContainerRef = useRef(null);

  const loadingStates = [
    { text: "Analyzing gene information..." },
    { text: "Fetching biological functions..." },
    { text: "Looking for protein structures..." },
    { text: "Finding associated drugs..." },
    { text: "Searching disease connections..." },
    { text: "Mapping protein interactions..." },
    { text: "Retrieving variant data..." },
  ];

  useEffect(() => {
    handleReset();
  }, []);

  useEffect(() => {
    if (chatContainerRef?.current) {
      // Try multiple scroll approaches to ensure it works across browsers

      // Immediate scroll
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;

      // Delayed scroll
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, 50);

      // Smooth scroll after a slight delay
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTo({
            top: chatContainerRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }, [followupResults]);

  // Reset function
  const handleReset = () => {
    setIsSearched(false);
    setResults(null);
    setQuery("");
    setLoading(false);
    setError(null);
    setHasFollowUp(false);
    setFollowupQuery("");
    setFollowupResults([]);
    setShowSearchInput(true);

    // Smooth scroll to top
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }, 100);
  };

  // Close chat panel function
  const handleCloseChat = () => {
    setHasFollowUp(false);

    // Add animation delay so the interface appears smooth
    setTimeout(() => {
      setFollowupQuery("");
    }, 300);
  };


  // Update the JSON parsing code to clean the response data

  async function handleSearch(e) {
    e.preventDefault();
    const inputQuery = query.trim();
    if (!inputQuery) return;

    setLoading(true);
    setResults(null);
    setIsSearched(true);
    setError(null);
    setHasFollowUp(false);
    setFollowupResults([]);

    try {
      const response = await fetch('/api/gene-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: inputQuery }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      // Get the response from n8n
      const rawData = await response.json();
      console.log("Raw response:", rawData);

      // The n8n response is an array with one object containing a Chemlab field
      if (rawData && Array.isArray(rawData) && rawData[0] && rawData[0].fields && rawData[0].fields.Chemlab) {
        try {
          // Clean the Chemlab string before parsing
          let chemLabString = rawData[0].fields.Chemlab;

          // Remove Markdown code block formatting if present
          chemLabString = chemLabString.replace(/```json\s*/g, '');
          chemLabString = chemLabString.replace(/```\s*$/g, '');

          // Parse the cleaned Chemlab JSON string
          const chemLabData = JSON.parse(chemLabString);

          // Map the data to the format expected by your UI components
          const formattedData = {
            // Basic info
            name: chemLabData.Name || inputQuery,
            proteinId: chemLabData.ProteinDbId,
            uniprotId: chemLabData.UniProtId,

            // Map to UI categories with title + items format expected by ResultCard
            function: {
              title: "Biological Functions",
              items: chemLabData.BiologicalFunctions || []
            },

            diseases: {
              title: "Disease Associations",
              items: chemLabData.DiseaseAssociations || []
            },

            drugs: {
              title: "Drug Associations",
              items: chemLabData.DrugAssociations || []
            },

            interactions: {
              title: "Protein-Protein Interactions",
              items: chemLabData.ProteinProteinInteractions || []
            },

            variants: {
              title: "Variant Information",
              items: chemLabData.VariantInformation || []
            },

            // For structure viewer
            structure: {
              pdbId: chemLabData.ProteinDbId,
              title: "3D Structure",
              description: `PDB ID: ${chemLabData.ProteinDbId || "Not available"}`
            }
          };

          // Show loading state for better UX
          setTimeout(() => {
            setResults(formattedData);
            setLoading(false);
            // Hide search input after successful search
            setShowSearchInput(false);
          }, 1500);

        } catch (parseError) {
          console.error('Error parsing Chemlab data:', parseError);
          console.error('Problematic data:', rawData[0].fields.Chemlab);
          setError("Failed to parse gene information. Please try again.");
          setLoading(false);
        }
      } else {
        console.error('Invalid response format:', rawData);
        setError("No gene information found or invalid data format.");
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching gene info:', error);
      setError("Failed to fetch gene information. Please try again.");
      setLoading(false);
    }
  }

  // Handle follow-up questions
  // Update this function to match the new followup API format

  async function handleFollowUpSubmit(e) {
    e.preventDefault();

    if (!followupQuery.trim()) return;

    // Store the user's question
    const userQuestion = followupQuery;

    // Clear the input field immediately for better UX
    setFollowupQuery("");

    // Add the user's message as a separate message object
    // Use setTimeout to ensure it's added to the state before the next update
    setTimeout(() => {
      setFollowupResults(prev => [
        ...prev,
        {
          type: "user",
          query: userQuestion,
          timestamp: new Date().toISOString()
        }
      ]);

      // Force scroll to bottom to show the user's message
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, 0);

    // Set loading state after adding user message
    setLoadingFollowup(true);

    try {
      const response = await fetch('/api/followup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: userQuestion,
          previousQuery: query
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const responseData = await response.json();

      // Add the AI's response as a separate message object
      // Use setTimeout to ensure it's added to the state after the user message
      setTimeout(() => {
        setFollowupResults(prev => [
          ...prev,
          {
            type: "ai",
            response: responseData.message || "I found some additional information about that.",
            timestamp: new Date().toISOString()
          }
        ]);

        // Force scroll to bottom to show the AI response
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, 0);

    } catch (error) {
      console.error('Error processing followup:', error);

      // Add the error response as a separate message
      setTimeout(() => {
        setFollowupResults(prev => [
          ...prev,
          {
            type: "ai",
            response: "Sorry, I couldn't process that question. Please try again.",
            error: true,
            timestamp: new Date().toISOString()
          }
        ]);

        // Force scroll to bottom to show the error message
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, 0);
    } finally {
      setLoadingFollowup(false);
    }
  }

  // Focus on chat input when activating chat mode
  const focusFollowUpInput = () => {
    // First set the state to show the chat interface
    setHasFollowUp(true);

    // Create an artificial initial message if there are no messages yet
    if (followupResults.length === 0) {
      setFollowupResults([{
        type: "ai", // Add type to distinguish AI messages
        response: `I've analyzed information about ${query}. What would you like to know?`,
        timestamp: new Date().toISOString(),
        isWelcome: true
      }]);
    }

    // Focus the input field immediately
    requestAnimationFrame(() => {
      if (chatInputRef.current) {
        chatInputRef.current.focus();
      }
    });

    setTimeout(() => {
      if (chatInputRef.current) {
        chatInputRef.current.focus();
      }
    }, 50);
  };

  return (
    <main className="min-h-screen relative bg-black">
      {/* Background grid animation */}
      <div className="absolute inset-0 z-0">
        <GridSmallBackgroundDemo />
      </div>

      <motion.div
        className={`container mx-auto px-4 relative z-10 transition-all duration-700 ease-in-out flex flex-col ${!isSearched ? "justify-center min-h-screen" : "py-8"}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Header compact={isSearched && !loading} />

        {/* Search input - shown only initially or when explicitly requested */}
        <AnimatePresence>
          {showSearchInput && (
            <motion.div
              className="my-8 max-w-xl mx-auto w-full"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <SearchInput
                placeholder="Search for a gene (e.g. BRCA1, TP53, EGFR)..."
                onSubmit={handleSearch}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                isLoading={loading}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action buttons shown after search */}
        {isSearched && (
          <motion.div
            className="fixed top-4 right-4 md:top-8 md:right-8 z-20 flex gap-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            {/* Toggle button between chat and normal view */}
            {results && !loading && (
              hasFollowUp ? (
                <motion.button
                  onClick={handleCloseChat}
                  className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-purple-600 text-white px-4 py-2 rounded-full font-mono text-sm hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
                  whileTap={{ scale: 0.95 }}
                  whileHover={{
                    boxShadow: "0 0 15px rgba(255, 255, 255, 0.3)",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <CloseIcon /> Close Chat
                </motion.button>
              ) : (
                <motion.button
                  onClick={focusFollowUpInput}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white px-4 py-2 rounded-full font-mono text-sm hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
                  whileTap={{ scale: 0.95 }}
                  whileHover={{
                    boxShadow: "0 0 15px rgba(255, 255, 255, 0.3)",
                  }}
                >
                  <ChatIcon /> Ask a Question
                </motion.button>
              )
            )}

            {/* New search button */}
            <motion.button
              onClick={handleReset}
              disabled={loading}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-green-500 text-white px-4 py-2 rounded-full font-mono text-sm hover:opacity-90 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
              whileTap={{ scale: 0.95 }}
              whileHover={{
                boxShadow: "0 0 15px rgba(255, 255, 255, 0.3)",
              }}
            >
              <RestartIcon /> New Search
            </motion.button>
          </motion.div>
        )}

        <MultiStepLoader
          loadingStates={loadingStates}
          loading={loading}
          duration={1000}
        />

        {error && !loading && (
          <motion.div
            className="my-8 text-red-500 text-center font-mono"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {results && !loading && (
            <motion.div
              className="mt-8 md:mt-16 flex flex-col lg:flex-row gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              key="results-container"
            >
              {/* Results section - Vertical scrollable column when in chat mode */}
              <motion.div
                ref={resultsContainerRef}
                className={`${hasFollowUp ? 'w-full lg:w-1/3 lg:h-[calc(100vh-200px)] lg:overflow-y-auto pr-2 custom-scrollbar' : 'w-full'} transition-all duration-500`}
                layout
                animate={{ opacity: 1 }}
              >
                <BentoGrid className={`mx-auto ${hasFollowUp ? 'flex flex-col' : ''}`}>
                  {/* Structure Viewer - Hidden or replaced when in chat mode */}
                  {hasFollowUp ? (
                    <motion.div
                      className="col-span-12 row-span-1 bg-gradient-to-br from-violet-900/30 to-blue-900/30 rounded-xl p-6 flex flex-col justify-center items-center text-center border border-white/10 backdrop-blur-md shadow-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="mb-4">
                        <div className="p-2 w-fit mx-auto rounded-full bg-gradient-to-r from-blue-600/30 to-green-500/30">
                          <StructureIcon />
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-white">3D Structure View</h3>
                      <p className="text-white/70 text-sm mt-2">
                        Close the chat panel to return to the interactive 3D protein structure viewer.
                      </p>
                      <motion.button
                        onClick={handleCloseChat}
                        className="mt-4 bg-gradient-to-r from-purple-500 to-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 transition-all shadow-md"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Return to Full View
                      </motion.button>
                    </motion.div>
                  ) : (
                    <StructureViewer
                      title="3D Structure"
                      description="Interactive protein visualization"
                      icon={<StructureIcon />}
                      data={results.structure}
                      colSpan={hasFollowUp ? "col-span-12" : "col-span-1 md:col-span-6 lg:col-span-8"}
                      rowSpan="row-span-2"
                    />
                  )}

                  {/* Other result cards - adjust sizes based on chat mode */}
                  <ResultCard
                    title="Biological Function"
                    description="Gene function and processes"
                    icon={<FunctionIcon />}
                    data={results.function}
                    colSpan={hasFollowUp ? "col-span-12" : "col-span-1 md:col-span-3 lg:col-span-4"}
                  />

                  <ResultCard
                    title="Associated Drugs"
                    description="Therapeutic compounds"
                    icon={<DrugIcon />}
                    data={results.drugs}
                    colSpan={hasFollowUp ? "col-span-12" : "col-span-1 md:col-span-3 lg:col-span-4"}
                  />

                  <ResultCard
                    title="Disease Associations"
                    description="Related conditions"
                    icon={<DiseaseIcon />}
                    data={results.diseases}
                    colSpan={hasFollowUp ? "col-span-12" : "col-span-1 md:col-span-3 lg:col-span-4"}
                  />

                  <ResultCard
                    title="Protein Interactions"
                    description="Molecular binding partners"
                    icon={<InteractionIcon />}
                    data={results.interactions}
                    colSpan={hasFollowUp ? "col-span-12" : "col-span-1 md:col-span-3 lg:col-span-4"}
                  />

                  <ResultCard
                    title="Genetic Variants"
                    description="Known mutations"
                    icon={<VariantIcon />}
                    data={results.variants}
                    colSpan={hasFollowUp ? "col-span-12" : "col-span-1 md:col-span-3 lg:col-span-4"}
                  />
                </BentoGrid>
              </motion.div>

              {/* Chat section using ChatInterface component */}
              <AnimatePresence mode="wait" initial={false}> {/* Added initial={false} */}
                {hasFollowUp && (
                  <motion.div
                    className="w-full lg:w-2/3 h-[calc(100vh-200px)] transition-all"
                    initial={{ opacity: 0.9, x: 10 }} // Reduced x offset and increased initial opacity
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{
                      type: "spring",
                      stiffness: 500, // Increased stiffness for faster animation
                      damping: 25,    // Adjusted damping for smoother transition
                      mass: 0.8       // Reduced mass for faster motion
                    }}
                    layout
                    key="chat-interface"
                  >
                    <ChatInterface
                      topic={query}
                      followupQuery={followupQuery}
                      setFollowupQuery={setFollowupQuery}
                      followupResults={followupResults}
                      loadingFollowup={loadingFollowup}
                      handleFollowUpSubmit={handleFollowUpSubmit}
                      chatInputRef={chatInputRef}
                      onClose={handleCloseChat}
                      chatContainerRef={chatContainerRef}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}