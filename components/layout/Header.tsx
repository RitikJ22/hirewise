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
    <header className="border-b border-border backdrop-blur-sm flex-shrink-0">
      <div className="container mx-10 py-2 ">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Logo size="lg" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Co-pilot</h1>
              <p className="text-muted-foreground">
                AI-powered candidate filtering and selection
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleExportClick}
              disabled={shortlistedCandidates.length !== 5}
              className="flex items-center space-x-2"
              title={
                shortlistedCandidates.length === 5
                  ? "Export your team data"
                  : "Select 5 candidates to export"
              }
            >
              <FileText className="h-4 w-4" />
              <span>Export PDF</span>
            </Button>
            {/* <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div> */}
            {/* <span className="text-sm text-muted-foreground">Live</span> */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
