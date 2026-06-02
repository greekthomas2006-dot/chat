# Development Guide

## Project Structure Overview

This guide covers local development, architecture, and deployment.

## Environment Setup

### Backend (.env)
```
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/private_connection
DB_HOST=localhost
DB_PORT=5432
DB_NAME=private_connection
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d

# CORS
FRONTEND_URL=http://localhost:5173

# File Upload
MAX_FILE_SIZE=52428800
ALLOWED_EXTENSIONS=jpg,jpeg,png,gif,mp4,mp3,wav,pdf,doc,docx

# WebSocket
WS_PORT=5001

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
VITE_WS_URL=ws://localhost:5001
VITE_APP_NAME=Private Connection
```

## Getting Started

### Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### Database Setup

```bash
# Create database
createdb private_connection

# Connect and run schema
psql private_connection < database/schema.sql

# Verify tables
psql private_connection -c "\dt"
```

### Running Locally

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Runs on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Runs on http://localhost:5173

**Terminal 3 - WebSocket Server (if separate):**
```bash
cd backend
npm run websocket
```
Runs on ws://localhost:5001

### Docker Development

```bash
# Start all services
docker-compose up -d

# Check logs
docker-compose logs -f

# Stop services
docker-compose down
```

## WebSocket Implementation

### Connection Flow

```javascript
// Client connects
const socket = io(WS_URL, { auth: { token: jwt } });

// Listen for events
socket.on('message:new', (data) => {
  // Handle new message
});

// Send events
socket.emit('message:send', {
  text: 'Hello',
  recipientId: userId
});
```

### Events

**Message Events:**
- `message:send` - Send a message
- `message:new` - Receive new message
- `message:edit` - Edit message
- `message:delete` - Delete message
- `message:reaction` - Add reaction
- `message:pin` - Pin message

**Presence Events:**
- `user:online` - User comes online
- `user:offline` - User goes offline
- `user:typing` - User typing
- `user:stopped-typing` - User stopped typing

**Streak Events:**
- `streak:update` - Streak count updated
- `streak:milestone` - Milestone reached

**Notification Events:**
- `notification:new` - New notification
- `notification:read` - Notification marked read

## Database Schema

### Core Tables

**users**
```sql
id, email, password_hash, username, avatar_url, bio, created_at, last_seen_at, online_status
```

**messages**
```sql
id, sender_id, recipient_id, text, created_at, edited_at, deleted_at, 
read_at, is_pinned, reply_to_id, media_type, media_url
```

**reactions**
```sql
id, message_id, user_id, emoji, created_at
```

**attachments**
```sql
id, message_id, type, url, file_name, file_size, created_at
```

**journal_entries**
```sql
id, user_id, title, content, created_at, updated_at, deleted_at, 
is_favorite, is_shared, cover_image_url
```

**goals**
```sql
id, created_by_id, title, description, category, status, priority, 
start_date, end_date, created_at, updated_at
```

**photos**
```sql
id, uploader_id, url, caption, album_id, created_at, is_favorite, 
photo_date, tags
```

**daily_questions**
```sql
id, question_text, category, created_at, is_archived
```

**answers**
```sql
id, question_id, user_id, answer_text, created_at
```

**events**
```sql
id, title, event_date, event_type, reminder_date, is_recurring, created_at
```

**streaks**
```sql
id, current_count, longest_count, last_message_date, milestone_achievements, created_at
```

See `database/schema.sql` for complete schema.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register (email, password, username)
- `POST /api/auth/login` - Login (email, password)
- `POST /api/auth/logout` - Logout
- `GET /api/auth/profile` - Get current user
- `PUT /api/auth/profile` - Update profile

### Messages
- `GET /api/messages` - Get messages (paginated)
- `GET /api/messages?search=keyword` - Search messages
- `POST /api/messages` - Send message
- `PUT /api/messages/:id` - Edit message
- `DELETE /api/messages/:id` - Delete message
- `POST /api/messages/:id/reactions` - Add reaction
- `DELETE /api/messages/:id/reactions/:emoji` - Remove reaction
- `POST /api/messages/:id/pin` - Pin message
- `DELETE /api/messages/:id/pin` - Unpin message

