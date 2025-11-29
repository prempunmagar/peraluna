'use client';

import { Sparkles } from 'lucide-react';

export function TypingIndicator() {
  return (
    <>
      <style>
        {`
          @keyframes typing-bounce {
            0%, 60%, 100% {
              transform: translateY(0);
              opacity: 0.4;
            }
            30% {
              transform: translateY(-6px);
              opacity: 1;
            }
          }
          .dot-1 { animation: typing-bounce 1.4s infinite ease-in-out; animation-delay: 0s; }
          .dot-2 { animation: typing-bounce 1.4s infinite ease-in-out; animation-delay: 0.2s; }
          .dot-3 { animation: typing-bounce 1.4s infinite ease-in-out; animation-delay: 0.4s; }
        `}
      </style>
      <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
        {/* Luna Avatar */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent via-primary to-secondary text-white animate-pulse">
          <Sparkles className="h-4 w-4" />
        </div>

        {/* Typing bubble */}
        <div className="flex items-center gap-2 rounded-2xl bg-muted px-4 py-3">
          <span className="text-sm text-muted-foreground">Luna is typing</span>
          <div className="flex items-center gap-1">
            <span
              className="dot-1 inline-block rounded-full"
              style={{ width: '6px', height: '6px', backgroundColor: '#7c3aed' }}
            />
            <span
              className="dot-2 inline-block rounded-full"
              style={{ width: '6px', height: '6px', backgroundColor: '#7c3aed' }}
            />
            <span
              className="dot-3 inline-block rounded-full"
              style={{ width: '6px', height: '6px', backgroundColor: '#7c3aed' }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
