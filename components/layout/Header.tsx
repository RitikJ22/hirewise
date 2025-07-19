import { Logo } from "@/components/ui/logo";

const Header = () => {
  return (
    <header className="border-b border-border backdrop-blur-sm flex-shrink-0">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Logo size="lg" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Co-pilot</h1>
              <p className="text-muted-foreground">
                AI-powered candidate filtering and selection
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">Live</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