### Journal
- `GET /api/journal` - List entries (paginated, filtered)
- `GET /api/journal/:id` - Get entry
- `POST /api/journal` - Create entry
- `PUT /api/journal/:id` - Update entry
- `DELETE /api/journal/:id` - Delete entry
- `POST /api/journal/:id/comments` - Add comment
- `GET /api/journal/:id/comments` - Get comments
- `PUT /api/journal/:id/favorite` - Toggle favorite

### Goals
- `GET /api/goals` - List goals (shared & personal)
- `POST /api/goals` - Create goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal
- `POST /api/goals/:id/milestones` - Add milestone
- `PUT /api/goals/:id/milestones/:milestoneId` - Update milestone

### Photos
- `GET /api/photos` - List photos
- `POST /api/photos` - Upload photo
- `DELETE /api/photos/:id` - Delete photo
- `GET /api/albums` - List albums
- `POST /api/albums` - Create album
- `PUT /api/photos/:id/album` - Move to album

### Daily Questions
- `GET /api/questions/today` - Get today's question
- `GET /api/questions/archive` - Get all questions
- `POST /api/questions/:id/answer` - Answer question
- `GET /api/questions/:id/answers` - Get answers

### Timeline
- `GET /api/timeline` - Get unified timeline
- `GET /api/timeline?filter=messages` - Filter by type
- `GET /api/timeline?month=2024-06` - Filter by month

### Events
- `GET /api/events` - List events
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Streaks
- `GET /api/streaks` - Get streak data
- `GET /api/streaks/statistics` - Get streak statistics

### Analytics
- `GET /api/analytics/dashboard` - Get all metrics
- `GET /api/analytics/activity-heatmap` - Activity by day/hour

## State Management (Frontend)

Using Zustand for state management:

```javascript
// stores/useAuthStore.js
export const useAuthStore = create((set) => ({
  user: null,
  isLoggedIn: false,
  login: (user) => set({ user, isLoggedIn: true }),
  logout: () => set({ user: null, isLoggedIn: false })
}));

// stores/useChatStore.js
export const useChatStore = create((set) => ({
  messages: [],
  addMessage: (msg) => set((state) => ({
    messages: [...state.messages, msg]
  }))
}));
```

## Component Structure

**Pages:**
- `Dashboard` - Main dashboard with stats
- `Chat` - Real-time messaging
- `Journal` - Journal entries
- `Goals` - Goal tracking
- `Photos` - Photo gallery
- `Timeline` - Unified timeline
- `Analytics` - Analytics dashboard

**Components:**
- `ChatWindow` - Message display and input
- `MessageBubble` - Individual message
- `SideNavigation` - Main navigation
- `JournalEditor` - Rich text editor
- `GoalCard` - Goal display
- `PhotoGrid` - Photo gallery
- `StreakCounter` - Streak display

## Testing

### Backend Testing
```bash
npm run test
npm run test:coverage
```

### Frontend Testing
```bash
npm run test
npm run test:coverage
```

## Build & Deploy

### Production Build

**Backend:**
```bash
npm run build
npm start
```

**Frontend:**
```bash
npm run build
# Deploy dist/ folder
```

### Docker Deployment

```bash
docker build -t chat-app:latest .
docker run -d -p 5000:5000 chat-app:latest
```

### Environment Variables (Production)
- Use strong JWT secret
- Enable HTTPS/WSS only
- Set proper CORS origins
- Use environment-specific database
- Enable rate limiting
- Configure file upload restrictions
- Set up monitoring and logging

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] SSL/TLS certificates installed
- [ ] Rate limiting enabled
- [ ] File upload restrictions set
- [ ] Logging configured
- [ ] Backup strategy in place
- [ ] Monitoring alerts set up
- [ ] Load balancer configured
- [ ] CDN for static assets
- [ ] Database backups automated
- [ ] Security headers configured

## Troubleshooting

**WebSocket connection fails:**
- Check CORS settings
- Verify WebSocket server is running
- Check firewall rules
- Verify JWT token is valid

**Database connection errors:**
- Verify DATABASE_URL is correct
- Check PostgreSQL service is running
- Verify database exists
- Check user permissions

**File upload issues:**
- Check file size limits
- Verify MIME types allowed
- Check upload directory permissions
- Verify disk space available

## Performance Optimization

- Implement message pagination
- Add caching for photos
- Compress images on upload
- Lazy load timeline items
- Minimize bundle size
- Implement service workers
- Add database indexes
- Use CDN for assets

---

For more details, see inline code comments and specific module documentation.
