# SoundNest - AI Podcast Platform

AI-powered podcast platform with text-to-audio generation, social features, and comprehensive content management.

## Features

### Core Functionality
- **AI Podcast Generation**: Text-to-speech using ElevenLabs with 5 voice types
- **AI Content Creation**: Script generation via Gemini AI
- **AI Thumbnails**: Automated thumbnail generation using Freepik
- **Audio Player**: Full-featured player with controls, progress tracking, and sticky playback
- **Real-time Search**: Multi-field search across titles, authors, and descriptions

### Social Features
- **User Profiles**: Customizable profiles with bio, social links, and verification status
- **Follow System**: Follow/unfollow creators with follower/following counts
- **Ratings & Reviews**: 5-star rating system with average calculations
- **Comments**: Real-time commenting on podcasts
- **Likes**: Like/unlike functionality with counts
- **Notifications**: Real-time notifications for interactions

### Content Management
- **Categories & Languages**: Podcast categorization and language filtering
- **Advanced Filters**: Filter by type, language, rating, and popularity
- **View Tracking**: Podcast view counts and analytics
- **Content Moderation**: Report system with admin review workflow

### Admin Features
- **Admin Panel**: Comprehensive admin dashboard
- **User Management**: Admin access requests and approvals
- **Content Moderation**: Review and manage reported content
- **Statistics**: Platform analytics and user metrics

## Tech Stack

**Frontend**: Next.js 14, TypeScript, Tailwind CSS, ShadCN UI  
**Backend**: Convex (BaaS), Clerk Authentication  
**AI Services**: ElevenLabs (TTS), Gemini (Content), Freepik (Images)  
**Database**: Convex with real-time subscriptions  
**Storage**: Convex file storage for audio/images

## Database Schema

- **users**: Profile data, follower counts, admin status, verification
- **podcasts**: Content, metadata, ratings, likes, view counts
- **ratings**: User ratings with timestamps
- **comments**: Threaded comments with user info
- **follows**: Follow relationships between users
- **notifications**: Real-time notification system
- **reports**: Content moderation and reporting
- **adminRequests**: Admin access management

## Component Architecture

**70+ React Components** organized by feature:
- **Admin**: Navigation, statistics, access requests
- **Community**: User discovery and search
- **CreatePodcast**: Multi-step creation flow with AI integration
- **Discover**: Advanced filtering and search
- **Home**: Featured content and latest podcasts
- **Notification**: Real-time notification management
- **PodcastCard**: Grid and list view components
- **PodcastId**: Detailed podcast pages with interactions
- **PodcastPlayers**: Audio controls and fullscreen player
- **Profile**: User profiles with podcast management
- **Sidebars**: Navigation and user info
- **UI**: 20+ reusable UI components

## Pages & Routes

- **Home** (`/`): Featured and latest podcasts
- **Discover** (`/discover`): Browse with filters
- **Create** (`/create-podcast`): AI-powered podcast creation
- **Profile** (`/profile/[id]`): User profiles and podcast management
- **Podcast** (`/podcasts/[id]`): Detailed podcast view with player
- **Community** (`/community`): User discovery
- **Notifications** (`/notification`): Real-time updates
- **Admin** (`/admin`): Platform management (admin only)
- **Auth** (`/sign-in`, `/sign-up`): Authentication pages

## Key Features Implementation

- **Real-time Updates**: Convex subscriptions for live data
- **File Management**: Audio/image upload with storage IDs
- **Search Indexing**: Full-text search across multiple fields
- **Responsive Design**: Mobile-first with adaptive layouts
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Loading States**: Skeleton loaders and spinners throughout
- **Accessibility**: ARIA labels and keyboard navigation

## Installation

```bash
git clone <repository-url>
cd soundnest
npm install
npm run dev
```

## Environment Variables

```env
NEXT_PUBLIC_CONVEX_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
ELEVENLABS_API_KEY=
GOOGLE_GENERATIVE_AI_API_KEY=
FREEPIK_API_KEY=
```

Built with modern web technologies for scalable podcast creation and community engagement.
    │   ├── LeftSidebar.tsx
    │   ├── LoaderSpinner.tsx
    │   ├── MobileNav.tsx
    │   ├── PodcastCard.tsx
    │   ├── PodcastDetailPlayer.tsx
    │   ├── PodcastPlayer.tsx
    │   ├── ProfileCard.tsx
    │   ├── RightSidebar.tsx
    │   ├── Searchbar.tsx
    │   └── ui
    ├── components.json
    ├── constants
    │   └── index.ts
    ├── convex
    │   ├── _generated
    │   ├── auth.config.ts
    │   ├── files.ts
    │   ├── freepik.ts
    │   ├── http.ts
    │   ├── openai.ts
    │   ├── podcasts.ts
    │   ├── schema.ts
    │   ├── tasks.ts
    │   ├── unreal.ts
    │   └── users.ts
    ├── lib
    │   ├── formatTime.ts
    │   ├── useDebounce.ts
    │   └── utils.ts
    ├── middleware.ts
    ├── next.config.mjs
    ├── package-lock.json
    ├── package.json
    ├── postcss.config.mjs
    ├── providers
    │   ├── AudioProvider.tsx
    │   └── ConvexClerkProvider.tsx
    ├── public
    │   ├── Amy.mp3
    │   ├── Dan.mp3
    │   ├── Liv.mp3
    │   ├── Scarlett.mp3
    │   ├── Will.mp3
    │   ├── icons
    │   └── images
    ├── sampleData.jsonl
    ├── tailwind.config.ts
    ├── tsconfig.json
    └── types
        └── index.ts
```
---

## 🚀 Getting Started

### 📦 Installation

Build the project from source:

1. Clone the SoundNest repository:
```sh
❯ git clone https://github.com/uttkarsh123-shiv/SoundNest.git
```

2. Navigate to the project directory:
```sh
❯ cd SoundNest
```

3. Install the required dependencies:
```sh
❯ npm install
```

### 🤖 Usage

To run the project, execute the following command:

```sh
❯ npm run dev
```