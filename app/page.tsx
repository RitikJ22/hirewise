import { Suspense } from "react";
import FilterPanel from "@/components/dashboard/FilterPanel";
import CandidateGrid from "@/components/dashboard/CandidateGrid";
import ShortlistPanel from "@/components/dashboard/ShortlistPanel";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm flex-shrink-0">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                HireWise Co-pilot
              </h1>
              <p className="text-muted-foreground">
                AI-powered candidate filtering and selection
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-sm text-muted-foreground">Live</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        <div className="flex w-full">
          {/* Filter Panel - Fixed */}
          <div className="w-80 flex-shrink-0 border-r border-border bg-card">
            <div className="h-full overflow-y-auto p-6">
              <Suspense fallback={<FilterPanelSkeleton />}>
                <FilterPanel />
              </Suspense>
            </div>
          </div>

          {/* Candidate Grid - Scrollable */}
          <div className="flex-1 min-w-0">
            <div className="h-full overflow-y-auto p-6">
              <Suspense fallback={<CandidateGridSkeleton />}>
                <CandidateGrid />
              </Suspense>
            </div>
          </div>

          {/* Shortlist Panel - Fixed */}
          <div className="w-80 flex-shrink-0 border-l border-border bg-card">
            <div className="h-full overflow-y-auto p-6">
              <Suspense fallback={<ShortlistPanelSkeleton />}>
                <ShortlistPanel />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function FilterPanelSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-16" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

function CandidateGridSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-card rounded-lg p-4 space-y-3">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
            <div className="flex space-x-2">
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ShortlistPanelSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-20" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-1 flex-1">
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-2 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
