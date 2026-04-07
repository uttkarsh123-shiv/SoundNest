## SoundNest – System Design (Interview Friendly)

This document explains the system design of **SoundNest** in simple, SDE‑1‑friendly language so you can walk an interviewer through it without deep system design prep.

---

## 1. Problem & High‑Level Idea

- **Problem**: Creating podcasts is slow and expensive (recording, editing, voice talent). Discovery and engagement are also fragmented across platforms.
- **Solution**: **SoundNest** is an AI‑powered podcast platform that:
  - Turns **text into podcasts** (script → AI voice audio + thumbnail)
  - Provides **discovery, search, and social features** (follows, likes, ratings, comments)
  - Supports **real‑time feeds and notifications**

**One‑line pitch**:  
> SoundNest lets anyone turn text into a publish‑ready podcast and then discover, follow, and interact with that content in a single platform.

---

## 2. High‑Level Architecture

Think in **three layers**:

1. **Client (Web App)**  
   - React / Next.js UI  
   - Uses Convex client (`useQuery`, `useMutation`) to talk to backend  
   - Uses API route for ElevenLabs audio

2. **Backend (BaaS + APIs)**  
   - **Convex** functions for:
     - Authentication integration
     - Podcast CRUD, feeds, filters
     - Social graph (follows, likes, ratings, comments)
     - Notifications, admin reports, admin requests
   - **Next.js API route** for:
     - ElevenLabs text‑to‑speech audio generation
   - **Third‑party AI services**:
     - Gemini – content/script generation
     - ElevenLabs – voice synthesis
     - Freepik – thumbnail generation

3. **Data & Storage**
   - **Convex database** for structured data (users, podcasts, interactions, notifications, reports, adminRequests)
   - Convex **file storage** for audio/image blobs (referenced by storage IDs)

You can describe it as a **single‑page app hitting a BaaS backend**, which in turn calls external AI services and manages database + storage.

---

## 3. Core Components & Responsibilities

- **Frontend**
  - Pages for home, discover, create‑podcast, podcast detail, community, profile, notifications, admin
  - Reusable components for podcast lists/cards, player, filters, profile, sidebars
  - Calls Convex queries/mutations and one ElevenLabs API route

- **Convex Backend**
  - **Domain logic**:
    - Podcasts: create, update, delete, fetch details, feeds, filters
    - Users: create/update from Clerk, profiles, stats, admin status
    - Social: follows, likes, ratings, comments
    - Notifications: creation, listing, marking as read
    - Reports & admin requests: create, list, update status
  - **Real‑time query layer**:
    - `useQuery` automatically subscribes to data and re‑renders on changes
  - **File management**:
    - Generate upload URLs, store audio/images, return public URLs

- **AI & Media Services**
  - **Gemini**: generate or refine podcast script/content from prompts
  - **ElevenLabs**: convert final text into audio (MP3)
  - **Freepik**: generate thumbnails from prompts / podcast metadata

- **Authentication**
  - **Clerk**: handles sign‑up, login, sessions
  - Convex receives Clerk webhooks and stores user records

---

## 4. Data Model (Convex Tables)

Main tables (simplified):

- **`users`**
  - `clerkId`, `email`, `name`, `imageUrl`
  - `followersCount`, `followingCount`
  - `bio`, `website`, `socialLinks[]`
  - `isVerified`, `isAdmin`

- **`podcasts`**
  - `user` (id of `users`)
  - `podcastTitle`, `podcastDescription`
  - `audioUrl`, `audioStorageId`
  - `imageUrl`, `imageStorageId`
  - `author`, `authorId`, `authorImageUrl`
  - `voicePrompt`, `imagePrompt`, `voiceType`
  - `audioDuration`, `views`
  - `podcastType`, `language`
  - `likes[]`, `likeCount`
  - `averageRating`, `ratingCount`
  - **Search indexes** on `podcastTitle`, `author`, `podcastDescription`

- **`ratings`**
  - `podcastId`, `userId`, `rating`, `createdAt`

