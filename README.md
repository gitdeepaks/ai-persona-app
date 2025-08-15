# AI Persona Chat App

> **Live Demo:** [https://ai-persona-app-five.vercel.app/](https://ai-persona-app-five.vercel.app/)

## 🚀 Features

• **AI-Powered Chat Interface**: Real-time conversations with AI personas using OpenAI's GPT-4o-mini model
• **WhatsApp-Style UI**: Modern, responsive chat interface with dark theme
• **Multiple Personas**: Chat with different AI personalities (Hitesh Choudhary, Piyush Garg)
• **Persona Simulation**: Authentic personality simulation with natural speech patterns and cultural context
• **Real-time Messaging**: Instant message delivery with typing indicators
• **Contact Management**: Sidebar with contact list and chat details
• **Message History**: Persistent conversation history with timestamps
• **Responsive Design**: Works seamlessly on desktop and mobile devices
• **Modern UI Components**: Built with Radix UI and Tailwind CSS for beautiful, accessible components
• **Theme Support**: Dark/light theme toggle with system preference detection

## 🛠️ Technology Stack

• **Frontend**: Next.js 15, React 19, TypeScript
• **Styling**: Tailwind CSS 4, Radix UI components
• **AI Integration**: OpenAI GPT-4o-mini API
• **Icons**: Lucide React
• **Form Handling**: React Hook Form with Zod validation
• **Package Manager**: pnpm
• **Deployment**: Vercel-ready configuration
• **Additional Libraries**: date-fns, recharts, sonner (toasts), vaul (drawer)

## 📱 Key Components

• **Chat Interface**: Main messaging area with message bubbles and timestamps
• **Contact Sidebar**: Left panel showing available AI personas
• **Chat Details Panel**: Right sidebar with profile information and shared content
• **Message Input**: Real-time message composition with attachment support
• **Typing Indicators**: Visual feedback when AI is generating responses
• **Theme Toggle**: Switch between light and dark modes

## 🎯 AI Persona Features

### Hitesh Choudhary Persona

- Tech mentor and developer personality
- Mix of Hindi and English communication
- Expertise in JavaScript, React, Node.js, Angular
- Warm, approachable teaching style
- Real-world coding examples and guidance

### Piyush Garg Persona

- Tech educator and developer personality
- Specialized knowledge in modern web development
- Engaging teaching methodology
- Practical coding insights and best practices

## 🚀 Getting Started

### Prerequisites

• Node.js 18+ (LTS version recommended)
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

   > **Note**: You can get your OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)

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
│   │   └── chat/          # Chat API endpoints
│   │       ├── hitesh/    # Hitesh persona API
│   │       └── piyush/    # Piyush persona API
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── loading.tsx        # Loading component
│   └── page.tsx           # Main chat interface
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components (Radix UI)
│   ├── theme-provider.tsx # Theme configuration
│   └── theme-toggle.tsx   # Theme toggle component
├── lib/                   # Utility functions
│   └── utils.ts          # Common utilities
├── public/                # Static assets
├── styles/                # Additional stylesheets
├── components.json        # Radix UI configuration
├── next.config.mjs        # Next.js configuration
├── postcss.config.mjs     # PostCSS configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

## 🎨 UI Components

The application uses a comprehensive set of UI components built with Radix UI:

• **Avatar**: User profile pictures and fallbacks
• **Button**: Interactive buttons with various styles and variants
• **Input**: Text input fields with search functionality
• **Badge**: Notification counters and status indicators
• **Dialog**: Modal windows and overlays
• **Dropdown**: Context menus and navigation
• **Toast**: Notification system for user feedback
• **Drawer**: Slide-out panels for additional content
• **Carousel**: Image and content sliders
• **Form Components**: Checkbox, radio, select, switch, and more

## 🔌 API Integration

• **OpenAI Chat API**: Powers the AI persona responses
• **System Prompts**: Detailed personality instructions for authentic conversations
• **Error Handling**: Graceful error management with user-friendly messages
• **Rate Limiting**: Built-in protection against API quota issues
• **Multiple Endpoints**: Separate API routes for different personas

## 🌟 Key Features in Detail

### Real-time Chat Experience

- Instant message delivery
- Typing indicators when AI is responding
- Message timestamps and read receipts
- Smooth scrolling to latest messages
- Message persistence across sessions

### Authentic AI Personas

- Detailed personality profiles
- Cultural context and language mixing
- Expertise-based responses
- Natural conversation flow
- Context-aware interactions

### Modern UI/UX

- Dark/light theme with professional styling
- Responsive design for all screen sizes
- Intuitive navigation and interactions
- Accessibility features built-in
- Smooth animations and transitions

## 🚀 Deployment

The application is configured for easy deployment on Vercel:

1. **Connect your GitHub repository to Vercel**
2. **Add your OpenAI API key to environment variables**
3. **Deploy with automatic builds on push**

### Environment Variables for Production

```env
OPENAI_API_KEY=your_openai_api_key_here
```

## 🧪 Testing

To ensure code quality:

```bash
# Run linting
pnpm lint

# Build the application
pnpm build
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Test thoroughly**
5. **Commit your changes** (`git commit -m 'Add amazing feature'`)
6. **Push to the branch** (`git push origin feature/amazing-feature`)
7. **Submit a pull request**

### Development Guidelines

- Follow TypeScript best practices
- Use conventional commit messages
- Ensure responsive design works on all devices
- Test with different AI personas
- Maintain accessibility standards

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

• **Hitesh Choudhary** - For the inspiration and personality simulation
• **Piyush Garg** - For additional persona development
• **OpenAI** - For providing the AI capabilities
• **Vercel** - For the deployment platform
• **Radix UI** - For the excellent component library
• **Tailwind CSS** - For the utility-first CSS framework

## 🔮 Roadmap

- [ ] Add more AI personas
- [ ] Implement voice chat capabilities
- [ ] Add file sharing functionality
- [ ] Create persona customization options
- [ ] Add conversation export features
- [ ] Implement user authentication
- [ ] Add conversation analytics
