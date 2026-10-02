"use client";

import { Send, Bot, User, Sparkles, BookOpen, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

type Message = { role: 'user' | 'assistant', content: string };

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const userMsg = { role: 'user' as const, content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });

      if (!response.body) throw new Error("No response body");

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          setMessages(prev => {
            const last = prev[prev.length - 1];
            return [...prev.slice(0, -1), { ...last, content: last.content + chunk }];
          });
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    "Explain 3NF in simple words.",
    "Find notes about probability distributions.",
    "Give me practice questions for DBMS Unit 3.",
    "Give me a 7-day study plan."
  ];

  return (
    <div className="flex flex-col h-[600px]">
      <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-8">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <BrainCircuit className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">How can I help you study today?</h2>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                I can summarize your college notes, generate practice questions, or explain complex syllabus topics using our verified repository.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
              {suggestions.map((suggestion, i) => (
                <button 
                  key={i} 
                  onClick={() => setInput(suggestion)}
                  className="p-3 text-sm text-left bg-muted/30 border border-border rounded-xl hover:bg-muted/60 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, index) => (
            <div key={index} className={`flex gap-4 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-5 py-4 ${m.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-muted/40 border border-border rounded-tl-sm'}`}>
                {m.role === 'user' ? (
                  <p className="whitespace-pre-wrap">{m.content || ''}</p>
                ) : (
                  <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-muted/80">
                    <ReactMarkdown>{m.content || ''}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        
        {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
          <div className="flex gap-4 justify-start">
             <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              </div>
              <div className="bg-muted/40 border border-border rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-background border-t">
        <form onSubmit={handleSubmit} className="relative flex items-center max-w-3xl mx-auto">
          <input
            value={input || ''}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AGNES anything..."
            aria-label="Ask AGNES anything"
            className="w-full h-14 pl-4 pr-14 rounded-full border border-input bg-muted/20 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
          <Button 
            type="submit" 
            size="icon" 
            aria-label="Send message"
            disabled={isLoading || !input || String(input).trim() === ''}
            className="absolute right-2 w-10 h-10 rounded-full"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
