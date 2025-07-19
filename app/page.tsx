"use client";

import { Suspense, useEffect } from "react";
import Header from "@/components/layout/Header";
import FilterPanelSkeleton from "@/components/skeletons/FilterPanelSkeleton";
import CandidateGridSkeleton from "@/components/skeletons/CandidateGridSkeleton";
import ShortlistPanelSkeleton from "@/components/skeletons/ShortlistPanelSkeleton";
import { FilterPanel } from "@/components/dashboard/FilterPanel";
import { CandidateGrid } from "@/components/dashboard/CandidateGrid";
import { ShortlistPanel } from "@/components/dashboard/ShortlistPanel";
import { TeamSelectionModal } from "@/components/dashboard/TeamSelectionModal";
import { useAppStore } from "@/lib/store";

const Home = () => {
  const {
    shortlistedCandidates,
    showTeamModal,
    closeTeamModal,
    openTeamModal,
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
        <div className="flex w-full">
          {/* Filter Panel - Fixed */}
          <div className="w-80 flex-shrink-0 border-r border-border bg-card">
            <div className="h-full overflow-y-auto p-6 scrollbar-hide">
              <Suspense fallback={<FilterPanelSkeleton />}>
                <FilterPanel />
              </Suspense>
            </div>
          </div>

          {/* Candidate Grid - Scrollable */}
          <div className="flex-1 min-w-0">
            <CandidateGrid />
          </div>

          {/* Shortlist Panel - Fixed */}
          <div className="w-80 flex-shrink-0 border-l border-border bg-card">
            <div className="h-full overflow-y-auto p-6 scrollbar-hide">
              <Suspense fallback={<ShortlistPanelSkeleton />}>
                <ShortlistPanel />
              </Suspense>
            </div>
          </div>
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
