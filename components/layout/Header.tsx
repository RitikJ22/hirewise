"use client";

import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useAppStore } from "@/lib/store";

const Header = () => {
  const { shortlistedCandidates, openTeamModal } = useAppStore();

  const handleExportClick = () => {
    if (shortlistedCandidates.length === 5) {
      openTeamModal();
    }
  };

  return (
    <header className="border-b border-border backdrop-blur-sm flex-shrink-0 w-full">
      <div className="w-full px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Logo size="sm" className="sm:hidden" />
            <Logo size="lg" className="hidden sm:block" />
            <div className="space-y-0.5 sm:space-y-1 hidden sm:block">
              <h1 className="text-lg sm:text-2xl font-bold text-foreground">
                Co-pilot
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                AI-powered candidate filtering and selection
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <Button
              size="sm"
              variant="outline"
              onClick={handleExportClick}
              disabled={shortlistedCandidates.length !== 5}
              className="flex items-center space-x-1 sm:space-x-2 h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm"
              title={
                shortlistedCandidates.length === 5
                  ? "Export your team data"
                  : "Select 5 candidates to export"
              }
            >
              <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Export PDF</span>
              <span className="sm:hidden">Export</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
