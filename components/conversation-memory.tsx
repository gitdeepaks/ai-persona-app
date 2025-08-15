'use client';

import React, { useState, useEffect } from 'react';
import { usePersonaTheme } from './persona-theme';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Brain,
  Clock,
  MessageSquare,
  Lightbulb,
  BookOpen,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';

interface ConversationContext {
  topics: string[];
  userInterests: string[];
  learningLevel: 'beginner' | 'intermediate' | 'advanced';
  preferredLanguage: 'english' | 'hinglish' | 'hindi';
  lastTopics: string[];
  sessionDuration: number;
  messageCount: number;
}

interface ConversationMemoryProps {
  context: ConversationContext;
  onContextUpdate: (context: ConversationContext) => void;
  className?: string;
}

export function ConversationMemory({
  context,
  onContextUpdate,
  className,
}: ConversationMemoryProps) {
  const { theme } = usePersonaTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const updateContext = (updates: Partial<ConversationContext>) => {
    onContextUpdate({ ...context, ...updates });
  };

  const addTopic = (topic: string) => {
    if (!context.topics.includes(topic)) {
      updateContext({
        topics: [...context.topics, topic],
        lastTopics: [topic, ...context.lastTopics.slice(0, 4)],
      });
    }
  };

  const getLearningLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getLanguageColor = (lang: string) => {
    switch (lang) {
      case 'english':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'hinglish':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'hindi':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div
      className={`bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 dark:border-gray-700/20 ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-blue-500" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Conversation Memory
          </h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </Button>
      </div>

      <div className="space-y-3">
        {/* Session Stats */}
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>
              {Math.floor(context.sessionDuration / 60)}m{' '}
              {context.sessionDuration % 60}s
            </span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            <span>{context.messageCount} messages</span>
          </div>
        </div>

        {/* Learning Level */}
        <div className="flex items-center gap-2">
          <Target className="w-3 h-3 text-gray-500" />
          <span className="text-xs text-gray-600 dark:text-gray-400">
            Level:
          </span>
          <Badge
            className={`text-xs ${getLearningLevelColor(
              context.learningLevel
            )}`}
          >
            {context.learningLevel}
          </Badge>
        </div>

        {/* Preferred Language */}
        <div className="flex items-center gap-2">
          <Users className="w-3 h-3 text-gray-500" />
          <span className="text-xs text-gray-600 dark:text-gray-400">
            Language:
          </span>
          <Badge
            className={`text-xs ${getLanguageColor(context.preferredLanguage)}`}
          >
            {context.preferredLanguage}
          </Badge>
        </div>

        {isExpanded && (
          <>
            {/* Recent Topics */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-3 h-3 text-gray-500" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Recent Topics
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {context.lastTopics.slice(0, 5).map((topic, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs bg-white/20 dark:bg-gray-700/20"
                  >
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>

            {/* User Interests */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-3 h-3 text-gray-500" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Interests
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {context.userInterests.slice(0, 6).map((interest, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs border-blue-200 text-blue-700 dark:border-blue-700 dark:text-blue-300"
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 pt-2 border-t border-white/10 dark:border-gray-700/10">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-6 px-2"
                onClick={() => updateContext({ learningLevel: 'beginner' })}
              >
                Beginner
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-6 px-2"
                onClick={() => updateContext({ learningLevel: 'intermediate' })}
              >
                Intermediate
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-6 px-2"
                onClick={() => updateContext({ learningLevel: 'advanced' })}
              >
                Advanced
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Hook for managing conversation context
export function useConversationMemory() {
  const [context, setContext] = useState<ConversationContext>({
    topics: [],
    userInterests: [],
    learningLevel: 'beginner',
    preferredLanguage: 'hinglish',
    lastTopics: [],
    sessionDuration: 0,
    messageCount: 0,
  });

  const updateContext = (updates: Partial<ConversationContext>) => {
    setContext((prev) => ({ ...prev, ...updates }));
  };

  const addMessage = () => {
    updateContext({ messageCount: context.messageCount + 1 });
  };

  const updateSessionDuration = () => {
    updateContext({ sessionDuration: context.sessionDuration + 1 });
  };

  const addTopic = (topic: string) => {
    if (!context.topics.includes(topic)) {
      updateContext({
        topics: [...context.topics, topic],
        lastTopics: [topic, ...context.lastTopics.slice(0, 4)],
      });
    }
  };

  const addInterest = (interest: string) => {
    if (!context.userInterests.includes(interest)) {
      updateContext({
        userInterests: [...context.userInterests, interest],
      });
    }
  };

  // Auto-update session duration
  useEffect(() => {
    const interval = setInterval(updateSessionDuration, 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    context,
    updateContext,
    addMessage,
    addTopic,
    addInterest,
  };
}

// Component for suggesting conversation topics
export function TopicSuggestions({
  onTopicSelect,
  className,
}: {
  onTopicSelect: (topic: string) => void;
  className?: string;
}) {
  const { theme } = usePersonaTheme();

  const suggestions = [
    'React Basics',
    'JavaScript Fundamentals',
    'Node.js Backend',
    'Database Design',
    'API Development',
    'Deployment',
    'Code Review',
    'Best Practices',
    'Project Structure',
    'Testing',
    'Performance',
    'Security',
  ];

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Suggested Topics
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((topic, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onTopicSelect(topic)}
            className="text-xs h-7 px-3 border-white/30 dark:border-gray-600/30 hover:bg-white/20 dark:hover:bg-gray-700/20"
          >
            {topic}
          </Button>
        ))}
      </div>
    </div>
  );
}
