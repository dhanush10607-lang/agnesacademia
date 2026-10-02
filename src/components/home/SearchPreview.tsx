import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export function SearchPreview() {
  return (
    <section className="py-20 md:py-32 bg-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10 mix-blend-overlay"></div>
      <div className="container px-4 md:px-8 mx-auto relative z-10 text-center">
        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">Find Exactly What You Need</h2>
        <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-10 text-lg">
          Search across thousands of notes, papers, and subjects instantly.
        </p>
        <div className="max-w-2xl mx-auto relative">
          <div className="flex relative items-center">
            <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="Search notes, question papers, subjects..." 
              className="h-14 pl-12 pr-32 rounded-full bg-background text-foreground border-0 shadow-lg text-lg focus-visible:ring-2 focus-visible:ring-white/20"
              disabled
            />
            <Button className="absolute right-1.5 h-11 rounded-full px-6 bg-primary hover:bg-primary/90 text-primary-foreground">
              Search
            </Button>
          </div>
          {/* Sample Suggestions */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            <span className="text-sm px-3 py-1 bg-white/10 rounded-full cursor-pointer hover:bg-white/20 transition-colors">Data Structures PDF</span>
            <span className="text-sm px-3 py-1 bg-white/10 rounded-full cursor-pointer hover:bg-white/20 transition-colors">Sem 4 Physics</span>
            <span className="text-sm px-3 py-1 bg-white/10 rounded-full cursor-pointer hover:bg-white/20 transition-colors">Business Law 2023</span>
          </div>
        </div>
      </div>
    </section>
  );
}
