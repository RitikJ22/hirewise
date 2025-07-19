"use client";

import { Suspense, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Filter, Users } from "lucide-react";
import Header from "@/components/layout/Header";
import FilterPanelSkeleton from "@/components/skeletons/FilterPanelSkeleton";
import CandidateGridSkeleton from "@/components/skeletons/CandidateGridSkeleton";
import ShortlistPanelSkeleton from "@/components/skeletons/ShortlistPanelSkeleton";
import { FilterPanel } from "@/components/dashboard/FilterPanel";
import { CandidateGrid } from "@/components/dashboard/CandidateGrid";
import { ShortlistPanel } from "@/components/dashboard/ShortlistPanel";
import { TeamSelectionModal } from "@/components/dashboard/TeamSelectionModal";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

const Home = () => {
  const {
    shortlistedCandidates,
    showTeamModal,
    closeTeamModal,
    openTeamModal,
    isLeftPanelExpanded,
    isRightPanelExpanded,
    toggleLeftPanel,
    toggleRightPanel,
  } = useAppStore();

  // Auto-open modal when 5 candidates are selected
  useEffect(() => {
    if (shortlistedCandidates.length === 5) {
      openTeamModal();
    }
  }, [shortlistedCandidates.length, openTeamModal]);

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        <div className="flex w-full relative">
          {/* Filter Panel - Expandable */}
          <AnimatePresence>
            {isLeftPanelExpanded && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 320, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex-shrink-0 border-r border-border bg-card overflow-hidden relative"
              >
                <div
                  className="h-full overflow-y-auto p-6 scrollbar-hide"
                  style={{ width: "320px" }}
                >
                  <Suspense fallback={<FilterPanelSkeleton />}>
                    <FilterPanel />
                  </Suspense>
                </div>

                {/* Close button for left panel */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center absolute top-2 -right-0 z-40 bg-card border border-border w-3 h-6 cursor-pointer rounded-bl-md rounded-tl-md border-r-0"
                  onClick={toggleLeftPanel}
                >
                  <button
                    className="hover:text-foreground/50 transition-colors duration-200"
                    aria-label="Close left panel"
                  >
                    <ChevronLeft className="w-2 h-2" strokeWidth={5} />
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Open button for left panel when collapsed */}
          <AnimatePresence>
            {!isLeftPanelExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                className="flex items-center justify-center absolute top-2 left-0 z-40 bg-card border border-border w-3 h-6 cursor-pointer rounded-br-md rounded-tr-md border-l-0"
                onClick={toggleLeftPanel}
              >
                <button
                  className="hover:text-foreground/50 transition-colors duration-200"
                  aria-label="Open left panel"
                >
                  <ChevronRight className="w-2 h-2" strokeWidth={5} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Candidate Grid - Dynamic width */}
          <motion.div
            className="flex-1 min-w-0"
            animate={{
              marginLeft: isLeftPanelExpanded ? 0 : 0,
              marginRight: isRightPanelExpanded ? 0 : 0,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <CandidateGrid />
          </motion.div>

          {/* Open button for right panel when collapsed */}
          <AnimatePresence>
            {!isRightPanelExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                className="flex items-center justify-center absolute top-2 right-0 z-40 bg-card border border-border w-3 h-6 cursor-pointer rounded-bl-md rounded-tl-md border-r-0"
                onClick={toggleRightPanel}
              >
                <button
                  className="hover:text-foreground/50 transition-colors duration-200"
                  aria-label="Open right panel"
                >
                  <ChevronLeft className="w-2 h-2" strokeWidth={5} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Shortlist Panel - Expandable */}
          <AnimatePresence>
            {isRightPanelExpanded && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 320, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex-shrink-0 border-l border-border bg-card overflow-hidden relative"
              >
                <div
                  className="h-full overflow-y-auto p-6 scrollbar-hide"
                  style={{ width: "320px" }}
                >
                  <Suspense fallback={<ShortlistPanelSkeleton />}>
                    <ShortlistPanel />
                  </Suspense>
                </div>

                {/* Close button for right panel */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center absolute top-2 -left-0 z-40 bg-card border border-border w-3 h-6 cursor-pointer rounded-br-md rounded-tr-md border-l-0"
                  onClick={toggleRightPanel}
                >
                  <button
                    className="hover:text-foreground/50 transition-colors duration-200"
                    aria-label="Close right panel"
                  >
                    <ChevronRight className="w-2 h-2" strokeWidth={5} />
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Team Selection Modal */}
      <TeamSelectionModal
        isOpen={showTeamModal}
        onClose={closeTeamModal}
        candidates={shortlistedCandidates}
      />
    </div>
  );
};

export default Home;
