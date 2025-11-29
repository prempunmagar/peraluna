import { ChatMessage as ChatMessageType } from '@/lib/types/chat';
import { format } from 'date-fns';
import { Sparkles, User } from 'lucide-react';
import { OptionCards, OptionData } from './option-card';

interface ChatMessageProps {
  message: ChatMessageType;
  onSelectOption?: (option: OptionData) => void;
  selectedOptionId?: string;
}

// Parse message content to extract options JSON
function parseMessageContent(content: string): {
  beforeText: string;
  options: OptionData[] | null;
  afterText: string;
} {
  const optionsMatch = content.match(/```options\s*([\s\S]*?)```/);

  if (!optionsMatch) {
    return { beforeText: content, options: null, afterText: '' };
  }

  const beforeText = content.slice(0, optionsMatch.index).trim();
  const afterText = content.slice((optionsMatch.index || 0) + optionsMatch[0].length).trim();

  try {
    const options = JSON.parse(optionsMatch[1].trim());
    return { beforeText, options, afterText };
  } catch {
    return { beforeText: content, options: null, afterText: '' };
  }
}

export function ChatMessage({ message, onSelectOption, selectedOptionId }: ChatMessageProps) {
  const isUser = message.sender === 'user';
  const { beforeText, options, afterText } = parseMessageContent(message.content);

  return (
    <div
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} animate-in fade-in slide-in-from-bottom-2 duration-500`}
    >
      {/* Avatar */}
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-gradient-to-br from-accent via-primary to-secondary text-white'
        }`}
      >
        {isUser ? (
          <User className="h-4 w-4" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex flex-col ${isUser ? 'items-end max-w-[70%]' : 'items-start max-w-[85%]'}`}>
        {/* Text before options */}
        {beforeText && (
          <div
            className={`rounded-2xl px-4 py-3 ${
              isUser
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-foreground'
            }`}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{beforeText}</p>
          </div>
        )}

        {/* Option Cards */}
        {options && options.length > 0 && onSelectOption && (
          <div className="w-full mt-3">
            <OptionCards
              options={options}
              onSelect={onSelectOption}
              selectedId={selectedOptionId}
            />
          </div>
        )}

        {/* Text after options */}
        {afterText && (
          <div className="mt-3 rounded-2xl px-4 py-3 bg-muted text-foreground">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{afterText}</p>
          </div>
        )}

        <span className="mt-1 text-xs text-muted-foreground">
          {format(message.timestamp, 'h:mm a')}
        </span>
      </div>
    </div>
  );
}
