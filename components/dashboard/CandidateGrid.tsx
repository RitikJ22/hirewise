"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Candidate } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { RefreshCw, AlertCircle, Users } from "lucide-react";
import { Toast } from "@/lib/toast";
import { CandidateCard } from "./CandidateCard";

export const CandidateGrid = () => {
  const { filters } = useAppStore();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observer = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  const fetchCandidates = useCallback(
    async (pageNum: number, reset: boolean = false) => {
      try {
        setLoading(true);
        setError(null);

        const queryParams = new URLSearchParams({
          skills: filters.skills,
          minExp: filters.minExp.toString(),
          maxExp: filters.maxExp.toString(),
          minSalary: filters.minSalary.toString(),
          maxSalary: filters.maxSalary.toString(),
          topSchool: filters.topSchool.toString(),
          sortBy: filters.sortBy,
          page: pageNum.toString(),
          limit: "4", // Show 4 candidates per page (2x2 grid)
        });

        const response = await fetch(`/api/candidates?${queryParams}`);

        if (!response.ok) {
          throw new Error("Failed to fetch candidates");
        }

        const data = await response.json();

        if (reset) {
          setCandidates(data.candidates);
          Toast.success(
            "Candidates loaded",
            `Found ${data.candidates.length} candidates matching your criteria.`
          );
        } else {
          setCandidates((prev) => [...prev, ...data.candidates]);
        }

        setHasMore(data.candidates.length === 4); // 4 candidates per page
        setPage(pageNum);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        Toast.error(
          "Failed to load candidates",
          "Please try again or check your connection."
        );
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    setPage(1);
    fetchCandidates(1, true);
  }, [filters, fetchCandidates]);

  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchCandidates(page + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, page, fetchCandidates]
  );

  const handleRetry = () => {
    fetchCandidates(1, true);
  };

  const handleRefresh = () => {
    fetchCandidates(1, true);
    Toast.info("Refreshing candidates", "Loading the latest candidate data...");
  };

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-64 space-y-4"
      >
        <AlertCircle className="h-12 w-12 text-destructive" />
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            Failed to load candidates
          </h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
        <Button onClick={handleRetry} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Candidates</h2>
          {candidates.length > 0 && (
            <span className="text-sm text-muted-foreground">
              ({candidates.length} found)
            </span>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={loading}
          className="text-muted-foreground hover:text-foreground"
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Candidate Grid */}
      <AnimatePresence mode="wait">
        {candidates.length === 0 && !loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No candidates found
            </h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search criteria
            </p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <AnimatePresence>
              {candidates.map((candidate, index) => (
                <motion.div
                  key={candidate.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  ref={
                    index === candidates.length - 1 ? lastElementRef : undefined
                  }
                >
                  <CandidateCard candidate={candidate} />
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Loading Skeleton */}
            {loading && (
              <>
                {[...Array(4)].map((_, index) => (
                  <Card key={index} className="bg-card border-border">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-4 w-48" />
                        </div>
                        <Skeleton className="h-8 w-8 rounded-full" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex space-x-2">
                          <Skeleton className="h-3 w-16" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                        <Skeleton className="h-4 w-20" />
                        <div className="space-y-1">
                          <Skeleton className="h-3 w-24" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                        <div className="flex space-x-1">
                          <Skeleton className="h-5 w-12 rounded-full" />
                          <Skeleton className="h-5 w-14 rounded-full" />
                          <Skeleton className="h-5 w-10 rounded-full" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}
          </div>
        )}
      </AnimatePresence>

      {/* Load More Indicator */}
      {hasMore && !loading && candidates.length > 0 && (
        <div ref={loadingRef} className="text-center py-4">
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
      )}

      {/* End of Results */}
      {!hasMore && candidates.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-4"
        >
          <p className="text-sm text-muted-foreground">
            You&apos;ve reached the end of the results
          </p>
        </motion.div>
      )}
    </div>
  );
};
