# AI Persona Chat App

A modern, interactive chat application that simulates conversations with AI personas. This project features a WhatsApp-style interface where users can chat with AI-powered personas, specifically designed to mimic real personalities like Hitesh Choudhary, a well-known tech educator and developer.

## 🚀 Features

• **AI-Powered Chat Interface**: Real-time conversations with AI personas using OpenAI's GPT-4o-mini model
• **WhatsApp-Style UI**: Modern, responsive chat interface with dark theme
• **Persona Simulation**: Authentic personality simulation with natural speech patterns and cultural context
• **Real-time Messaging**: Instant message delivery with typing indicators
• **Contact Management**: Sidebar with contact list and chat details
• **Message History**: Persistent conversation history with timestamps
• **Responsive Design**: Works seamlessly on desktop and mobile devices
• **Modern UI Components**: Built with Radix UI and Tailwind CSS for beautiful, accessible components

## 🛠️ Technology Stack

• **Frontend**: Next.js 15, React 19, TypeScript
• **Styling**: Tailwind CSS 4, Radix UI components
• **AI Integration**: OpenAI GPT-4o-mini API
• **Icons**: Lucide React
• **Form Handling**: React Hook Form with Zod validation
• **Package Manager**: pnpm
• **Deployment**: Vercel-ready configuration

## 📱 Key Components

• **Chat Interface**: Main messaging area with message bubbles and timestamps
• **Contact Sidebar**: Left panel showing available AI personas
• **Chat Details Panel**: Right sidebar with profile information and shared content
• **Message Input**: Real-time message composition with attachment support
• **Typing Indicators**: Visual feedback when AI is generating responses

## 🎯 AI Persona Features

• **Hitesh Choudhary Persona**:

- Tech mentor and developer personality
- Mix of Hindi and English communication
- Expertise in JavaScript, React, Node.js, Angular
- Warm, approachable teaching style
- Real-world coding examples and guidance

## 🚀 Getting Started

### Prerequisites

• Node.js 18+
• pnpm package manager
• OpenAI API key

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ai-persona-app
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:

   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Run the development server**

   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Available Scripts

• `pnpm dev` - Start development server
• `pnpm build` - Build for production
• `pnpm start` - Start production server
• `pnpm lint` - Run ESLint

## 📁 Project Structure

```
ai-persona-app/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── chat/          # Chat API endpoint
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main chat interface
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   └── theme-provider.tsx # Theme configuration
├── lib/                   # Utility functions
├── public/                # Static assets
└── styles/                # Additional stylesheets
```

## 🎨 UI Components

The application uses a comprehensive set of UI components built with Radix UI:

• **Avatar**: User profile pictures and fallbacks
• **Button**: Interactive buttons with various styles
• **Input**: Text input fields with search functionality
• **Badge**: Notification counters and status indicators
• **Dialog**: Modal windows and overlays
• **Dropdown**: Context menus and navigation

## 🔌 API Integration

• **OpenAI Chat API**: Powers the AI persona responses
• **System Prompts**: Detailed personality instructions for authentic conversations
• **Error Handling**: Graceful error management with user-friendly messages
• **Rate Limiting**: Built-in protection against API quota issues

## 🌟 Key Features in Detail

### Real-time Chat Experience

- Instant message delivery
- Typing indicators when AI is responding
- Message timestamps and read receipts
- Smooth scrolling to latest messages

### Authentic AI Personas

- Detailed personality profiles
- Cultural context and language mixing
- Expertise-based responses
- Natural conversation flow

### Modern UI/UX

- Dark theme with professional styling
- Responsive design for all screen sizes
- Intuitive navigation and interactions
- Accessibility features built-in

## 🚀 Deployment

The application is configured for easy deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Add your OpenAI API key to environment variables
3. Deploy with automatic builds on push

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

• **Hitesh Choudhary** - For the inspiration and personality simulation
• **OpenAI** - For providing the AI capabilities
• **Vercel** - For the deployment platform
• **Radix UI** - For the excellent component library
# ai-persona-app
