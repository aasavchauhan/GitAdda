# GitAdda Project Roadmap

This document outlines planned features and future improvements for the GitAdda platform.

## Future Enhancements (To Be Discussed)

### 1. AI-Powered "Similar Repos"
**Goal:** Improve discovery by suggesting related tools.
- **Concept:** Show a "Similar Tools" section on repository detail pages (e.g., viewing "Next.js" suggests "Remix").
- **Implementation:** Could use vector embeddings (via Supabase pgvector) or tag-based matching.

### 2. "Repo of the Day" Spotlight
**Goal:** Increase user engagement with fresh content.
- **Concept:** A hero section on the homepage that rotates daily to highlight a high-quality repository.
- **Implementation:** Automated cron job or manual curation queue.

### 3. Advanced Sorting & Filtering
**Goal:** Empower users to find exactly what they need.
- **Concept:** Add sorting options to the Explore page.
- **Options:** "Most Recently Added", "Most Stars", "Most Forks", "Best Match".

### 4. User Collections / Lists
**Goal:** Enable social curation.
- **Concept:** Allow users to create and share named lists of repositories (e.g., "My DevOps Stack", "Favorite React Libraries").
- **Implementation:** New database tables for `collections` and `collection_items`.

---
*Last updated: January 2026*
