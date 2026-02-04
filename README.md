# Loop.in

**College Discussion & Announcement Platform**

A verified college community platform built for students to discuss coursework, share announcements, track deadlines, and engage in department-specific conversations.

---

## Project Status

**Status:** 🟢 Active Development (Day 4 Completed)  
**Current Phase:** Temporal Pinning & Bug Fixes  
**Last Updated:** February 5, 2026

---

## What We Are Building

Loop.in is a college-specific social platform designed for verified students to collaborate, share resources, and stay informed. The platform provides dedicated spaces for discussions, announcements, deadlines, and trending topics—all within a secure, authenticated environment. Unlike open forums, Loop.in ensures every participant is a verified member of the college community.

---

## Daily Progress

### Day 1 – Foundation Setup ✅ (Completed)

**Backend:**
- FastAPI application initialized
- PostgreSQL database connected
- User model created with proper schema
- Authentication system implemented (register/login)
- JWT token generation working
- Password hashing with bcrypt
- Health check endpoint active
- API documentation (Swagger UI) available
- Environment variable configuration
- Database session management

**Frontend:**
- Next.js 15 application initialized
- TypeScript + Tailwind CSS configured
- Sidebar navigation layout created
- Login/Register page built
- Home feed page (dummy state)
- API client setup with Axios
- Environment variable configuration
- Responsive design foundation
- JWT token storage in localStorage
- Protected route structure

**Integration:**
- Backend-frontend connection verified
- CORS properly configured
- End-to-end auth flow tested
- Database persistence confirmed

**Documentation:**
- README started
- SETUP.md with installation steps
- CONTRIBUTING.md created
- DAY1_REVIEW.md checklist
- Architecture documentation
- Environment variable examples

---

### Day 2 – UX & Professional Polish ✅ (Completed)

**UI/UX Foundation:**
- Professional Indian college portal aesthetic
- Flat design with borders instead of shadows
- Strict slate/blue color palette
- Typography hierarchy standardized
- Removed all emojis from UI chrome
- LinkedIn-inspired clean feed layout
- Subtle animations (150-200ms, no bounce)

**Navigation & Layout:**
- Toggle sidebar with hamburger menu (mobile)
- Slide animation from left (200ms ease-out)
- Click-outside and ESC key to close
- Black overlay (30% opacity)
- Active page highlighting with left border
- Body scroll lock when sidebar open
- Consistent navigation patterns

**User Profile System:**
- Profile avatar button (top-right)
- User initials display
- Dropdown menu (View/Edit Profile, Logout)
- Profile page with view/edit modes
- Editable fields: Name, Department, Year, Bio
- Read-only email field
- Form validation with required indicators
- Save/Cancel functionality

**Feed Improvements:**
- Card-based layout with better spacing (24px gap)
- Author display with initials in avatar
- Bolder author names (slate-900)
- Muted meta info (role • year • time)
- Professional tag pills (rounded-full, bordered)
- SVG icons instead of emoji
- Hover states on action buttons
- Subtle card shadow on hover
- Line-clamp for long content

**Form & Button Polish:**
- Reusable Button component (primary/secondary/ghost)
- Loading states with spinner
- Disabled states during API calls
- Prevented double form submissions
- Required field indicators (*)
- Clear, helpful placeholders
- Better error message formatting
- Active state feedback

**Component Standardization:**
- All pages match design system
- Consistent spacing and padding
- Uniform button sizes and styles
- Professional EmptyState components
- Updated SkeletonLoader colors
- Text overflow handling
- Edge case support (long titles, content)

**Design System Rules:**
- Max border-radius: 6px (rounded-md)
- NO gradients or glassmorphism
- NO heavy shadows (borders only)
- NO scale animations
- Color transitions only (150ms)
- Visible focus rings
- Professional, human-made feel

---

### Day 3 – Firebase Auth & Admin System ✅ (Completed)

**Authentication Migration:**
- Migrated from custom auth to Firebase Authentication
- Google Sign-In integration for seamless login
- Email/Password authentication support
- Lazy user registration (auto-creates user on first login)
- Token verification on backend with Firebase Admin SDK

**Admin Panel & RBAC:**
- Role-based access control (admin/student roles)
- Local JWT authentication for admin users
- Admin dashboard with user management
- Audit logging for admin actions (delete, pin)
- Protected admin routes with role verification

---

### Day 4 – Temporal Pinning & Bug Fixes ✅ (Completed - Feb 5, 2026)

