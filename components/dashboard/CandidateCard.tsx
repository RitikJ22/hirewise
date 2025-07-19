"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Candidate } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import {
  Plus,
  MapPin,
  Briefcase,
  GraduationCap,
  DollarSign,
  Minus,
} from "lucide-react";
import { Toast } from "@/lib/toast";

interface CandidateCardProps {
  candidate: Candidate;
}

export const CandidateCard = ({ candidate }: CandidateCardProps) => {
  const { addCandidate, removeCandidate, shortlistedCandidates } =
    useAppStore();
  const isShortlisted = shortlistedCandidates.some(
    (c) => c.name === candidate.name
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
      Toast.info(
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
    removeCandidate(candidate.name);
    Toast.success(
      "Candidate removed",
      `${candidate.name} has been removed from your shortlist.`
    );
  };

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(salary);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="w-full"
    >
      <Card
        className={`bg-card border-border transition-colors h-[550px] flex flex-col cursor-pointer ${
          isShortlisted ? "border-primary" : "hover:border-border/80"
        }`}
      >
        <CardHeader className="pb-3 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="space-y-1 min-w-0 flex-1">
              <h3 className="text-lg font-semibold text-foreground truncate">
                {candidate.name}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {candidate.email}
              </p>
            </div>
            <Button
              size="sm"
              variant={isShortlisted ? "destructive" : "default"}
              onClick={
                isShortlisted ? handleRemoveFromShortlist : handleAddToShortlist
              }
              disabled={!isShortlisted && isMaxReached}
              className={`${
                isShortlisted
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : isMaxReached
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              } flex-shrink-0`}
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
        </CardHeader>

        <CardContent className="p-4 flex-1 flex flex-col min-h-0">
          {/* Fixed height sections at the top */}
          <div className="space-y-4 flex-shrink-0">
            {/* Location and Availability */}
            <div className="flex items-center space-x-3 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{candidate.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Briefcase className="h-3 w-3" />
                <span className="truncate">
                  {candidate.work_availability[0]}
                </span>
              </div>
            </div>

            {/* Match Score */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                Match Score
              </span>
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                {candidate.matchScore || 0}%
              </Badge>
            </div>
          </div>

          {/* Content section */}
          <div className="flex-1 min-h-0 py-4 space-y-4">
            {/* Experience */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Briefcase className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  Experience
                </span>
              </div>
              <div className="pl-5 space-y-1">
                {candidate.work_experiences.slice(0, 2).map((exp, index) => (
                  <div key={index} className="text-xs text-muted-foreground">
                    <span className="font-medium">{exp.roleName}</span> at{" "}
                    {exp.company}
                  </div>
                ))}
                {candidate.work_experiences.length > 2 && (
                  <div className="text-xs text-muted-foreground">
                    +{candidate.work_experiences.length - 2} more
                  </div>
                )}
              </div>
            </div>

            {/* Education */}
            <div className="space-y-2">
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
                {candidate.education.degrees
                  .slice(0, 1)
                  .map((degree, index) => (
                    <div key={index} className="text-xs text-muted-foreground">
                      {degree.degree} in {degree.subject}
                    </div>
                  ))}
              </div>
            </div>

            {/* Salary */}
            <div className="flex items-center space-x-2">
              <DollarSign className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                Salary
              </span>
              <span className="text-sm text-muted-foreground">
                {formatSalary(candidate.salaryNumeric || 0)}
              </span>
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <span className="text-sm font-medium text-foreground">
                Skills
              </span>
              <div className="flex flex-wrap gap-1">
                {candidate.skills.slice(0, 3).map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {candidate.skills.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{candidate.skills.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Fixed height section at the bottom */}
          <div className="flex-shrink-0 pt-4">
            <div className="text-xs text-muted-foreground">
              Applied {formatDate(candidate.submitted_at)}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
