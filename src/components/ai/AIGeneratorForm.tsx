"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, FileText, CheckCircle2 } from "lucide-react";

export function AIGeneratorForm({ type }: { type: 'quiz' | 'flashcards' }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate generation for now
    setTimeout(() => {
      if (type === 'quiz') {
        setResult("Here are your AI-generated practice questions based on the selected criteria...");
      } else {
        setResult("Here are your AI-generated flashcards...");
      }
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 h-[600px] overflow-y-auto">
      <div className="w-full md:w-1/3 flex-shrink-0">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          {type === 'quiz' ? 'Generate Practice Quiz' : 'Generate Flashcards'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Subject / Topic</label>
            <input type="text" placeholder="e.g., Database Management" required className="w-full p-2 border rounded-md bg-background" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Unit / Chapter</label>
            <input type="text" placeholder="e.g., Unit 3: Normalization" className="w-full p-2 border rounded-md bg-background" />
          </div>
          
          {type === 'quiz' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Difficulty</label>
                <select className="w-full p-2 border rounded-md bg-background">
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Number of Questions</label>
                <input type="number" min="1" max="20" defaultValue="10" className="w-full p-2 border rounded-md bg-background" />
              </div>
            </>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Generating...' : `Generate ${type === 'quiz' ? 'Questions' : 'Flashcards'}`}
          </Button>
        </form>
      </div>

      <div className="w-full md:w-2/3 border-t md:border-t-0 md:border-l border-border pt-6 md:pt-0 md:pl-8">
        {result ? (
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-green-500" /> AI-Generated Material
            </div>
            <div className="prose prose-sm dark:prose-invert">
              <p>{result}</p>
              {/* Dummy content */}
              {type === 'quiz' ? (
                <div className="space-y-4 mt-4">
                  <div className="p-4 bg-muted/30 rounded-lg border">
                    <p className="font-semibold">Q1: Explain what is meant by a Transitive Dependency?</p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg border">
                    <p className="font-semibold">Q2: Why is BCNF considered stronger than 3NF?</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="aspect-[3/2] bg-primary/5 border border-primary/20 rounded-xl p-6 flex items-center justify-center text-center font-medium cursor-pointer hover:bg-primary/10 transition-colors shadow-sm">
                    What is 3NF?
                  </div>
                  <div className="aspect-[3/2] bg-primary/5 border border-primary/20 rounded-xl p-6 flex items-center justify-center text-center font-medium cursor-pointer hover:bg-primary/10 transition-colors shadow-sm">
                    Boyce-Codd Normal Form
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-60">
            <FileText className="w-16 h-16 mb-4" />
            <p>Fill out the form to generate custom {type === 'quiz' ? 'practice questions' : 'flashcards'}.</p>
          </div>
        )}
      </div>
    </div>
  );
}