**Temporal Pinning Feature:**
- Admins can pin posts with time-based expiration
- Duration options: 24 hours, 7 days, 30 days, or Infinite
- `pinned_until` column added to Post model
- Automatic sorting: pinned (not expired) posts appear first
- Visual indicators: spectral glow border on pinned posts
- Timer badge showing time remaining (visible to admins)
- PinDialog component for duration selection

**Backend Improvements:**
- `pin_post` endpoint with duration parameter (`24h`, `7d`, `30d`, `infinite`)
- Temporal sorting logic using SQLAlchemy `case()` expressions
- Audit logging for `PIN_POST` action
- Added `firebase-admin` dependency
- Fixed CORS configuration for development

**Frontend Improvements:**
- Pin button on PostCard (admin only)
- PinDialog with animated duration selector
- Spectral border animation for pinned posts
- Expiration countdown badge
- Created missing `spotlight.tsx` component for SplineBanner

**Critical Bug Fixes:**
- Fixed missing `content` field in `PostCreate` schema (was causing createPost to fail)
- Fixed admin page infinite loading state
- Fixed 401 interceptor conflict with admin routes
- Removed sensitive credentials from git history

## Tech Stack

### Frontend
- **Framework:** Next.js 15 (React 19)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **State Management:** React Hooks
- **Authentication:** JWT stored in localStorage

### Backend
- **Framework:** FastAPI (Python 3.12+)
- **Database:** PostgreSQL
- **ORM:** SQLAlchemy
- **Authentication:** JWT with passlib (bcrypt)
- **Validation:** Pydantic
- **Server:** Uvicorn (ASGI)

### Tools & Infrastructure
- **Version Control:** Git
- **Package Management:** npm (frontend), pip (backend)
- **Database Client:** psycopg2
- **API Documentation:** Swagger UI (FastAPI auto-generated)

---

## Folder Structure

```
final_loop/
│
├── backend/
│   ├── app/
│   │   ├── api/              # API route handlers
│   │   │   └── auth.py       # Register & Login endpoints
│   │   ├── core/             # Core configurations
│   │   │   ├── config.py     # Environment settings (Pydantic)
│   │   │   └── security.py   # Password hashing & JWT
│   │   ├── db/               # Database
│   │   │   └── session.py    # SQLAlchemy session & engine
│   │   ├── models/           # Database models
│   │   │   └── user.py       # User table
│   │   └── main.py           # FastAPI app entry point
│   ├── venv/                 # Virtual environment
│   ├── .env.example          # Environment variable template
│   ├── .gitignore
│   └── requirements.txt      # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── app/              # Next.js app router
│   │   │   ├── login/
│   │   │   │   └── page.tsx  # Login/Register page
│   │   │   ├── layout.tsx    # Root layout with sidebar
│   │   │   └── page.tsx      # Home feed
│   │   ├── components/       # Reusable components
│   │   │   ├── layout/
│   │   │   │   └── Sidebar.tsx
│   │   │   └── common/
│   │   │       └── EmptyState.tsx
│   │   └── lib/
│   │       └── api.ts        # Axios API client
│   ├── public/               # Static assets
│   ├── .env.example          # Environment variable template
│   ├── package.json
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
├── README.md                 # This file
├── SETUP.md                  # Detailed setup guide
├── CONTRIBUTING.md           # Contribution guidelines
└── DAY1_REVIEW.md            # Day 1 validation checklist
```

---

## Setup Instructions

### Prerequisites

Ensure you have the following installed:

- **Python:** 3.12 or higher
- **Node.js:** 18.x or higher
- **PostgreSQL:** 14.x or higher
- **Git:** Latest version

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment:**
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Create PostgreSQL database:**
   ```bash
   psql -U postgres
   CREATE DATABASE loopin;
   \q
   ```

6. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set:
   ```
   DATABASE_URL=postgresql://postgres:yourpassword@localhost/loopin
   SECRET_KEY=your-secret-key-here
   ```

7. **Run the backend:**
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and set:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

---

## How to Run the Project

