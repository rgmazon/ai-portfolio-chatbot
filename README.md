# AI Portfolio Chatbot

An intelligent AI-powered chatbot built with Next.js and Google Gemini API to showcase RG Mazon's portfolio, skills, and experience. Features a modern dark-themed UI with real-time messaging, rate limiting, and response caching.

## ✨ Features

- **AI-Powered Conversations** - Leverages Google Gemini 2.5 Flash for intelligent, context-aware responses
- **Modern Dark UI** - Clean, professional dark theme with sharp corners and generous spacing
- **Real-Time Messaging** - Smooth message streaming with typing indicators
- **Rate Limiting** - Prevents abuse with 5 requests per minute per IP
- **Response Caching** - Redis-based caching for frequently asked questions (1-hour TTL)
- **Character Counter** - Input validation with 1000 character limit
- **Mobile Responsive** - Optimized chat widget that works on all screen sizes
- **Secure Authentication** - Token-based authentication for API requests
- **Error Handling** - Comprehensive error handling and user-friendly error messages

## 🛠️ Tech Stack

### Frontend

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **Tailwind CSS 4** - Utility-first CSS framework
- **JavaScript (ES6+)** - Modern JavaScript

### Backend

- **Next.js API Routes** - Serverless API endpoints
- **Node.js** - Runtime environment

### External Services

- **Google Gemini API** - AI model for generating responses
- **Upstash Redis** - Serverless Redis for caching and rate limiting
- **@upstash/redis** - Official Upstash Redis client
- **@upstash/ratelimit** - Rate limiting library

### Development

- **pnpm** - Fast, disk space efficient package manager
- **ESLint** - Code linting
- **PostCSS** - CSS processing with Tailwind

## 📋 Prerequisites

Before you begin, make sure you have:

- **Node.js** (v18 or higher)
- **pnpm** (v10 or higher) - [Install pnpm](https://pnpm.io/installation)
- **Git** - For cloning the repository
- **API Keys**:
  - [Google Gemini API Key](https://makersuite.google.com/app/apikey)
  - [Upstash Redis Token & URL](https://upstash.com/)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/rgmazon/ai-portfolio-chatbot.git
cd ai-portfolio-chatbot
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# Upstash Redis
UPSTASH_REDIS_URL=https://your-instance.upstash.io
UPSTASH_REDIS_TOKEN=your_upstash_token_here

# Chat Authentication (generate a secure token)
CHAT_SECRET_TOKEN=your_secret_token_here
NEXT_PUBLIC_CHAT_SECRET_TOKEN=your_secret_token_here
```

**To generate a secure token:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Start the Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## 📦 Project Structure

```
ai-portfolio-chatbot/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.js          # Chat API endpoint
│   ├── globals.css               # Global styles
│   ├── layout.jsx                # Root layout
│   ├── page.jsx                  # Home page
│   └── page.js
├── components/
│   ├── ChatWidget.jsx            # Main chat component
│   ├── geminiClient.js           # Gemini API client
│   └── ai/
│       ├── cache.js              # Redis caching utilities
│       ├── prompts.js            # System prompts
│       └── ratelimit.js          # Rate limiting config
├── public/                       # Static assets
├── package.json
├── next.config.mjs
├── tailwind.config.js
└── README.md
```

## 🔧 API Endpoints

### POST `/api/chat`

Send a message to the AI chatbot.

**Request Body:**

```json
{
  "message": "What are your skills?",
  "token": "your_secret_token"
}
```

**Response:**

```json
{
  "reply": "I specialize in HTML, CSS, JavaScript, React, Tailwind, and UI/UX design..."
}
```

**Status Codes:**

- `200` - Success
- `401` - Unauthorized (invalid token)
- `429` - Rate limit exceeded
- `500` - Server error

## 🎨 Customization

### Update the System Prompt

Edit `components/ai/prompts.js` to customize the AI's personality and background:

```javascript
export const systemPrompt = `
You are [Your Name]'s AI portfolio assistant.

Background:
- [Your Title]
- [Your Education]
- Skills: [Your Skills]
- [Your Experience]
`;
```

### Modify the Chat UI

The chat widget is in `components/ChatWidget.jsx`. Key styling classes use Tailwind CSS for easy customization.

### Change Rate Limiting Rules

Edit `components/ai/ratelimit.js` to adjust the rate limit (currently 5 requests per minute):

```javascript
limiter: Ratelimit.slidingWindow(10, "1m"), // 10 requests per minute
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and connect your repository
3. Add environment variables in Vercel project settings
4. Deploy!

```bash
# Or deploy via CLI
npm i -g vercel
vercel
```

### Deploy to Other Platforms

- **Netlify**: Works with Next.js serverless functions
- **Railway**: Node.js hosting with environment variables
- **Fly.io**: Docker container deployment

## 📝 Environment Variables Reference

| Variable                        | Description                      | Required |
| ------------------------------- | -------------------------------- | -------- |
| `GEMINI_API_KEY`                | Google Gemini API key            | Yes      |
| `UPSTASH_REDIS_URL`             | Redis connection URL             | Yes      |
| `UPSTASH_REDIS_TOKEN`           | Redis authentication token       | Yes      |
| `CHAT_SECRET_TOKEN`             | Server-side authentication token | Yes      |
| `NEXT_PUBLIC_CHAT_SECRET_TOKEN` | Client-side authentication token | Yes      |

## 🐛 Troubleshooting

### "Unauthorized request" Error

- Ensure `NEXT_PUBLIC_CHAT_SECRET_TOKEN` matches `CHAT_SECRET_TOKEN`
- Both values must be set in `.env.local`

### "No available AI models" Error

- Verify your `GEMINI_API_KEY` is valid
- Check that your Google Cloud project has Gemini API enabled

### Redis Connection Error

- Confirm `UPSTASH_REDIS_URL` and `UPSTASH_REDIS_TOKEN` are correct
- Check your Upstash account for valid credentials

### Rate Limited

- Wait 1 minute before sending another message
- Admin users can adjust the rate limit in `components/ai/ratelimit.js`

## 📊 Performance Features

- **Caching**: Responses are cached for 1 hour to reduce API calls
- **Rate Limiting**: Prevents abuse and reduces costs
- **Optimized Assets**: Minified CSS and JS through Next.js build
- **Fast Refresh**: Hot module reloading for development

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**RG Mazon**

- GitHub: [@rgmazon](https://github.com/rgmazon)
- Portfolio: [Your Portfolio Site]

## 🤝 Contributing

Feel free to fork this project and submit pull requests for any improvements!

## 📞 Support

For issues, questions, or suggestions, please open an issue on [GitHub Issues](https://github.com/rgmazon/ai-portfolio-chatbot/issues).

---

**Happy chatting! 🚀**
