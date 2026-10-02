import Link from "next/link";
import { FileSearch, Home, Search, HelpCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center mb-6">
        <FileSearch className="w-10 h-10 text-muted-foreground/60" />
      </div>
      <h1 className="text-6xl font-heading font-extrabold text-primary mb-3">404</h1>
      <h2 className="text-xl md:text-2xl font-bold mb-3">Page Not Found</h2>
      <p className="text-muted-foreground max-w-md mb-2 leading-relaxed">
        The page you're looking for doesn't exist, or may have been moved.
      </p>
      <p className="text-muted-foreground text-sm max-w-sm mb-8">
        Try searching for what you need, or go back to the homepage.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          <Home className="w-4 h-4" /> Go Home
        </Link>
        <Link
          href="/search"
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-border bg-background rounded-xl text-sm font-semibold hover:bg-muted transition-colors"
        >
          <Search className="w-4 h-4" /> Search Resources
        </Link>
        <Link
          href="/help"
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-border bg-background rounded-xl text-sm font-semibold hover:bg-muted transition-colors"
        >
          <HelpCircle className="w-4 h-4" /> Help
        </Link>
      </div>
    </div>
  );
}
