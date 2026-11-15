# ?? InstaDS — Instagram-Inspired Data Structures Platform

> **FODS (Fundamentals of Data Structures)** course project — a full-stack Instagram-like social media application showcasing real-world applications of data structures and algorithms, built with a **FastAPI** backend and a **React + TypeScript** frontend.

---

## ??? Project Structure

```
FODS/
+-- Backend/              # Python FastAPI REST API
¦   +-- main.py           # App entry point & route registration
¦   +-- database.py       # SQLAlchemy engine & session setup
¦   +-- models.py         # ORM models (User, Post)
¦   +-- schemas.py        # Pydantic request/response schemas
¦   +-- instads.db        # SQLite database file
¦   +-- routes/
¦       +-- auth.py       # Authentication routes (/auth/register)
¦       +-- posts.py      # Post management routes (/posts)
¦
+-- Frontend/             # React 19 + TypeScript + Vite SPA
¦   +-- src/
¦   ¦   +-- App.tsx       # Root component & client-side routing
¦   ¦   +-- pages/        # Full page views
¦   ¦   ¦   +-- Home/         # Feed page with stories & post cards
¦   ¦   ¦   +-- Explore/      # Discover & search users/posts
¦   ¦   ¦   +-- Profile/      # User profile page & edit modal
¦   ¦   ¦   +-- Notifications/# Activity feed (likes, comments, follows)
¦   ¦   ¦   +-- Saved/        # Bookmarked posts
¦   ¦   ¦   +-- CreatePost/   # New post creation workflow
¦   ¦   ¦   +-- Auth/         # Login & Register pages
¦   ¦   +-- components/   # Reusable UI components
¦   ¦   ¦   +-- layout/       # AppLayout, Sidebar, TopHeader, MobileNav
¦   ¦   ¦   +-- post/         # PostCard, PostGrid, PostDetailModal, ShareModal
¦   ¦   ¦   +-- stories/      # StoriesBar
¦   ¦   ¦   +-- comment/      # CommentSection
¦   ¦   ¦   +-- common/       # Avatar, Modal, Spinner, EmptyState, ErrorAlert
¦   ¦   +-- context/      # React Context providers
¦   ¦   ¦   +-- AuthContext.tsx         # Authentication state
¦   ¦   ¦   +-- NotificationContext.tsx # Notification state
¦   ¦   +-- hooks/        # Custom React hooks
¦   ¦   ¦   +-- useAuth.ts      # Auth accessor hook
¦   ¦   ¦   +-- useDebounce.ts  # Debounce for search input
¦   ¦   +-- services/     # API + mock data layer
¦   ¦   ¦   +-- api/      # Real API clients (auth, feed, post, user, notification)
¦   ¦   ¦   +-- mock/     # Mock data & in-memory storage for development
¦   ¦   +-- types/        # TypeScript interfaces & types
¦   ¦   +-- utils/        # Helpers (class name merger, formatters)
¦   +-- index.html
¦   +-- vite.config.ts
¦   +-- tsconfig.json
¦   +-- package.json
¦
+-- Search_algo/          # Data structure implementations (C)
¦   +-- Array/            # Array-based operations
¦   +-- code              # General DS code
¦   +-- queue             # Queue implementation
¦   +-- tree              # Tree / BST implementation
¦
+-- graph.c               # Graph implementation in C
+-- hashmap               # Hash map implementation
+-- ll                    # Linked list implementation
```

---

## ?? Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Python 3.14** | Core language |
| **FastAPI** | High-performance REST API framework |
| **SQLAlchemy** | ORM for database interaction |
| **SQLite** | Lightweight relational database (`instads.db`) |
| **Pydantic** | Data validation & serialization schemas |
| **Uvicorn** | ASGI server to run FastAPI |

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI component framework |
| **TypeScript** | Static typing for robust code |
| **Vite 6** | Lightning-fast build tool & dev server |
| **React Router v7** | Client-side routing & navigation |
| **Tailwind CSS v4** | Utility-first styling |
| **Framer Motion** | Animations & transitions |
| **Lucide React** | Icon library |
| **Google Genai SDK** | AI integration support |

### Data Structures (C)
| File/Folder | Implementation |
|---|---|
| `ll` | **Linked List** |
| `hashmap` | **Hash Map** |
| `graph.c` | **Graph** (adjacency list / matrix) |
| `Search_algo/queue` | **Queue** |
| `Search_algo/tree` | **Binary Tree / BST** |
| `Search_algo/Array/` | **Array** operations |