- **`comments`**
  - `podcastId`, `userId`, `userName`, `userImageUrl`, `content`, `createdAt`

- **`follows`**
  - `follower`, `following`, `createdAt`

- **`notifications`**
  - `userId`, `creatorId`, `type`, `podcastId`, `message`, `isRead`, `_creationTime`

- **`reports`**
  - `podcastId`, `podcastTitle`
  - `reportType`, `details`, `contactEmail`
  - `reportedBy`, `status`, `reviewedBy`, `reviewNotes`

- **`adminRequests`**
  - `userId`, `reason`, `status`, `createdAt`, `reviewedAt`, `reviewedBy`, `reviewNotes`

**How to say it in interview**:  
> I modeled the system around core entities like users, podcasts, and interactions (likes, follows, ratings, comments), and added tables for notifications and moderation to support a full social product.

---

## 5. Key Flows (Step‑by‑Step)

### 5.1. User Authentication & Profile Creation

1. User signs up or logs in via **Clerk**.
2. Clerk sends a **webhook** to the Convex `http` handler.
3. Convex creates or updates a record in the `users` table.
4. Frontend reads user data through Convex queries and shows profile, stats, etc.

**Interview phrasing**:  
> Auth is delegated to Clerk. On user events, Clerk webhooks call Convex, which keeps an internal `users` table in sync so backend logic can rely on it.

---

### 5.2. Create Podcast (Core Flow)

1. **User fills form**:
   - Title, description, type, language
   - Optional AI prompts (tone, target audience, style, notes)
2. **Content generation (Gemini)**:
   - Frontend calls a service that uses Gemini to generate or refine the script.
   - Errors (network, overload) are caught and mapped to friendly messages.
3. **Audio generation (ElevenLabs)**:
   - Frontend calls the Next.js API route `/api/elevenlabs`.
   - Backend calls ElevenLabs with text + voice type, streams/collects audio.
   - Returns MP3 buffer as response.
4. **Upload to storage**:
   - Frontend uploads audio (and thumbnail image) through Convex file functions.
   - Receives `audioStorageId` / `imageStorageId` and public URLs.
5. **Persist podcast**:
   - Frontend calls `api.podcasts.createPodcast` with all metadata.
   - Convex saves record in `podcasts` table and updates indexes.
6. **Result**:
   - Podcast immediately appears in feeds (home, discover, profile).

---

### 5.3. Discovery & Feed Generation

**Home / Discover pages** use Convex queries like:

- Get **trending**, **top‑rated**, **latest**, and **popular** podcasts
- Apply filters (category, language, search term)
- Use search indexes on title/author/description

Flow:
1. Frontend calls `useQuery(api.podcasts.getFilteredPodcasts, { type, limit, filters })`.
2. Convex resolves the query using indexes and returns a list.
3. Because queries are **reactive**, any change (new podcast, updated ratings, likes) automatically re‑renders the feed.

**Interview phrasing**:  
> Feeds are built on top of Convex queries with appropriate indexes so common read patterns like “trending” or “search by title” are efficient.

---

### 5.4. Social Interactions (Likes, Follows, Comments, Ratings)

**Likes & Ratings**
1. User clicks like or submits a rating.
2. Frontend optimistically updates UI (to feel snappy).
3. Convex mutation updates `likes`, `likeCount`, `averageRating`, `ratingCount`.
4. On error, UI rolls back and shows a toast.

**Comments**
1. User posts a comment.
2. Convex mutation adds record to `comments` table.
3. Query subscribed via `useQuery` updates comment list in real time.

**Follows**
1. User clicks follow/unfollow on a creator.
2. Convex mutation updates `follows` records and follower/following counters on `users`.

**Notifications**
1. On key events (like, comment, follow, rating), backend creates a `notifications` record.
2. Recipient’s notifications page is driven by a Convex query, updating in real time.

---

### 5.5. Moderation & Admin

**Reports**
1. User reports a podcast from its detail page.
2. Convex mutation creates a `reports` record with type, details, and status.

