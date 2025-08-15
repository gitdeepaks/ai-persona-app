'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, CheckCheck, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  content: string;
  isUser: boolean;
  timestamp: Date;
  avatar?: string;
  initials?: string;
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'error';
  isTyping?: boolean;
  className?: string;
}

export function MessageBubble({
  content,
  isUser,
  timestamp,
  avatar,
  initials,
  status = 'sent',
  isTyping = false,
  className,
}: MessageBubbleProps) {
  const getStatusIcon = () => {
    switch (status) {
      case 'sending':
        return <Clock className="w-3 h-3 text-gray-400" />;
      case 'sent':
        return <Check className="w-3 h-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      case 'error':
        return <AlertCircle className="w-3 h-3 text-red-500" />;
      default:
        return null;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isTyping) {
    return (
      <div
        className={cn(
          'flex gap-3 md:gap-4 justify-start fade-in-up',
          className
        )}
      >
        <Avatar className="h-8 w-8 md:h-10 md:w-10 mt-2 ring-2 ring-white/50 dark:ring-gray-600/50">
          <AvatarImage src={avatar} alt="Typing" className="object-cover" />
          <AvatarFallback className="gradient-bg text-white font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="glass-effect rounded-2xl md:rounded-3xl px-4 md:px-6 py-3 md:py-4 shadow-lg">
          <div className="flex gap-1.5 md:gap-2">
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full typing-dot"></div>
            <div
              className="w-2.5 h-2.5 md:w-3 md:h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full typing-dot"
              style={{ animationDelay: '0.1s' }}
            ></div>
            <div
              className="w-2.5 h-2.5 md:w-3 md:h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full typing-dot"
              style={{ animationDelay: '0.2s' }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex gap-3 md:gap-4 fade-in-up',
        isUser ? 'justify-end' : 'justify-start',
        className
      )}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 md:h-10 md:w-10 mt-2 ring-2 ring-white/50 dark:ring-gray-600/50">
          <AvatarImage src={avatar} alt="Avatar" className="object-cover" />
          <AvatarFallback className="gradient-bg text-white font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn('max-w-[75%] md:max-w-[70%]', isUser ? 'order-1' : '')}
      >
        <div
          className={cn(
            'rounded-2xl md:rounded-3xl px-4 md:px-6 py-3 md:py-4 message-bubble shadow-lg relative overflow-hidden',
            isUser
              ? 'gradient-bg text-white ml-auto'
              : 'glass-effect text-gray-900 dark:text-white'
          )}
        >
          {/* Message content */}
          <p className="text-sm leading-relaxed font-medium relative z-10">
            {content}
          </p>

          {/* Message bubble effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

          {/* Hover effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>

        {/* Message metadata */}
        <div className="flex items-center gap-2 md:gap-3 mt-1 md:mt-2 px-2 md:px-3">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            {formatTime(timestamp)}
          </span>
          {isUser && (
            <div className="flex items-center gap-1">{getStatusIcon()}</div>
          )}
        </div>
      </div>
    </div>
  );
}

// Quick reply component for common responses
interface QuickReplyProps {
  options: string[];
  onSelect: (option: string) => void;
  className?: string;
}

export function QuickReplies({
  options,
  onSelect,
  className,
}: QuickReplyProps) {
  return (
    <div className={cn('flex flex-wrap gap-2 mt-4', className)}>
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => onSelect(option)}
          className="px-3 py-2 text-sm bg-white/20 dark:bg-gray-700/20 hover:bg-white/30 dark:hover:bg-gray-700/30 rounded-full border border-white/30 dark:border-gray-600/30 transition-all duration-200 hover:scale-105 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          {option}
        </button>
      ))}
    </div>
  );
}

// Message reaction component
interface MessageReactionProps {
  reactions: { emoji: string; count: number }[];
  onReact: (emoji: string) => void;
  className?: string;
}

export function MessageReactions({
  reactions,
  onReact,
  className,
}: MessageReactionProps) {
  const commonReactions = ['👍', '❤️', '😂', '😮', '😢', '😡'];

  return (
    <div className={cn('flex items-center gap-1 mt-2', className)}>
      {reactions.map((reaction, index) => (
        <button
          key={index}
          onClick={() => onReact(reaction.emoji)}
          className="flex items-center gap-1 px-2 py-1 text-xs bg-white/20 dark:bg-gray-700/20 rounded-full hover:bg-white/30 dark:hover:bg-gray-700/30 transition-all duration-200"
        >
          <span>{reaction.emoji}</span>
          <span className="text-gray-600 dark:text-gray-400">
            {reaction.count}
          </span>
        </button>
      ))}

      {/* Quick reaction buttons */}
      <div className="flex gap-1 ml-2">
        {commonReactions.map((emoji, index) => (
          <button
            key={index}
            onClick={() => onReact(emoji)}
            className="w-6 h-6 text-sm hover:scale-110 transition-transform duration-200 opacity-60 hover:opacity-100"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
