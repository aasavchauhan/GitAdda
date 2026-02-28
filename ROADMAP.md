# GitAdda Project Roadmap

This document outlines planned features and future improvements for the GitAdda platform.

## ✅ Completed

### Advanced Sorting & Filtering
- Sort by Recent, Stars, Forks, Trending on the Explore page
- Use-case tag filters (SaaS, AI/ML, Backend, Frontend, DevOps, Mobile, Tools)
- Full-text search with `tsvector`

### User Collections / Lists
- Named collections (e.g., "My DevOps Stack", "Favorite React Libraries")
- Quick-save button on repo cards
- Collection detail pages

### PWA & Mobile UX
- Installable PWA with service worker
- Bottom tab mobile navigation
- Install prompt banner

### Notifications
- Real-time notification bell via Supabase Realtime
- Like, follow, and comment notifications

### Follow System
- Follow/unfollow users
- Follower/following counts on profiles

### "Repo of the Day" Spotlight
- Hero section on the homepage that rotates daily to highlight a top-rated repository
- Deterministic daily rotation using ELO rankings

### Better Developer Rankings
- Weighted scoring algorithm (repos shared × 3 + followers × 2 + likes received × 1 + collections × 1)
- Activity breakdown on developer cards

### Wars Rate Limiting
- Max 30 votes per user per hour via `war_votes` table
- Authentication required for all voting

### Batch Like Prefetch
- Eliminated N+1 like queries with batch fetching on homepage and explore

---

## 🚧 In Progress

### AI-Powered "Similar Repos"
**Goal:** Improve discovery by suggesting related tools.
- **Concept:** Show a "Similar Tools" section on repository detail pages (e.g., viewing "Next.js" suggests "Remix").
- **Implementation:** Could use vector embeddings (via Supabase pgvector) or tag-based matching.

---

## 🔮 Future Ideas

- Activity / trending feed
- Dark/light theme toggle
- OAuth token refresh handling
- Atomic ELO updates via Supabase RPC

---
*Last updated: February 2026*
