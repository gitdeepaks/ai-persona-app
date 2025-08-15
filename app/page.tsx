'use client';

import type React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Send,
  Search,
  Phone,
  Video,
  MoreHorizontal,
  X,
  Bell,
  Calendar,
  FileText,
  Link,
  ImageIcon,
  Paperclip,
  Smile,
  Settings,
  Info,
  Users,
  Sparkles,
  Zap,
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  PersonaThemeProvider,
  usePersonaTheme,
  PersonaAvatar,
  PersonaMessageBubble,
  PersonaTypingIndicator,
  PersonaQuickReplies,
} from '@/components/persona-theme';
import {
  MessageBubble,
  QuickReplies,
  MessageReactions,
} from '@/components/ui/message-bubble';
import {
  ConversationMemory,
  useConversationMemory,
  TopicSuggestions,
} from '@/components/conversation-memory';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'image';
  imageUrl?: string;
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'error';
  reactions?: { emoji: string; count: number }[];
}

interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  isOnline: boolean;
  unreadCount?: number;
}

function ChatApp() {
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedContact, setSelectedContact] = useState('hitesh');
  const [showChatDetails, setShowChatDetails] = useState(false);
  const [showContacts, setShowContacts] = useState(false);
  const [showMemory, setShowMemory] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { theme, setPersona } = usePersonaTheme();
  const { context, updateContext, addMessage, addTopic } =
    useConversationMemory();

  // Ensure component is mounted on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Hide chat details on mobile by default
      if (window.innerWidth < 768) {
        setShowChatDetails(false);
        setShowContacts(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize messages on client side to prevent hydration mismatch
  useEffect(() => {
    const getInitialMessage = () => {
      return theme.personality.greeting;
    };

    setMessages([
      {
        id: '1',
        content: getInitialMessage(),
        isUser: false,
        timestamp: new Date(),
        status: 'read',
      },
    ]);
  }, [selectedContact, theme.personality.greeting]);

  // Update persona when contact changes
  useEffect(() => {
    setPersona(selectedContact);
  }, [selectedContact, setPersona]);

  // Mock contacts data
  const contacts: Contact[] = [
    {
      id: 'hitesh',
      name: 'Hitesh Choudhary',
      avatar:
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images-SVZkVpIgJRQjAFshcQjSTb8zXq3pva.jpeg',
      lastMessage: 'Namaste! Main Hitesh hun, aapka tech mentor...',
      timestamp: '4 m',
      isOnline: true,
      unreadCount: 2,
    },
    {
      id: 'piyush',
      name: 'Piyush Garg',
      avatar: 'https://avatars.githubusercontent.com/u/44976328?v=4',
      lastMessage: "Hey there! 👋 I'm Piyush, your full-stack mentor...",
      timestamp: '2 m',
      isOnline: true,
      unreadCount: 1,
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content: input,
      isUser: true,
      timestamp: new Date(),
      status: 'sending',
    };

    setMessages((prev) => [...prev, userMessage]);
    addMessage();
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    try {
      const apiMessages = messages.map((msg) => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.content,
      }));

      apiMessages.push({
        role: 'user',
        content: currentInput,
      });

      const apiEndpoint =
        selectedContact === 'piyush' ? '/api/chat/piyush' : '/api/chat/hitesh';
      console.log(`Sending request to ${apiEndpoint}`);
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: apiMessages }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API error response:', errorData);
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log('Received response data');

      const botMessage: Message = {
        id: `bot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content:
          data.message || "Sorry, I couldn't process that. Please try again!",
        isUser: false,
        timestamp: new Date(),
        status: 'sent',
      };

      setMessages((prev) => [...prev, botMessage]);

      // Update message status to delivered after a short delay
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === userMessage.id
              ? { ...msg, status: 'delivered' as const }
              : msg
          )
        );
      }, 1000);

      // Update message status to read after another delay
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === userMessage.id
              ? { ...msg, status: 'read' as const }
              : msg
          )
        );
      }, 2000);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content:
          error instanceof Error && error.message.includes('API key')
            ? 'Arre yaar, OpenAI API key configure nahi hai. Environment variables check karo!'
            : 'Arre yaar, kuch technical issue aa gaya hai. Thoda wait karo aur phir try karo!',
        isUser: false,
        timestamp: new Date(),
        status: 'error',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickReply = (reply: string) => {
    setInput(reply);
    handleSend();
  };

  const handleTopicSelect = (topic: string) => {
    addTopic(topic);
    setInput(`Can you help me with ${topic}?`);
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              reactions: [...(msg.reactions || []), { emoji, count: 1 }],
            }
          : msg
      )
    );
  };

  const currentContact = contacts.find((c) => c.id === selectedContact);

  // Function to get contact details for sidebar
  const getContactDetails = (contactId: string) => {
    switch (contactId) {
      case 'hitesh':
        return {
          name: 'Hitesh Choudhary',
          avatar:
            'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images-SVZkVpIgJRQjAFshcQjSTb8zXq3pva.jpeg',
          title: 'Tech Mentor & Developer',
          initials: 'HC',
          photosCount: '105',
          filesSize: '1.3M',
          linksCount: '32',
          sharedFile: 'Contract for the provision of printing services',
          sharedLink: 'Economic Policy',
          sharedLinkUrl: 'https://vm.tiktok.com/economic-policy',
        };
      case 'piyush':
        return {
          name: 'Piyush Garg',
          avatar: 'https://avatars.githubusercontent.com/u/44976328?v=4',
          title: 'Full-stack Engineer & Educator',
          initials: 'PG',
          photosCount: '87',
          filesSize: '2.1M',
          linksCount: '45',
          sharedFile: 'React Best Practices Guide',
          sharedLink: 'Teachyst Platform',
          sharedLinkUrl: 'https://teachyst.com',
        };
      default:
        return {
          name: 'Unknown Contact',
          avatar: '/placeholder.svg',
          title: 'Contact',
          initials: 'UC',
          photosCount: '0',
          filesSize: '0B',
          linksCount: '0',
          sharedFile: 'No files shared',
          sharedLink: 'No links shared',
          sharedLinkUrl: '#',
        };
    }
  };

  const contactDetails = getContactDetails(selectedContact);

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="h-screen gradient-bg flex items-center justify-center">
        <div className="glass-effect rounded-2xl p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 gradient-bg-accent rounded-full flex items-center justify-center floating">
            <div className="w-8 h-8 bg-white rounded-full"></div>
          </div>
          <h2 className="text-white text-xl font-semibold mb-2">
            Loading Chat
          </h2>
          <div className="flex justify-center gap-1">
            <div className="w-2 h-2 bg-white rounded-full typing-dot"></div>
            <div className="w-2 h-2 bg-white rounded-full typing-dot"></div>
            <div className="w-2 h-2 bg-white rounded-full typing-dot"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`h-screen bg-gradient-to-br ${theme.backgroundGradient} dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex relative overflow-hidden`}
    >
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl floating"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-400/20 to-orange-400/20 rounded-full blur-3xl floating"
          style={{ animationDelay: '1s' }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl floating"
          style={{ animationDelay: '2s' }}
        ></div>
      </div>

      {/* Left Sidebar - Contacts */}
      <div className="w-80 glass-effect border-r border-white/20 dark:border-gray-700/50 flex flex-col relative z-10 md:flex">
        {/* Header */}
        <div className="p-6 border-b border-white/20 dark:border-gray-700/50">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center pulse-glow">
              <span className="text-white font-bold text-lg">CH</span>
            </div>
            <div>
              <h1 className="text-gray-900 dark:text-white font-bold text-xl gradient-text">
                Chats
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Connect with AI mentors
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-400" />
            <Input
              placeholder="Search conversations..."
              className="bg-white/50 dark:bg-gray-700/50 border-white/30 dark:border-gray-600/50 text-gray-900 dark:text-white pl-12 h-12 rounded-xl backdrop-blur-sm focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
            />
          </div>
        </div>

        {/* Navigation Icons */}
        <div className="flex items-center justify-between p-6 border-b border-white/20 dark:border-gray-700/50">
          <div className="flex gap-6">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 gradient-bg-accent rounded-xl flex items-center justify-center hover-lift cursor-pointer">
                <Bell className="h-5 w-5 text-white" />
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                AI chats
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-400 rounded-xl flex items-center justify-center hover-lift cursor-pointer">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                Work
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-400 rounded-xl flex items-center justify-center hover-lift cursor-pointer">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                Calendar
              </span>
            </div>
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {contacts.map((contact, index) => (
            <div
              key={contact.id}
              onClick={() => setSelectedContact(contact.id)}
              className={`p-4 rounded-2xl cursor-pointer hover-lift transition-all duration-300 ${
                selectedContact === contact.id
                  ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 dark:border-blue-400/20 shadow-lg'
                  : 'bg-white/30 dark:bg-gray-700/30 hover:bg-white/50 dark:hover:bg-gray-700/50'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-14 w-14 ring-2 ring-white/50 dark:ring-gray-600/50">
                    <AvatarImage
                      src={contact.avatar || '/placeholder.svg'}
                      alt={contact.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="gradient-bg text-white font-semibold">
                      {contact.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  {contact.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full border-3 border-white dark:border-gray-800 glow-green"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-gray-900 dark:text-white font-semibold truncate">
                      {contact.name}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {contact.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 truncate leading-relaxed">
                    {contact.lastMessage}
                  </p>
                </div>
                {contact.unreadCount && (
                  <Badge className="gradient-bg text-white text-xs min-w-[24px] h-6 flex items-center justify-center rounded-full font-semibold pulse-glow">
                    {contact.unreadCount}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Chat Header */}
        <div className="glass-effect border-b border-white/20 dark:border-gray-700/50 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 md:gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowContacts(!showContacts)}
                className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/30 dark:bg-gray-700/30 hover:bg-white/50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300 md:hidden"
              >
                <Users className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
              <Avatar className="h-12 w-12 md:h-14 md:w-14 ring-2 ring-white/50 dark:ring-gray-600/50">
                <AvatarImage
                  src={currentContact?.avatar || '/placeholder.svg'}
                  alt={currentContact?.name}
                  className="object-cover"
                />
                <AvatarFallback className="gradient-bg text-white font-semibold">
                  {currentContact?.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-gray-900 dark:text-white font-bold text-lg md:text-xl">
                  {currentContact?.name}
                </h2>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full glow-green"></div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                    Online • 10 members, 23 active
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMemory(!showMemory)}
                className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/30 dark:bg-gray-700/30 hover:bg-white/50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300"
              >
                <Sparkles className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/30 dark:bg-gray-700/30 hover:bg-white/50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300"
              >
                <Search className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/30 dark:bg-gray-700/30 hover:bg-white/50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300"
              >
                <Phone className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/30 dark:bg-gray-700/30 hover:bg-white/50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300"
              >
                <Video className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowChatDetails(!showChatDetails)}
                className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/30 dark:bg-gray-700/30 hover:bg-white/50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300 md:hidden"
              >
                <Info className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/30 dark:bg-gray-700/30 hover:bg-white/50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300"
              >
                <MoreHorizontal className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
          {messages.map((message, index) => (
            <div key={message.id} style={{ animationDelay: `${index * 0.1}s` }}>
              <MessageBubble
                content={message.content}
                isUser={message.isUser}
                timestamp={message.timestamp}
                avatar={
                  !message.isUser
                    ? selectedContact === 'piyush'
                      ? 'https://avatars.githubusercontent.com/u/44976328?v=4'
                      : 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images-SVZkVpIgJRQjAFshcQjSTb8zXq3pva.jpeg'
                    : undefined
                }
                initials={
                  !message.isUser
                    ? selectedContact === 'piyush'
                      ? 'PG'
                      : 'HC'
                    : undefined
                }
                status={message.status}
                className="fade-in-up"
              />

              {/* Message reactions */}
              {message.reactions && message.reactions.length > 0 && (
                <MessageReactions
                  reactions={message.reactions}
                  onReact={(emoji) => handleReaction(message.id, emoji)}
                  className="ml-12"
                />
              )}

              {/* Quick replies for bot messages */}
              {!message.isUser && index === messages.length - 1 && (
                <PersonaQuickReplies
                  onSelect={handleQuickReply}
                  className="ml-12 mt-2"
                />
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 md:gap-4 justify-start fade-in-up">
              <Avatar className="h-8 w-8 md:h-10 md:w-10 mt-2 ring-2 ring-white/50 dark:ring-gray-600/50">
                <AvatarImage
                  src={
                    selectedContact === 'piyush'
                      ? 'https://avatars.githubusercontent.com/u/44976328?v=4'
                      : 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images-SVZkVpIgJRQjAFshcQjSTb8zXq3pva.jpeg'
                  }
                  alt={selectedContact === 'piyush' ? 'Piyush' : 'Hitesh'}
                  className="object-cover"
                />
                <AvatarFallback className="gradient-bg text-white font-semibold">
                  {selectedContact === 'piyush' ? 'PG' : 'HC'}
                </AvatarFallback>
              </Avatar>
              <div className="glass-effect rounded-2xl md:rounded-3xl px-4 md:px-6 py-3 md:py-4 shadow-lg">
                <PersonaTypingIndicator />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="glass-effect border-t border-white/20 dark:border-gray-700/50 p-4 md:p-6">
          <div className="flex items-center gap-3 md:gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/30 dark:bg-gray-700/30 hover:bg-white/50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300"
            >
              <Paperclip className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="bg-white/50 dark:bg-gray-700/50 border-white/30 dark:border-gray-600/50 text-gray-900 dark:text-white pr-14 md:pr-16 h-12 md:h-14 rounded-xl md:rounded-2xl backdrop-blur-sm focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 text-sm md:text-base"
                disabled={isTyping}
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-xl bg-white/30 dark:bg-gray-700/30 hover:bg-white/50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300"
              >
                <Smile className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </div>
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="w-12 h-12 md:w-14 md:h-14 gradient-bg hover:shadow-lg text-white rounded-xl md:rounded-2xl transition-all duration-300 hover-lift disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Chat Details */}
      {showChatDetails && (
        <div
          className={`${
            isMobile ? 'fixed inset-0 z-50' : 'w-80'
          } glass-effect border-l border-white/20 dark:border-gray-700/50 flex flex-col relative z-10 slide-in`}
        >
          {/* Header */}
          <div className="p-4 md:p-6 border-b border-white/20 dark:border-gray-700/50 flex items-center justify-between">
            <h3 className="text-gray-900 dark:text-white font-bold text-lg md:text-xl gradient-text">
              Chat Details
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowChatDetails(false)}
              className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-white/30 dark:bg-gray-700/30 hover:bg-white/50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300"
            >
              <X className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </div>

          {/* Profile Section */}
          <div className="p-4 md:p-6 border-b border-white/20 dark:border-gray-700/50 text-center">
            <div className="relative mb-4 md:mb-6">
              <Avatar className="h-16 w-16 md:h-20 md:w-20 mx-auto ring-4 ring-white/50 dark:ring-gray-600/50">
                <AvatarImage
                  src={contactDetails.avatar}
                  alt={contactDetails.name}
                  className="object-cover"
                />
                <AvatarFallback className="gradient-bg text-white text-lg md:text-xl font-bold">
                  {contactDetails.initials}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 md:-bottom-2 -right-1 md:-right-2 w-5 h-5 md:w-6 md:h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full border-3 border-white dark:border-gray-800 glow-green"></div>
            </div>
            <h4 className="text-gray-900 dark:text-white font-bold text-lg md:text-xl mb-1">
              {contactDetails.name}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium mb-4 md:mb-6">
              {contactDetails.title}
            </p>
            <div className="flex justify-center gap-2 md:gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/30 dark:bg-gray-700/30 hover:bg-white/50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300"
              >
                <Bell className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/30 dark:bg-gray-700/30 hover:bg-white/50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300"
              >
                <Calendar className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/30 dark:bg-gray-700/30 hover:bg-white/50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300"
              >
                <ImageIcon className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/30 dark:bg-gray-700/30 hover:bg-white/50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300"
              >
                <Settings className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </div>
          </div>

          {/* Photos and Videos */}
          <div className="p-3 md:p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2 md:mb-3">
              <h5 className="text-gray-900 dark:text-white font-medium text-sm md:text-base">
                Photos and Videos
              </h5>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {contactDetails.photosCount}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-400 text-xs"
              >
                See all
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-1.5 md:gap-2">
              <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
          </div>

          {/* Shared Files */}
          <div className="p-3 md:p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2 md:mb-3">
              <h5 className="text-gray-900 dark:text-white font-medium text-sm md:text-base">
                Shared Files
              </h5>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {contactDetails.filesSize}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-400 text-xs"
              >
                See all
              </Button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 md:gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <FileText className="h-6 w-6 md:h-8 md:w-8 text-blue-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm text-gray-900 dark:text-white truncate">
                    {contactDetails.sharedFile}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PDF • 2.3 MB
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Shared Links */}
          <div className="p-3 md:p-4">
            <div className="flex items-center justify-between mb-2 md:mb-3">
              <h5 className="text-gray-900 dark:text-white font-medium text-sm md:text-base">
                Shared Links
              </h5>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {contactDetails.linksCount}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-400 text-xs"
              >
                See all
              </Button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 md:gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-600 rounded flex items-center justify-center">
                  <Link className="h-3 w-3 md:h-4 md:w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm text-gray-900 dark:text-white truncate">
                    {contactDetails.sharedLink}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {contactDetails.sharedLinkUrl}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conversation Memory Sidebar */}
      {showMemory && (
        <div
          className={`${
            isMobile ? 'fixed inset-0 z-50' : 'w-80'
          } glass-effect border-l border-white/20 dark:border-gray-700/50 flex flex-col relative z-10 slide-in`}
        >
          {/* Header */}
          <div className="p-4 md:p-6 border-b border-white/20 dark:border-gray-700/50 flex items-center justify-between">
            <h3 className="text-gray-900 dark:text-white font-bold text-lg md:text-xl gradient-text">
              AI Memory
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMemory(false)}
              className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-white/30 dark:bg-gray-700/30 hover:bg-white/50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300"
            >
              <X className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </div>

          {/* Memory Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
            <ConversationMemory
              context={context}
              onContextUpdate={updateContext}
            />

            <TopicSuggestions onTopicSelect={handleTopicSelect} />
          </div>
        </div>
      )}

      {/* Mobile Contacts Sidebar */}
      {showContacts && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowContacts(false)}
          />
          {/* Contacts Panel */}
          <div className="absolute left-0 top-0 h-full w-80 glass-effect border-r border-white/20 dark:border-gray-700/50 flex flex-col slide-in">
            {/* Header */}
            <div className="p-4 border-b border-white/20 dark:border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center pulse-glow">
                    <span className="text-white font-bold text-sm">CH</span>
                  </div>
                  <div>
                    <h1 className="text-gray-900 dark:text-white font-bold text-lg gradient-text">
                      Chats
                    </h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Connect with AI mentors
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowContacts(false)}
                  className="w-8 h-8 rounded-xl bg-white/30 dark:bg-gray-700/30 hover:bg-white/50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-400" />
                <Input
                  placeholder="Search conversations..."
                  className="bg-white/50 dark:bg-gray-700/50 border-white/30 dark:border-gray-600/50 text-gray-900 dark:text-white pl-10 h-10 rounded-xl backdrop-blur-sm focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 text-sm"
                />
              </div>
            </div>

            {/* Navigation Icons */}
            <div className="flex items-center justify-between p-4 border-b border-white/20 dark:border-gray-700/50">
              <div className="flex gap-4">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 gradient-bg-accent rounded-xl flex items-center justify-center hover-lift cursor-pointer">
                    <Bell className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                    AI chats
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-400 rounded-xl flex items-center justify-center hover-lift cursor-pointer">
                    <FileText className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                    Work
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-400 rounded-xl flex items-center justify-center hover-lift cursor-pointer">
                    <Calendar className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                    Calendar
                  </span>
                </div>
              </div>
            </div>

            {/* Contacts List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {contacts.map((contact, index) => (
                <div
                  key={contact.id}
                  onClick={() => {
                    setSelectedContact(contact.id);
                    setShowContacts(false);
                  }}
                  className={`p-3 rounded-xl cursor-pointer hover-lift transition-all duration-300 ${
                    selectedContact === contact.id
                      ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 dark:border-blue-400/20 shadow-lg'
                      : 'bg-white/30 dark:bg-gray-700/30 hover:bg-white/50 dark:hover:bg-gray-700/50'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12 ring-2 ring-white/50 dark:ring-gray-600/50">
                        <AvatarImage
                          src={contact.avatar || '/placeholder.svg'}
                          alt={contact.name}
                          className="object-cover"
                        />
                        <AvatarFallback className="gradient-bg text-white font-semibold">
                          {contact.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      {contact.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full border-2 border-white dark:border-gray-800 glow-green"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-gray-900 dark:text-white font-semibold text-sm truncate">
                          {contact.name}
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                          {contact.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300 truncate leading-relaxed">
                        {contact.lastMessage}
                      </p>
                    </div>
                    {contact.unreadCount && (
                      <Badge className="gradient-bg text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full font-semibold pulse-glow">
                        {contact.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HiteshChat() {
  return (
    <PersonaThemeProvider>
      <ChatApp />
    </PersonaThemeProvider>
  );
}