### Start Backend
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
uvicorn app.main:app --reload
```
**Backend URL:** http://localhost:8000  
**API Docs:** http://localhost:8000/docs

### Start Frontend
```bash
cd frontend
npm run dev
```
**Frontend URL:** http://localhost:3000

### Verify Setup
1. Visit http://localhost:8000/health → Should return `{"status": "ok"}`
2. Visit http://localhost:3000 → Should load home page
3. Visit http://localhost:3000/login → Should load auth page
4. Register a new user with any email and password
5. Check that you're redirected to home feed after successful registration

---

## Features (Current)

### ✅ Implemented
- User registration with email/password
- User login with JWT authentication
- Secure password hashing (bcrypt)
- Token-based session management
- Protected API endpoints
- Responsive sidebar navigation
- Clean, modern UI with Tailwind CSS
- Backend-frontend integration verified
- PostgreSQL database persistence
- API documentation (Swagger UI)
- Environment-based configuration
- CORS configured for local development

### 🎯 Core Functionality
- Users can create accounts
- Users can log in and receive JWT tokens
- Frontend stores and manages auth tokens
- Database properly stores user data
- All pages load without errors

---

## Features (Upcoming)

### Day 2 – Discussion Engine
- Create posts with title, content, department tags
- View feed of recent posts
- Comment on posts
- Reply to comments (nested threads)
- Upvote/downvote posts and comments
- Edit/delete own posts and comments
- Post detail view
-whenever you ll hower into any button 
-it must chaneg its colour 
-add a mode of dark and light 
-ui enehcnment futuree work !!!!

### Day 3 – Differentiation Features
- Department-based filtering
- Announcement posting (verified users only)
- Deadline tracking with reminders
- Popular posts section (trending algorithm)
- User reputation system
- Department-specific feeds

### Day 4 – Polish & Discovery
- Search functionality (posts, users, tags)
- User profiles with activity history
- Better empty states and loading indicators
- Error handling improvements
- Mobile responsiveness enhancements
- Dark mode support

### Day 5 – Testing & Deployment
- End-to-end testing suite
- Bug fixes and edge cases
- Performance optimization
- Production deployment preparation
- Final documentation polish
- Demo video recording

---

## Development Plan (5 Days)

| Day | Focus Area | Status |
|-----|-----------|--------|
| **Day 1** | Foundation & Auth | ✅ Complete |
| **Day 2** | UX & Professional Polish | ✅ Complete |
| **Day 3** | Firebase Auth & Admin System | ✅ Complete |
| **Day 4** | Temporal Pinning & Bug Fixes | ✅ Complete |
| **Day 5** | Testing & Deployment | ⏳ Planned |

### Day 1 Achievements (Completed Feb 1, 2026)
- Backend API fully functional
- Frontend application running
- Authentication working end-to-end
- Database connected and operational
- Documentation foundation established
- Zero blocking issues

### Day 2 Goals (Feb 2, 2026)
- Implement post creation API
- Build feed rendering component
- Add comment system (backend + frontend)
- Create post detail page
- Add basic pagination

---

## Contributing Notes

This is an internal team project for a college platform development sprint.

### Development Workflow
1. All changes must pass local testing before commit
2. Backend changes require Swagger UI verification
3. Frontend changes require browser testing
4. Database migrations must be documented
5. New features require corresponding documentation updates

### Daily Updates
This README is updated daily with:
- Progress on current day's tasks
- Blockers or issues encountered
- Plans for the next day
- Feature completion status

### Code Standards
- **Backend:** Type hints, proper exception handling, no hardcoded secrets
- **Frontend:** TypeScript strict mode, no `any` types, Tailwind classes only
- **Database:** Proper constraints, migrations tracked
- **Documentation:** Keep setup instructions current

---

## Troubleshooting

### Backend Issues

**Database connection failed:**
- Verify PostgreSQL is running: `pg_isready`
- Check database exists: `psql -U postgres -l | grep loopin`
- Verify credentials in `.env` file

**Module not found errors:**
- Ensure virtual environment is activated
- Reinstall dependencies: `pip install -r requirements.txt`

**Port 8000 already in use:**
- Kill existing process or use different port:
  ```bash
  uvicorn app.main:app --reload --port 8001
  ```

### Frontend Issues

**Build failures:**
- Clear Next.js cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

**API calls failing:**
- Verify backend is running on http://localhost:8000
- Check `.env.local` has correct `NEXT_PUBLIC_API_URL`
- Inspect browser console for CORS errors

**Token not persisting:**
- Check browser localStorage in DevTools
- Verify token is being saved after login
- Clear localStorage and try registering again

---

## License

This project is developed as part of an educational sprint. All rights reserved to the development team.

---

## Final Note

This project is under active development as part of a 5-day sprint. Day 1 foundation has been successfully completed with all core systems operational. The platform is now ready for feature development starting Day 2.

For detailed setup instructions, see [SETUP.md](SETUP.md).  
For contribution guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).  
For Day 1 validation checklist, see [DAY1_REVIEW.md](DAY1_REVIEW.md).

**Built with ⚡ by the Loop.in Team**
