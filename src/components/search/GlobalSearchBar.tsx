"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getRecentSearches, clearSearchHistory, saveSearchQuery } from "@/app/actions/search";

export function GlobalSearchBar({ initialQuery = "", className = "", hiddenInputs = {} }: { initialQuery?: string, className?: string, hiddenInputs?: Record<string, string> }) {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Debounce setup
  useEffect(() => {
    if (query.trim().length < 2) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const delay = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setSuggestions(data.suggestions || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

  // Fetch recent searches
  useEffect(() => {
    getRecentSearches().then(res => setRecentSearches(res));
  }, []);

  // Handle outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClearHistory = async (e: React.MouseEvent) => {
    e.preventDefault();
    await clearSearchHistory();
    setRecentSearches([]);
  };

  const showDropdown = isFocused && (query.length > 0 ? (suggestions.length > 0 || isLoading) : recentSearches.length > 0);

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <form action="/search" method="GET" onSubmit={() => saveSearchQuery(query)} suppressHydrationWarning>
        {Object.entries(hiddenInputs).map(([k, v]) => (
          <input key={k} type="hidden" name={k} value={v} suppressHydrationWarning />
        ))}
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input 
          name="q" 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search notes, subjects, question papers, topics..." 
          className="w-full h-14 pl-12 pr-4 rounded-xl border-2 border-primary/20 bg-card focus:border-primary focus:ring-0 text-lg shadow-sm transition-all"
          autoComplete="off"
          suppressHydrationWarning
        />
        <button type="submit" suppressHydrationWarning className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
          Search
        </button>
      </form>

      {/* Autocomplete Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
          
          {query.length > 0 ? (
            <div className="py-2">
              {isLoading ? (
                <div className="px-4 py-3 text-sm text-muted-foreground">Searching...</div>
              ) : suggestions.length > 0 ? (
                suggestions.map(s => (
                  <Link 
                    key={s.id + s.item_type} 
                    href={`/search?q=${encodeURIComponent(s.title)}`}
                    onClick={() => { saveSearchQuery(s.title); setIsFocused(false); }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
                  >
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium text-foreground">{s.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {s.item_type.replace('_', ' ')} {s.subject_name ? `• ${s.subject_name}` : ''}
                      </div>
                    </div>
                  </Link>
                ))
              ) : null}
            </div>
          ) : (
            <div className="py-2">
              <div className="px-4 flex justify-between items-center mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recent Searches</span>
                <button onClick={handleClearHistory} className="text-xs text-primary hover:underline">Clear</button>
              </div>
              {recentSearches.map((r, i) => (
                <Link 
                  key={i} 
                  href={`/search?q=${encodeURIComponent(r)}`}
                  onClick={() => setIsFocused(false)}
                  className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{r}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
