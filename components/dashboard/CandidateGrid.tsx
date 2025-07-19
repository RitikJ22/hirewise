"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Candidate } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { RefreshCw, AlertCircle, Users, X } from "lucide-react";
import { Toast } from "@/lib/toast";
import { CandidateCard } from "./CandidateCard";
import { CandidateCardSkeleton } from "@/components/skeletons/CandidateCardSkeleton";

export const CandidateGrid = () => {
  const { filters, isFilterApplied } = useAppStore();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingPage, setLoadingPage] = useState(false);

  const fetchCandidates = useCallback(
    async (pageNum: number, reset: boolean = false) => {
      try {
        if (reset) {
          setLoading(true);
        } else {
          setLoadingPage(true);
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

        setCandidates(data.candidates);
        setTotal(data.total);
        setCurrentPage(pageNum);
        setTotalPages(Math.ceil(data.total / 10));
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
        setLoadingPage(false);
      }
    },
    [filters, isFilterApplied]
  );

  useEffect(() => {
    setLoading(true); // Set loading immediately when filters change
    setCurrentPage(1);
    setCandidates([]);
    setTotal(0);
    setTotalPages(1);
    fetchCandidates(1, true);
  }, [filters, fetchCandidates]);

  const handleRetry = () => {
    fetchCandidates(1, true);
  };

  const handleRefresh = () => {
    fetchCandidates(1, true);
    Toast.loading(
      "Refreshing candidates",
      "Loading the latest candidate data..."
    );
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
    <div className="flex flex-col h-full pt-6 pb-4">
      {/* Fixed Header Section */}
      <div className="flex-shrink-0 space-y-4 pb-4">
        {/* Header */}
        <div className="flex items-center justify-between px-5">
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
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto min-h-0 space-y-2 scrollbar-hide">
        {/* Show shimmer during any loading state */}
        {(loading || loadingPage) && (
          <>
            {[...Array(6)].map((_, index) => (
              <CandidateCardSkeleton key={`loading-${index}`} />
            ))}
          </>
        )}

        {/* Show candidates when not loading */}
        {candidates.length > 0 && !loading && !loadingPage && (
          <AnimatePresence mode="wait">
            {candidates.map((candidate, index) => (
              <motion.div
                key={`${candidate.name}-${candidate.email}-${candidate.phone}-${currentPage}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <CandidateCard candidate={candidate} />
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {/* No Results State */}
        {candidates.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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
        )}
      </div>

      {/* Fixed Bottom Pagination */}
      {totalPages > 1 && candidates.length > 0 && (
        <div className="flex-shrink-0 bg-background/95 backdrop-blur-sm border-t border-border">
          <div className="flex items-center justify-between pt-5 px-6">
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages} • {total} total candidates
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchCandidates(currentPage - 1)}
                disabled={currentPage === 1 || loadingPage}
                className="flex items-center space-x-1"
              >
                <span>←</span>
                <span>Previous</span>
              </Button>

              <div className="flex items-center space-x-1">
                {(() => {
                  const maxVisible = 5;
                  let startPage = 1;
                  let endPage = Math.min(maxVisible, totalPages);

                  // If we're past the first few pages, show a window around current page
                  if (currentPage > 3) {
                    startPage = Math.max(1, currentPage - 2);
                    endPage = Math.min(totalPages, currentPage + 2);
                  }

                  // If we're near the end, adjust to show the last few pages
                  if (endPage === totalPages && totalPages > maxVisible) {
                    startPage = Math.max(1, totalPages - maxVisible + 1);
                  }

                  const pages = [];
                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(i);
                  }

                  return (
                    <>
                      {startPage > 1 && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fetchCandidates(1)}
                            disabled={loadingPage}
                            className="w-8 h-8 p-0"
                          >
                            1
                          </Button>
                          {startPage > 2 && (
                            <span className="text-muted-foreground px-2">
                              ...
                            </span>
                          )}
                        </>
                      )}

                      {pages.map((pageNum) => (
                        <Button
                          key={pageNum}
                          variant={
                            currentPage === pageNum ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => fetchCandidates(pageNum)}
                          disabled={loadingPage}
                          className="w-8 h-8 p-0"
                        >
                          {pageNum}
                        </Button>
                      ))}

                      {endPage < totalPages && (
                        <>
                          {endPage < totalPages - 1 && (
                            <span className="text-muted-foreground px-2">
                              ...
                            </span>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fetchCandidates(totalPages)}
                            disabled={loadingPage}
                            className="w-8 h-8 p-0"
                          >
                            {totalPages}
                          </Button>
                        </>
                      )}
                    </>
                  );
                })()}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchCandidates(currentPage + 1)}
                disabled={currentPage === totalPages || loadingPage}
                className="flex items-center space-x-1"
              >
                <span>Next</span>
                <span>→</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
