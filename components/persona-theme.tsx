'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface PersonaTheme {
  name: string;
  primaryGradient: string;
  secondaryGradient: string;
  accentGradient: string;
  bubbleGradient: string;
  backgroundGradient: string;
  avatarBorder: string;
  typingColor: string;
  quickReplies: string[];
  personality: {
    greeting: string;
    typingSpeed: number;
    responseStyle: 'detailed' | 'concise' | 'casual';
  };
}

const personaThemes: Record<string, PersonaTheme> = {
  hitesh: {
    name: 'Hitesh Choudhary',
    primaryGradient: 'from-blue-500 to-purple-600',
    secondaryGradient: 'from-indigo-400 to-blue-500',
    accentGradient: 'from-cyan-400 to-blue-500',
    bubbleGradient: 'from-blue-500/90 to-purple-600/90',
    backgroundGradient: 'from-blue-50 via-indigo-50 to-purple-50',
    avatarBorder: 'ring-blue-400/50',
    typingColor: 'from-blue-400 to-purple-400',
    quickReplies: [
      'Haan ji, bilkul!',
      'Dekho yaar...',
      'Main batata hun...',
      'Bohot easy hai',
      'Samjhe na?',
      'Chalo, main help karta hun',
    ],
    personality: {
      greeting:
        'Haan Ji!, Kaise hai aap sabhi, umeed hai chai ka maza to le hi rahe honge, code ki tention mat lena wo hum karwa denge, kaise help kar sakte hai appki aaj?',
      typingSpeed: 80,
      responseStyle: 'detailed',
    },
  },
  piyush: {
    name: 'Piyush Garg',
    primaryGradient: 'from-green-500 to-emerald-600',
    secondaryGradient: 'from-teal-400 to-green-500',
    accentGradient: 'from-emerald-400 to-teal-500',
    bubbleGradient: 'from-green-500/90 to-emerald-600/90',
    backgroundGradient: 'from-green-50 via-emerald-50 to-teal-50',
    avatarBorder: 'ring-green-400/50',
    typingColor: 'from-green-400 to-emerald-400',
    quickReplies: [
      'Bhai, ye toh bilkul simple hai...',
      'Dekho, main aapko explain karta hun...',
      'Ye concept samajhne ke liye...',
      'Aap ye try karo!',
      'Ye toh basic hai yaar...',
      'Let me break this down for you...',
    ],
    personality: {
      greeting:
        "Hey there! 👋 I'm Piyush Garg, your full-stack mentor and fellow developer. What would you like to work on today?",
      typingSpeed: 70,
      responseStyle: 'casual',
    },
  },
};

interface PersonaThemeContextType {
  currentPersona: string;
  theme: PersonaTheme;
  setPersona: (persona: string) => void;
}

const PersonaThemeContext = createContext<PersonaThemeContextType | undefined>(
  undefined
);

export function PersonaThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentPersona, setCurrentPersona] = useState('hitesh');

  const theme = personaThemes[currentPersona] || personaThemes.hitesh;

  const setPersona = (persona: string) => {
    setCurrentPersona(persona);
    // Update CSS custom properties for dynamic theming
    const root = document.documentElement;
    const newTheme = personaThemes[persona] || personaThemes.hitesh;

    root.style.setProperty('--persona-primary', newTheme.primaryGradient);
    root.style.setProperty('--persona-secondary', newTheme.secondaryGradient);
    root.style.setProperty('--persona-accent', newTheme.accentGradient);
    root.style.setProperty('--persona-bubble', newTheme.bubbleGradient);
    root.style.setProperty('--persona-background', newTheme.backgroundGradient);
  };

  useEffect(() => {
    setPersona(currentPersona);
  }, [currentPersona]);

  return (
    <PersonaThemeContext.Provider value={{ currentPersona, theme, setPersona }}>
      {children}
    </PersonaThemeContext.Provider>
  );
}

export function usePersonaTheme() {
  const context = useContext(PersonaThemeContext);
  if (context === undefined) {
    throw new Error(
      'usePersonaTheme must be used within a PersonaThemeProvider'
    );
  }
  return context;
}

// Persona-specific styled components
export function PersonaAvatar({
  src,
  alt,
  initials,
  className,
}: {
  src?: string;
  alt: string;
  initials: string;
  className?: string;
}) {
  const { theme } = usePersonaTheme();

  return (
    <div className={cn('relative', className)}>
      <div
        className={cn('w-full h-full rounded-full ring-2', theme.avatarBorder)}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full rounded-full object-cover"
        />
        {!src && (
          <div
            className={cn(
              'w-full h-full rounded-full flex items-center justify-center text-white font-semibold',
              `bg-gradient-to-br ${theme.primaryGradient}`
            )}
          >
            {initials}
          </div>
        )}
      </div>
    </div>
  );
}

export function PersonaMessageBubble({
  children,
  isUser,
  className,
}: {
  children: React.ReactNode;
  isUser: boolean;
  className?: string;
}) {
  const { theme } = usePersonaTheme();

  return (
    <div
      className={cn(
        'rounded-2xl md:rounded-3xl px-4 md:px-6 py-3 md:py-4 shadow-lg relative overflow-hidden',
        isUser
          ? `bg-gradient-to-br ${theme.bubbleGradient} text-white`
          : 'glass-effect text-gray-900 dark:text-white',
        className
      )}
    >
      {children}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
    </div>
  );
}

export function PersonaTypingIndicator({ className }: { className?: string }) {
  const { theme } = usePersonaTheme();

  return (
    <div className={cn('flex gap-1.5 md:gap-2', className)}>
      <div
        className={cn(
          'w-2.5 h-2.5 md:w-3 md:h-3 rounded-full typing-dot',
          `bg-gradient-to-r ${theme.typingColor}`
        )}
      ></div>
      <div
        className={cn(
          'w-2.5 h-2.5 md:w-3 md:h-3 rounded-full typing-dot',
          `bg-gradient-to-r ${theme.typingColor}`
        )}
        style={{ animationDelay: '0.1s' }}
      ></div>
      <div
        className={cn(
          'w-2.5 h-2.5 md:w-3 md:h-3 rounded-full typing-dot',
          `bg-gradient-to-r ${theme.typingColor}`
        )}
        style={{ animationDelay: '0.2s' }}
      ></div>
    </div>
  );
}

export function PersonaQuickReplies({
  onSelect,
  className,
}: {
  onSelect: (reply: string) => void;
  className?: string;
}) {
  const { theme } = usePersonaTheme();

  return (
    <div className={cn('flex flex-wrap gap-2 mt-4', className)}>
      {theme.quickReplies.map((reply, index) => (
        <button
          key={index}
          onClick={() => onSelect(reply)}
          className={cn(
            'px-3 py-2 text-sm rounded-full border transition-all duration-200 hover:scale-105',
            'bg-white/20 dark:bg-gray-700/20 hover:bg-white/30 dark:hover:bg-gray-700/30',
            'border-white/30 dark:border-gray-600/30',
            'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          )}
        >
          {reply}
        </button>
      ))}
    </div>
  );
}
