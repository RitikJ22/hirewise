"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Candidate } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { RefreshCw, AlertCircle, Users, X } from "lucide-react";
import { Toast } from "@/lib/toast";
import { CandidateCard } from "./CandidateCard";
import { BackToTop } from "@/components/ui/back-to-top";

export const CandidateGrid = () => {
  const { filters, isFilterApplied } = useAppStore();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  const fetchCandidates = useCallback(
    async (pageNum: number, reset: boolean = false) => {
      try {
        if (reset) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }
        setError(null);

        const queryParams = new URLSearchParams({
          skills: filters.skills,
          workAvailability: filters.workAvailability.join(","),
          minSalary: filters.minSalary.toString(),
          maxSalary: filters.maxSalary.toString(),
          location: filters.location,
          roleName: filters.roleName,
          company: filters.company,
          educationLevel: filters.educationLevel,
          degreeSubject: filters.degreeSubject,
          sortBy: filters.sortBy,
          page: pageNum.toString(),
          limit: "10", // Show 10 candidates per page
        });

        const response = await fetch(`/api/candidates?${queryParams}`);

        if (!response.ok) {
          throw new Error("Failed to fetch candidates");
        }

        const data = await response.json();

        if (reset) {
          setCandidates(data.candidates);
          setTotal(data.total);
        } else {
          setCandidates((prev) => [...prev, ...data.candidates]);
        }

        setHasMore(data.hasMore);
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
        setLoadingMore(false);
      }
    },
    [filters, isFilterApplied]
  );

  useEffect(() => {
    setPage(1);
    setCandidates([]);
    setTotal(0);
    fetchCandidates(1, true);
  }, [filters, fetchCandidates]);

  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading || loadingMore) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          fetchCandidates(page + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, loadingMore, hasMore, page, fetchCandidates]
  );

  const handleRetry = () => {
    fetchCandidates(1, true);
  };

  const handleRefresh = () => {
    fetchCandidates(1, true);
    Toast.info("Refreshing candidates", "Loading the latest candidate data...");
  };

  const getActiveFilters = () => {
    const activeFilters = [];

    if (filters.skills) {
      activeFilters.push({
        key: "skills",
        label: `Skills: ${filters.skills}`,
        value: filters.skills,
      });
    }

    if (filters.workAvailability.length > 0) {
      activeFilters.push({
        key: "workAvailability",
        label: `Availability: ${filters.workAvailability.join(", ")}`,
        value: filters.workAvailability,
      });
    }

    if (filters.location) {
      activeFilters.push({
        key: "location",
        label: `Location: ${filters.location}`,
        value: filters.location,
      });
    }

    if (filters.roleName) {
      activeFilters.push({
        key: "roleName",
        label: `Role: ${filters.roleName}`,
        value: filters.roleName,
      });
    }

    if (filters.company) {
      activeFilters.push({
        key: "company",
        label: `Company: ${filters.company}`,
        value: filters.company,
      });
    }

    if (filters.educationLevel && filters.educationLevel !== "all") {
      activeFilters.push({
        key: "educationLevel",
        label: `Education: ${filters.educationLevel}`,
        value: filters.educationLevel,
      });
    }

    if (filters.degreeSubject) {
      activeFilters.push({
        key: "degreeSubject",
        label: `Degree: ${filters.degreeSubject}`,
        value: filters.degreeSubject,
      });
    }

    if (filters.minSalary > 45000 || filters.maxSalary < 150000) {
      activeFilters.push({
        key: "salary",
        label: `Salary: $${filters.minSalary.toLocaleString()}-$${filters.maxSalary.toLocaleString()}`,
        value: { min: filters.minSalary, max: filters.maxSalary },
      });
    }

    return activeFilters;
  };

  const handleRemoveFilter = (filterKey: string) => {
    const { setFilters } = useAppStore.getState();

    switch (filterKey) {
      case "skills":
        setFilters({ skills: "" });
        break;
      case "workAvailability":
        setFilters({ workAvailability: [] });
        break;
      case "location":
        setFilters({ location: "" });
        break;
      case "roleName":
        setFilters({ roleName: "" });
        break;
      case "company":
        setFilters({ company: "" });
        break;
      case "educationLevel":
        setFilters({ educationLevel: "all" });
        break;
      case "degreeSubject":
        setFilters({ degreeSubject: "" });
        break;
      case "salary":
        setFilters({ minSalary: 45000, maxSalary: 150000 });
        break;
    }
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
    <div className="space-y-6 relative">
      <BackToTop />
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">
            {getActiveFilters().length > 0
              ? "Filtered Candidates"
              : "All Candidates"}
          </h2>
          {total > 0 && (
            <span className="text-sm text-muted-foreground">
              ({candidates.length} of {total} shown)
            </span>
          )}
          {getActiveFilters().length > 0 && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
              Filter Applied
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

      {/* Active Filter Tags */}
      {getActiveFilters().length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2"
        >
          {getActiveFilters().map((filter) => (
            <motion.div
              key={filter.key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center space-x-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm border border-primary/20"
            >
              <span className="text-xs">{filter.label}</span>
              <button
                onClick={() => handleRemoveFilter(filter.key)}
                className="ml-1 hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                title={`Remove ${filter.label}`}
              >
                <X className="h-3 w-3" />
              </button>
            </motion.div>
          ))}
        </motion.div>
      )}

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
                  key={`${candidate.name}-${candidate.email}-${candidate.phone}-${index}`}
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

            {/* Loading More Spinner */}
            {loadingMore && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-2 flex justify-center py-8"
              >
                <div className="flex items-center space-x-2">
                  <RefreshCw className="h-5 w-5 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Loading more candidates...
                  </span>
                </div>
              </motion.div>
            )}

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
      {hasMore && candidates.length > 0 && (
        <div ref={loadingRef} className="text-center py-4">
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <RefreshCw className="h-4 w-4 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">
                Loading more candidates...
              </span>
            </div>
          ) : (
            <Skeleton className="h-4 w-32 mx-auto" />
          )}
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
