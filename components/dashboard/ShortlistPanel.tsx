"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import TeamAnalytics from "./TeamAnalytics";
import { X, Users, Trash2 } from "lucide-react";
import { Toast } from "@/lib/toast";

export default function ShortlistPanel() {
  const { shortlistedCandidates, removeCandidate, clearShortlist } =
    useAppStore();

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(salary);
  };

  const handleRemoveCandidate = (candidateName: string) => {
    removeCandidate(candidateName);
    Toast.success(
      "Candidate removed",
      `${candidateName} has been removed from your shortlist.`
    );
  };

  const handleClearShortlist = () => {
    if (shortlistedCandidates.length === 0) {
      Toast.info("Shortlist is already empty", "No candidates to remove.");
      return;
    }

    clearShortlist();
    Toast.success(
      "Shortlist cleared",
      `All ${shortlistedCandidates.length} candidates have been removed from your shortlist.`
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Shortlist</h2>
        </div>
        {shortlistedCandidates.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearShortlist}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Team Analytics */}
      <TeamAnalytics candidates={shortlistedCandidates} />

      {/* Shortlisted Candidates */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            Selected Candidates
          </h3>
          <Badge variant="secondary" className="bg-primary/20 text-primary">
            {shortlistedCandidates.length}/5
          </Badge>
        </div>

        <AnimatePresence mode="wait">
          {shortlistedCandidates.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8"
            >
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No candidates selected yet
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Click the + button on candidate cards to add them to your
                shortlist
              </p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {shortlistedCandidates.map((candidate, index) => (
                  <motion.div
                    key={candidate.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Card className="bg-card border-border hover:border-primary/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium text-foreground truncate">
                                {candidate.name}
                              </h4>
                              <Badge
                                variant="secondary"
                                className="bg-primary/20 text-primary text-xs flex-shrink-0"
                              >
                                {candidate.matchScore || 0}%
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {candidate.email}
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <span className="truncate">
                                {candidate.location}
                              </span>
                              <span className="flex-shrink-0">
                                {formatSalary(candidate.salaryNumeric || 0)}
                              </span>
                              <span className="flex-shrink-0">
                                {candidate.experienceProxy || 0} years exp
                              </span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              handleRemoveCandidate(candidate.name)
                            }
                            className="text-muted-foreground hover:text-destructive flex-shrink-0 ml-2"
                            title="Remove from shortlist"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </AnimatePresence>

        {/* Max Selection Warning */}
        {shortlistedCandidates.length >= 5 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary/10 border border-primary/20 rounded-lg p-3"
          >
            <p className="text-sm text-primary font-medium">
              Maximum 5 candidates selected
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Remove a candidate to add a new one
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
