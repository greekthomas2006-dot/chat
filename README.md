# Private Connection Platform

A modern, secure web application designed exclusively for two users to communicate, share memories, track personal growth, and build a history of their interactions over time.

## 🎯 Features

### Real-Time Messaging
- Instant messaging with WebSocket support
- Message timestamps, delivery, and read indicators
- Typing indicators and online/offline status
- Message reactions (❤️ 👍 😂 😮 😢)
- Reply, edit, delete, and pin messages
- File, image, and voice message support
- Message search functionality
- Emoji picker
- Notification sounds and browser notifications

### Private Journal
- Shared and private journal entries
- Rich text editor with formatting
- Comments on entries
- Image attachments
- Calendar view with date organization
- Search and favorite functionality
- Tag entries by category

### Shared Goals Tracker
- Create shared and personal goals
- Add milestones and set deadlines
- Progress tracking with visual progress bars
- Goal categories and reminders
- Completion badges and statistics
- Goal history and notes
- Image uploads related to goals

### Photo Memories Wall
- Upload and organize photos by date and albums
- Add captions and tags
- Favorite photos with full-screen viewer
- Slideshow mode
- Memory categories and automatic timeline integration

### Daily Question Feature
- One new question every day
- Separate answers for each user
- Answers hidden until both respond
- Archive and search previous questions
- Random question generator
- Categories: Life, Goals, Memories, Future, Fun, Personal Growth

### Message Streak System
- Consecutive days counter for mutual messaging
- Current and longest streak tracking
- Monthly and yearly statistics
- Achievement milestones (7, 30, 100, 365, 500, 1000 days)

### Memory Timeline
- Unified timeline combining all activities
- Messages, photos, journal entries, goals, questions
- Filter by type and date
- Monthly/yearly views with infinite scroll
- Search and timeline statistics

### On This Day Feature
- Show events from same date in previous years
- Display old photos, journal entries, conversations
- Memory recap cards

### Important Dates
- Birthdays, anniversaries, custom events
- Countdown timers and event reminders
- Recurring events support

### Analytics Dashboard
- Total messages, photos, journal entries
- Goals completed counter
- Activity heatmap
- Streak statistics
- Usage insights

## 🏗️ Architecture

```
chat/
├── backend/                 # Node.js/Express server
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Authentication, validation
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── websocket/      # Real-time messaging
│   │   ├── utils/          # Helper functions
│   │   └── app.js          # Express app setup
│   ├── .env.example        # Environment variables template
│   ├── package.json
│   └── server.js           # Entry point
├── frontend/               # React/Vite application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API and WebSocket client
│   │   ├── stores/         # State management (Zustand)
│   │   ├── styles/         # Global styles
│   │   ├── utils/          # Utility functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
├── database/               # Database setup
│   ├── schema.sql          # PostgreSQL schema
│   └── seed.sql            # Sample data (optional)
├── docker-compose.yml      # Docker configuration
├── .gitignore
└── DEVELOPMENT.md          # Development guide
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 13+
- Docker & Docker Compose (optional)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/greekthomas2006-dot/chat.git
cd chat
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

3. **Frontend Setup**
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

4. **Database Setup**
```bash
# Create PostgreSQL database
createdb private_connection

# Run schema
psql private_connection < database/schema.sql
```

### Using Docker
```bash
docker-compose up -d
```

## 🔐 Security Features

- Secure authentication with JWT tokens
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting on API endpoints
- CORS protection
- Secure file uploads with validation
- Private data access control
- XSS and CSRF prevention
- SQL injection prevention

## 📊 Database Schema

- **users**: User accounts and profiles
- **messages**: Chat messages with metadata
- **reactions**: Message reactions
- **attachments**: File, image, and voice attachments
- **journal_entries**: Private journal entries
- **journal_comments**: Comments on journal entries
- **goals**: Shared and personal goals
- **goal_milestones**: Goal progress tracking
- **photos**: Photo uploads and metadata
- **albums**: Photo organization
- **daily_questions**: Daily question pool
- **answers**: User answers to daily questions
- **events**: Important dates and reminders
- **notifications**: User notifications
- **streaks**: Streak statistics and history

## 📡 API Endpoints

See `DEVELOPMENT.md` for comprehensive API documentation.

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get current user profile

### Messages
- `GET /api/messages` - Fetch messages
- `POST /api/messages` - Send message
- `PUT /api/messages/:id` - Edit message
- `DELETE /api/messages/:id` - Delete message
- `POST /api/messages/:id/reactions` - Add reaction
- `POST /api/messages/:id/pin` - Pin message

### Journal
- `GET /api/journal` - Fetch journal entries
- `POST /api/journal` - Create entry
- `PUT /api/journal/:id` - Update entry
- `DELETE /api/journal/:id` - Delete entry
- `POST /api/journal/:id/comments` - Add comment

### Goals
- `GET /api/goals` - Fetch goals
- `POST /api/goals` - Create goal
- `PUT /api/goals/:id` - Update goal
- `POST /api/goals/:id/milestones` - Add milestone

### And more...

## 🎨 UI Features

- Modern premium design with smooth animations
- Fully responsive (mobile, tablet, desktop)
- Dark and light mode support
- Beautiful chat bubbles with rich formatting
- Sidebar navigation
- Intuitive dashboard
- Clean typography
- Accessibility features

## 📝 Development

See `DEVELOPMENT.md` for:
- Local development setup
- WebSocket implementation details
- State management patterns
- Component structure
- Testing guidelines
- Deployment instructions

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

This is a private application for two users. Modifications should be made by authorized users only.

---

**Built with ❤️ for meaningful connections**
