import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatMessage } from '@/lib/types/chat';

interface ChatState {
  currentTripId: string | null;
  messages: ChatMessage[];
  isLunaTyping: boolean;
  setCurrentTrip: (tripId: string, tripDestination: string) => void;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  replaceInitialGreeting: (content: string) => void;
  needsInitialGreeting: () => boolean;
  setLunaTyping: (isTyping: boolean) => void;
  clearMessages: () => void;
}

// Flag message to indicate Luna should generate an initial greeting
function getInitialPlaceholder(): ChatMessage {
  return {
    id: 'initial-placeholder',
    sender: 'luna',
    content: '__INITIAL_GREETING__',
    timestamp: new Date(),
    type: 'text',
  };
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      currentTripId: null,
      messages: [],
      isLunaTyping: false,

      setCurrentTrip: (tripId: string, _tripDestination: string) => {
        const current = get().currentTripId;
        // Only reset if switching to a different trip
        if (current !== tripId) {
          set({
            currentTripId: tripId,
            messages: [getInitialPlaceholder()],
          });
        }
      },

      addMessage: (message) =>
        set((state) => ({
          messages: [
            ...state.messages,
            {
              ...message,
              id: Date.now().toString(),
              timestamp: new Date(),
            },
          ],
        })),

      replaceInitialGreeting: (content: string) =>
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === 'initial-placeholder'
              ? { ...msg, id: Date.now().toString(), content }
              : msg
          ),
        })),

      needsInitialGreeting: () => {
        const state = get();
        return state.messages.length === 1 &&
               state.messages[0]?.content === '__INITIAL_GREETING__';
      },

      setLunaTyping: (isTyping) => set({ isLunaTyping: isTyping }),

      clearMessages: () =>
        set({
          messages: [],
          currentTripId: null,
        }),
    }),
    {
      name: 'peraluna-chat',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const parsed = JSON.parse(str);
          // Convert date strings back to Date objects
          if (parsed.state?.messages) {
            parsed.state.messages = parsed.state.messages.map((msg: ChatMessage) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            }));
          }
          return parsed;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);
