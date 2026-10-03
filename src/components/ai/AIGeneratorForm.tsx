"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, FileText, CheckCircle2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

export function AIGeneratorForm({ type }: { type: 'quiz' | 'flashcards' }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    const formData = new FormData(e.currentTarget);
    const subject = String(formData.get('subject') ?? '').trim();
    const topic = String(formData.get('topic') ?? '').trim();
    const difficulty = String(formData.get('difficulty') ?? 'Medium');
    const count = Number(formData.get('count') ?? 10);

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, subject, topic, difficulty, count }),
      });
      const data: { result?: string; error?: string } = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Could not generate study material. Please try again.');
      }
      if (!data.result) {
        throw new Error('The generator returned an empty response. Please try again.');
      }

      setResult(data.result);
    } catch (generationError) {
      setError(generationError instanceof Error ? generationError.message : 'Could not generate study material. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 h-[min(600px,55dvh)] sm:h-[600px] overflow-y-auto">
      <div className="w-full md:w-1/3 flex-shrink-0">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          {type === 'quiz' ? 'Generate Practice Quiz' : 'Generate Flashcards'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="ai-subject" className="block text-sm font-medium mb-1">Subject</label>
            <input id="ai-subject" name="subject" type="text" placeholder="e.g., Database Management" required maxLength={120} className="w-full p-2 border rounded-md bg-background" />
          </div>
          <div>
            <label htmlFor="ai-topic" className="block text-sm font-medium mb-1">Unit / Chapter / Topic</label>
            <input id="ai-topic" name="topic" type="text" placeholder="e.g., Unit 3: Normalization" maxLength={200} className="w-full p-2 border rounded-md bg-background" />
          </div>
          
          {type === 'quiz' && (
            <div>
              <label htmlFor="ai-difficulty" className="block text-sm font-medium mb-1">Difficulty</label>
              <select id="ai-difficulty" name="difficulty" className="w-full p-2 border rounded-md bg-background" defaultValue="Medium">
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          )}
          <div>
            <label htmlFor="ai-count" className="block text-sm font-medium mb-1">
              Number of {type === 'quiz' ? 'Questions' : 'Flashcards'}
            </label>
            <input id="ai-count" name="count" type="number" min="1" max="20" defaultValue="10" required className="w-full p-2 border rounded-md bg-background" />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Generating...' : `Generate ${type === 'quiz' ? 'Questions' : 'Flashcards'}`}
          </Button>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        </form>
      </div>

      <div className="w-full md:w-2/3 border-t md:border-t-0 md:border-l border-border pt-6 md:pt-0 md:pl-8">
        {result ? (
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-green-500" /> AI-Generated Material
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown>{result}</ReactMarkdown>
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