---

## ? Features

### ?? Frontend (React App)
- **Authentication** — Register & Login with token-based auth
- **Home Feed** — Paginated post feed with infinite scroll ("Load more")
- **Stories Bar** — Horizontal scrollable stories from followed users
- **Post Cards** — Like, comment, save, share, and view post details
- **Post Detail Modal** — Full post view with comment section
- **Explore Page** — Discover and search for users and content
- **User Profiles** — View follower/following counts, posts grid, and edit profile
- **Notifications** — Real-time activity feed (likes, comments, follows, mentions)
- **Saved Posts** — Bookmark and revisit saved content
- **Create Post** — Upload images with captions, location tags, and hashtags
- **Suggested Users Sidebar** — Follow/unfollow recommendations
- **Responsive Layout** — Mobile nav + desktop sidebar layout
- **Dark/Light Mode** — System-aware theming

### ?? Backend (FastAPI)
- `POST /auth/register` — Register a new user
- `POST /posts/` — Create a new post
- `GET /` — Health check / welcome endpoint
- Auto-generated interactive API docs at `/docs` (Swagger UI)

---

## ??? Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+ (or Bun)
- Git

---

### ?? Backend Setup

```bash
cd Backend
python -m venv venv
venv\Scripts\activate      # Windows
# source venv/bin/activate # macOS/Linux

pip install fastapi uvicorn sqlalchemy pydantic
uvicorn main:app --reload
```

API: http://127.0.0.1:8000  
Docs: http://127.0.0.1:8000/docs

---

### ?? Frontend Setup

```bash
cd Frontend
npm install
cp .env.example .env
npm run dev
```

App: http://localhost:3000

---

## ?? API Reference

### Authentication

| Method | Endpoint | Description | Body |
|---|---|---|---|
| `POST` | `/auth/register` | Register a new user | `{ username, email, password }` |

### Posts

| Method | Endpoint | Description | Body |
|---|---|---|---|
| `POST` | `/posts/` | Create a new post | `{ caption, image_url, user_id }` |

### System

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Welcome message / health check |
| `GET` | `/docs` | Swagger UI (interactive API docs) |

---

## ??? Database Schema

### `users` Table
| Column | Type | Constraints |
|---|---|---|
| `id` | INTEGER | Primary Key, Auto-increment |
| `username` | STRING | Unique, Not Null, Indexed |
| `email` | STRING | Unique, Not Null, Indexed |
| `password` | STRING | Not Null |

### `posts` Table
| Column | Type | Constraints |
|---|---|---|
| `id` | INTEGER | Primary Key, Auto-increment |
| `caption` | STRING | Nullable |
| `image_url` | STRING | Nullable |
| `user_id` | INTEGER | Not Null (Foreign key to users) |

---

## ?? Data Structures Used

This project demonstrates how core data structures power real-world applications:

| Data Structure | Real-World Application in InstaDS |
|---|---|
| **Linked List** (`ll`) | Story queue, notification chains |
| **Hash Map** (`hashmap`) | O(1) user lookup, like/save state caching |
| **Graph** (`graph.c`) | Follower/following social graph, BFS for suggestions |
| **Queue** (`Search_algo/queue`) | Feed loading queue, notification delivery |
| **Tree / BST** (`Search_algo/tree`) | Sorted post retrieval, comment threading |
| **Array** (`Search_algo/Array`) | Post grid display, paginated feed arrays |

---

## ?? Key Frontend Architecture Decisions

- **Mock Data Layer** — `src/services/mock/` provides a complete in-memory data store with sample users, posts, comments, stories, and notifications. This allows the frontend to run fully without a backend connection during development.
- **Context API** — `AuthContext` and `NotificationContext` manage global state without external state libraries.
- **Service Layer** — All API calls are abstracted into `/services/api/` modules (`authApi`, `feedApi`, `postApi`, `userApi`, `notificationApi`), making it easy to swap mock data for real endpoints.
- **TypeScript Interfaces** — All domain models (`User`, `Post`, `Comment`, `Story`, `NotificationItem`) are defined in `src/types/index.ts`.

---

## ?? Authors

- **Aryan Mokal** — [@aryanmokal](https://github.com/aryanmokal)

---

## ?? License

This project was created as part of a **Fundamentals of Data Structures (FODS)** academic course project.

---

> _"Good code is not just about working software — it is about understanding the structures that power it."_