**Admin Panel**
1. Admin queries all pending reports and admin requests.
2. Admin can approve/reject reports or admin access.
3. Convex updates relevant records and status fields.

---

## 6. Non‑Functional Design (Performance, Scaling, Reliability)

### 6.1. Performance

- **Client‑side**:
  - Uses skeleton loaders and spinners while data loads.
  - Pagination / limits (e.g., `limit: 3`) to avoid over‑fetching.
  - Efficient list components and memoization where needed.

- **Backend**:
  - Convex **indexes** for search and feed queries.
  - Avoids N+1 patterns by designing queries that fetch what is needed at once.

How to say it:  
> I focused on perceived performance with skeletons and small batched queries, and relied on Convex indexing to keep common queries fast.

### 6.2. Scalability

- Designed for **hundreds to low thousands of concurrent users** without redesign:
  - Convex handles backend horizontal scaling and real‑time subscriptions.
  - Data model separates users, podcasts, and interactions for flexible growth.
  - Read paths are mostly query‑based with filters and indexes.

In interview:  
> I haven’t load‑tested it at massive scale, but architecturally it can grow by scaling the Convex deployment and front‑end hosting without changing core code.

### 6.3. Reliability & Fault Handling

- **Guard clauses** (e.g., `if (!user)`, `if (!podcast)`) to avoid null crashes.
- **try/catch** and meaningful error messages around AI calls, file uploads, and content generation.
- **Graceful UI**:
  - Loader states while fetching
  - Toasts and inline errors when operations fail
  - Safe early returns when data is missing

How to say it:  
> I implemented defensive checks and user‑friendly error handling so that external AI or network failures don’t break the whole UX.

---

## 7. Security & Privacy

- **Authentication & Authorization**
  - All sensitive actions require an authenticated user (via Clerk).
  - Backend checks identity before allowing actions (create podcast, like, comment, follow, admin operations).
  - Admin‑only routes/actions gated via `isAdmin` field and checks in Convex functions.

- **Data Protection**
  - No secrets in the client; AI keys stay on the server side.
  - User IDs are validated on each mutation.

How to say it:  
> I delegated identity to Clerk and then enforced authorization in Convex, especially for write operations and admin actions.

---

## 8. Trade‑offs & Possible Improvements

You can mention these to sound thoughtful:

- **Trade‑offs**
  - Used Convex as a **managed backend** to move fast; this trades some low‑level control for speed of development and built‑in real‑time.
  - AI calls are synchronous in the request path; for very long content or huge traffic, it might be better to move them to background jobs or queues.

- **Potential Improvements**
  - Add rate limiting and stronger abuse protection on report and comment endpoints.
  - Introduce background processing for heavy AI tasks and long audio generation.
  - More detailed observability (metrics, tracing, error dashboards).

---

## 9. How to Explain This in an Interview (Script)

You can roughly say:

> “SoundNest is an AI‑powered podcast platform. Architecturally, it’s a React/Next.js frontend talking to a Convex backend, which acts as both the database layer and the API layer. The core entities are users, podcasts, and social interactions (likes, follows, ratings, comments), plus notifications and reports for moderation.  
>  
> When a creator makes a podcast, they enter text and prompts. I use Gemini to generate or refine the script, ElevenLabs to convert that text to audio, and Freepik to generate a thumbnail. The audio and image are uploaded via Convex file functions and stored with storage IDs, then I create a podcast record in the Convex database.  
>  
> Discovery is powered by Convex queries with search indexes, so I can show trending, latest, or filtered podcasts efficiently. Social features like likes, follows, comments, and ratings are just additional tables and mutations, and notifications are driven by writing into a `notifications` table that the client subscribes to in real time.  
>  
> Non‑functionally, I focused on perceived performance with small, indexed queries and skeleton UIs, and I use Convex’s real‑time updates instead of building my own cache. For security, Clerk handles authentication and I enforce authorization in Convex, especially for writes and admin actions.”  

You can adapt this script based on how deep the interviewer wants to go.







