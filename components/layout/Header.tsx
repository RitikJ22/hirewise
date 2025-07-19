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
      <div className="w-full px-6 py-3">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            <Logo size="lg" />
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-foreground">Co-pilot</h1>
              <p className="text-sm text-muted-foreground">
                AI-powered candidate filtering and selection
              </p>
            </div>
          </div>
          <div className="flex items-center px-6">
            <Button
              size="sm"
              variant="outline"
              onClick={handleExportClick}
              disabled={shortlistedCandidates.length !== 5}
              className="flex items-center space-x-2 h-9 px-3"
              title={
                shortlistedCandidates.length === 5
                  ? "Export your team data"
                  : "Select 5 candidates to export"
              }
            >
              <FileText className="h-4 w-4" />
              <span>Export PDF</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
