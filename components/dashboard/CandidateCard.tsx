"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  MapPin,
  Minus,
  Plus,
  User,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Candidate } from "@/lib/types";
import clsx from "clsx";
import { Toast } from "@/lib/toast";

interface CandidateCardProps {
  candidate: Candidate;
}

export const CandidateCard = ({ candidate }: CandidateCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const {
    addCandidate,
    removeCandidate,
    shortlistedCandidates,
    isFilterApplied,
  } = useAppStore();
  const isShortlisted = shortlistedCandidates.some(
    (c) => c.email === candidate.email
  );
  const isMaxReached = shortlistedCandidates.length >= 5;

  const handleAddToShortlist = () => {
    if (isMaxReached && !isShortlisted) {
      Toast.error(
        "Maximum 5 candidates allowed",
        "Please remove a candidate from your shortlist to add a new one."
      );
      return;
    }

    if (isShortlisted) {
      Toast.loading(
        "Candidate already in shortlist",
        `${candidate.name} is already in your shortlist.`
      );
      return;
    }

    addCandidate(candidate);
    Toast.success(
      "Candidate added to shortlist",
      `${candidate.name} has been added to your shortlist.`
    );
  };

  const handleRemoveFromShortlist = () => {
    removeCandidate(candidate.email);
    Toast.remove(
      "Candidate removed",
      `${candidate.name} has been removed from your shortlist.`
    );
  };

  const formatSalary = (salary: number) => {
    if (!salary || isNaN(salary)) {
      return "$0";
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(salary);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "-";
    }
  };

  // Helper function to handle empty values
  const getValueOrDash = (
    value: string | null | undefined | string[],
    fallback: string = "-"
  ) => {
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      (Array.isArray(value) && value.length === 0)
    ) {
      return fallback;
    }
    return value;
  };

  // Improved hover handlers with timeout to prevent glitches
  const handleMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsExpanded(false);
    }, 150); // Increased delay to prevent glitches when scrolled
    setHoverTimeout(timeout);
  };

  // Force close expanded state when component loses focus or scrolls
  const handleCardBlur = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setIsExpanded(false);
  };

  // Cleanup timeout on unmount and handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      if (isExpanded) {
        handleCardBlur();
      }
    };

    // Add scroll listener to parent scrollable container
    const scrollContainer = document.querySelector(".scrollbar-hide");
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll, {
        passive: true,
      });
    }

    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [hoverTimeout, isExpanded]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full p-2"
    >
      <Card
        className={clsx(
          "bg-card border-border transition-all duration-300 mx-5 flex flex-col cursor-pointer",
          {
            "h-[350px]": isExpanded,
            "h-[240px]": !isExpanded,
            "border-primary": isShortlisted,
            "hover:border-border/80": !isShortlisted,
          }
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onBlur={handleCardBlur}
      >
        <CardHeader className=" flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <h3 className="text-lg font-semibold text-foreground truncate">
                  {getValueOrDash(candidate.name, "Unknown Name")}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {getValueOrDash(candidate.email, "No Email")}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {/* Match Score - Only show when filters are applied */}
              {isFilterApplied && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-foreground">
                    Match
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-primary/20 text-primary"
                  >
                    {candidate.matchScore || 0}%
                  </Badge>
                </div>
              )}
              <Button
                size="sm"
                variant={isShortlisted ? "destructive" : "default"}
                onClick={
                  isShortlisted
                    ? handleRemoveFromShortlist
                    : handleAddToShortlist
                }
                disabled={!isShortlisted && isMaxReached}
                className={clsx("flex-shrink-0", {
                  "bg-destructive text-destructive-foreground hover:bg-destructive/90":
                    isShortlisted,
                  "bg-muted text-muted-foreground cursor-not-allowed":
                    !isShortlisted && isMaxReached,
                  "bg-primary text-primary-foreground hover:bg-primary/90":
                    !isShortlisted && !isMaxReached,
                })}
                title={
                  isShortlisted
                    ? "Remove from shortlist"
                    : isMaxReached
                    ? "Maximum 5 candidates reached"
                    : "Add to shortlist"
                }
              >
                {isShortlisted ? (
                  <Minus className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 flex-1 flex flex-col min-h-0">
          {/* Main Content Area */}
          <div className="flex flex-col h-full">
            {/* Always Visible Info - Single Row */}
            <div className="flex gap-4 flex-shrink-0">
              {/* Left Side - Basic Info */}
              <div className="w-64 space-y-3">
                {/* Location and Availability */}
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">
                      {getValueOrDash(candidate.location, "Unknown")}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Briefcase className="h-3 w-3" />
                    <span className="truncate">
                      {candidate.work_availability &&
                      candidate.work_availability.length > 0
                        ? candidate.work_availability.join(", ")
                        : "Unknown"}
                    </span>
                  </div>
                </div>

                {/* Salary */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    {formatSalary(candidate.salaryNumeric || 0)}
                  </span>
                </div>

                {/* Application Date */}
                <div className="text-xs text-muted-foreground">
                  Applied {formatDate(candidate.submitted_at || "")}
                </div>
              </div>

              {/* Right Side - Skills */}
              <div className="flex-1 flex flex-col relative">
                {/* Skills Section */}
                <div className="space-y-2">
                  <span className="text-sm font-medium text-foreground">
                    Skills
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {candidate.skills?.slice(0, 12).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {getValueOrDash(skill, "Unknown Skill")}
                      </Badge>
                    ))}
                    {candidate.skills && candidate.skills.length > 12 && (
                      <Badge variant="outline" className="text-xs">
                        +{candidate.skills.length - 12}
                      </Badge>
                    )}
                    {(!candidate.skills || candidate.skills.length === 0) && (
                      <span className="text-xs text-muted-foreground">
                        No skills listed
                      </span>
                    )}
                  </div>
                </div>

                {/* Expand Icon - Absolutely Positioned Bottom Right */}
                <div className="absolute bottom-0 right-0">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="h-8 w-8 p-0 hover:bg-muted transition-colors"
                    title={isExpanded ? "Show less" : "Show more"}
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Expandable Content - Experience and Education in Row */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 min-h-0 py-4 overflow-hidden"
                >
                  <div className="flex gap-6 h-full">
                    {/* Experience Column */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Briefcase className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">
                          Experience
                        </span>
                      </div>
                      <div className="pl-5 space-y-1">
                        {candidate.work_experiences
                          ?.slice(0, 3)
                          .map((exp, index) => (
                            <div
                              key={index}
                              className="text-xs text-muted-foreground"
                            >
                              <span className="font-medium">
                                {getValueOrDash(exp.roleName, "Unknown Role")}
                              </span>{" "}
                              at{" "}
                              {getValueOrDash(exp.company, "Unknown Company")}
                            </div>
                          ))}
                        {candidate.work_experiences &&
                          candidate.work_experiences.length > 3 && (
                            <div className="text-xs text-muted-foreground">
                              +{candidate.work_experiences.length - 3} more
                            </div>
                          )}
                        {(!candidate.work_experiences ||
                          candidate.work_experiences.length === 0) && (
                          <div className="text-xs text-muted-foreground">
                            No experience listed
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Education Column */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-2">
                        <GraduationCap className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">
                          Education
                        </span>
                        {candidate.isTopSchool && (
                          <Badge variant="outline" className="text-xs">
                            Top School
                          </Badge>
                        )}
                      </div>
                      <div className="pl-5 space-y-1">
                        {candidate.education?.degrees
                          ?.slice(0, 2)
                          .map((degree, index) => (
                            <div
                              key={index}
                              className="text-xs text-muted-foreground"
                            >
                              {getValueOrDash(degree.degree, "Unknown Degree")}{" "}
                              in{" "}
                              {getValueOrDash(
                                degree.subject,
                                "Unknown Subject"
                              )}
                            </div>
                          ))}
                        {(!candidate.education?.degrees ||
                          candidate.education.degrees.length === 0) && (
                          <div className="text-xs text-muted-foreground">
                            No education listed
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
