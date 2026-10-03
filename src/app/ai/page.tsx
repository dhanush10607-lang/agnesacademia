"use client";

import { AIAssistant } from "@/components/ai/AIAssistant";
import { Sparkles, MessageSquare, HelpCircle, Layers } from "lucide-react";
import { useState } from "react";
import { AIGeneratorForm } from "@/components/ai/AIGeneratorForm";

export default function AIPage() {
  const [activeTab, setActiveTab] = useState<'chat' | 'quiz' | 'flashcards'>('chat');

  return (
    <div className="max-w-5xl mx-auto w-full px-4 py-5 sm:py-8 min-h-[85vh] flex flex-col">
      <div className="mb-5 sm:mb-6 text-center">
        <h1 className="text-3xl sm:text-4xl font-heading font-extrabold flex items-center justify-center gap-3">
          <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-primary" /> Ask AGNES
        </h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">
          Your personal academic AI study assistant. Ask questions, generate flashcards, or summarize notes.
        </p>
      </div>

      <div className="flex justify-center mb-5 sm:mb-6">
        <div className="flex w-full max-w-lg bg-muted/30 p-1 rounded-xl border border-border">
          <button 
            onClick={() => setActiveTab('chat')}
            className={`flex flex-1 min-w-0 flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-1 sm:px-6 py-2 rounded-lg text-xs sm:text-base font-medium transition-colors ${activeTab === 'chat' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <MessageSquare className="w-4 h-4 shrink-0" /> Chat
          </button>
          <button 
            onClick={() => setActiveTab('quiz')}
            className={`flex flex-1 min-w-0 flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-1 sm:px-6 py-2 rounded-lg text-xs sm:text-base font-medium transition-colors ${activeTab === 'quiz' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <HelpCircle className="w-4 h-4 shrink-0" /> Generate Quiz
          </button>
          <button 
            onClick={() => setActiveTab('flashcards')}
            className={`flex flex-1 min-w-0 flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-1 sm:px-6 py-2 rounded-lg text-xs sm:text-base font-medium transition-colors ${activeTab === 'flashcards' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Layers className="w-4 h-4 shrink-0" /> Flashcards
          </button>
        </div>
      </div>
      
      <div className="flex-grow bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {activeTab === 'chat' && <AIAssistant />}
        {activeTab === 'quiz' && <AIGeneratorForm type="quiz" />}
        {activeTab === 'flashcards' && <AIGeneratorForm type="flashcards" />}
      </div>
      
      <p className="text-xs text-center text-muted-foreground mt-6">
        AI-generated responses may contain mistakes. Verify important academic information with official college/faculty resources.
      </p>
    </div>
  );
}
