'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChatStore } from '@/lib/stores/chat-store';
import { useTripStore } from '@/lib/stores/trip-store';
import { ChatMessage } from './chat-message';
import { TypingIndicator } from './typing-indicator';
import { OptionData } from './option-card';
import { createTripContext, PlannedItemType } from '@/lib/types/trip';

interface ChatInterfaceProps {
  tripId: string;
}

export function ChatInterface({ tripId }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const hasTriggeredGreeting = useRef(false);
  const { messages, isLunaTyping, addMessage, setLunaTyping, setCurrentTrip, needsInitialGreeting, replaceInitialGreeting } = useChatStore();
  const { trips, addPlannedItem } = useTripStore();

  // Get the current trip
  const trip = trips.find((t) => t.id === tripId);

  // Set current trip in chat store when trip changes
  useEffect(() => {
    if (trip) {
      hasTriggeredGreeting.current = false; // Reset for new trip
      setCurrentTrip(tripId, trip.destination);
    }
  }, [tripId, trip?.destination, setCurrentTrip]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isLunaTyping]);

  // Generate initial greeting from AI when trip is first loaded
  useEffect(() => {
    const generateInitialGreeting = async () => {
      // Prevent duplicate calls
      if (!trip || !needsInitialGreeting() || hasTriggeredGreeting.current) return;
      hasTriggeredGreeting.current = true;

      setLunaTyping(true);
      setIsLoading(true);

      const tripContext = createTripContext(trip);

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [
              {
                role: 'user',
                content: '[SYSTEM: User just started planning their trip. Give them a warm, personalized greeting! Share 1-2 interesting facts about their destination and ask a discovery question based on their interests to understand what kind of experience they want.]',
              },
            ],
            tripContext,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to get response');
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let accumulatedText = '';

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('0:')) {
                try {
                  const data = JSON.parse(line.slice(2));
                  if (data) {
                    accumulatedText += data;
                  }
                } catch {
                  // Skip invalid JSON
                }
              }
            }
          }
        }

        replaceInitialGreeting(accumulatedText || "Hi! I'm Luna, excited to help you plan your trip!");
      } catch (error) {
        console.error('Initial greeting error:', error);
        replaceInitialGreeting("Hi! I'm Luna, your travel guide. I'd love to help you plan an amazing trip! What kind of experience are you hoping for?");
      } finally {
        setLunaTyping(false);
        setIsLoading(false);
      }
    };

    generateInitialGreeting();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trip?.id]);

  const sendMessage = useCallback(async (userMessage: string) => {
    if (isLoading || !trip) return;

    // Add user message to store
    addMessage({
      sender: 'user',
      content: userMessage,
      type: 'text',
    });

    // Set Luna typing
    setLunaTyping(true);
    setIsLoading(true);

    // Build trip context for the AI
    const tripContext = createTripContext(trip);

    // Send to AI API
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            ...messages.map((m) => ({
              role: m.sender === 'user' ? 'user' : 'assistant',
              content: m.content,
            })),
            {
              role: 'user',
              content: userMessage,
            },
          ],
          tripContext,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('0:')) {
              try {
                const data = JSON.parse(line.slice(2));
                if (data) {
                  accumulatedText += data;
                }
              } catch {
                // Skip invalid JSON
              }
            }
          }
        }
      }

      // Add Luna's response
      addMessage({
        sender: 'luna',
        content: accumulatedText || "I received your message!",
        type: 'text',
      });
    } catch (error) {
      console.error('Chat error:', error);
      addMessage({
        sender: 'luna',
        content: "I apologize, but I'm having trouble connecting right now. Please make sure your Anthropic API key is configured in .env.local",
        type: 'text',
      });
    } finally {
      setLunaTyping(false);
      setIsLoading(false);
    }
  }, [messages, isLoading, addMessage, setLunaTyping, trip]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input;
    setInput('');
    await sendMessage(userMessage);
  };

  // Parse price from string like "$1,287/person" to number
  const parsePrice = (priceString: string): number => {
    const match = priceString.match(/\$?([\d,]+)/);
    if (match) {
      return parseInt(match[1].replace(/,/g, ''), 10);
    }
    return 0;
  };

  const handleSelectOption = useCallback((option: OptionData) => {
    // Track selection for this option type
    setSelectedOptions((prev) => ({ ...prev, [option.type]: option.id }));

    // Add to planned items in trip store
    if (trip) {
      addPlannedItem(tripId, {
        type: option.type as PlannedItemType,
        provider: option.title.split(' ')[0] || option.title, // Get airline/hotel name
        title: option.title,
        subtitle: option.subtitle,
        details: {
          rawDetails: option.details,
        },
        price: parsePrice(option.price),
        tag: option.tag,
        // For hotels, include nights if specified in the option
        ...(option.type === 'hotel' && option.nights ? { nights: option.nights } : {}),
      });
    }

    // Send selection to Luna with nights info for hotels
    let selectionMessage = `I'll take the ${option.title} (${option.tag || option.type})`;
    if (option.type === 'hotel' && option.nights) {
      selectionMessage += ` for ${option.nights} nights`;
    }
    sendMessage(selectionMessage);
  }, [sendMessage, trip, tripId, addPlannedItem]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Get the most recent selected option ID for a message
  const getSelectedOptionId = (messageIndex: number) => {
    // Find what type of options are in this message and return the selected ID
    const message = messages[messageIndex];
    if (!message) return undefined;

    // Check if message has flight options
    if (message.content.includes('"type":"flight"')) {
      return selectedOptions.flight;
    }
    if (message.content.includes('"type":"hotel"')) {
      return selectedOptions.hotel;
    }
    if (message.content.includes('"type":"activity"')) {
      return selectedOptions.activity;
    }
    return undefined;
  };

  if (!trip) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Trip not found</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4"
      >
        {messages
          .filter((m) => m.content !== '__INITIAL_GREETING__')
          .map((message, index) => (
            <ChatMessage
              key={message.id}
              message={message}
              onSelectOption={handleSelectOption}
              selectedOptionId={getSelectedOptionId(index)}
            />
          ))}
        {isLunaTyping && <TypingIndicator />}
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-background p-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message to Luna..."
            className="h-12 flex-1"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="h-12 w-12 shrink-0"
            size="icon"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Press Enter to send • Click option cards to select
        </p>
      </div>
    </div>
  );
}
