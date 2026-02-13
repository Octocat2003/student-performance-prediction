# Specification

## Summary
**Goal:** Deliver an MVP campus management app on the Internet Computer with Internet Identity login, announcements, and polling-based in-app notifications.

**Planned changes:**
- Add Internet Identity authentication and a persisted user profile (principal, display name, optional department/program) with create-on-first-login and user-edit flow.
- Implement announcements CRUD for create, list (newest first), view details, and delete (author-only), including readable timestamps.
- Add backend notifications generated on announcement creation, plus APIs to fetch per-user notifications and mark them read, linking notifications to announcements.
- Implement frontend polling to refetch notifications on an interval, show unread badge count, and display a toast/alert when new unread notifications arrive.
- Create responsive app navigation/layout with sections for Sign in, Dashboard, Announcements, Notifications, and Profile, gating announcement creation behind authentication.
- Apply a consistent Tailwind-based visual theme (non-blue/purple primary) across all screens using composed existing UI components.
- Persist profiles, announcements, notifications, and read state in stable structures in a single Motoko actor to survive upgrades.
- Add and reference generated static image assets from `frontend/public/assets/generated` in the UI (e.g., header/login).

**User-visible outcome:** Users can sign in with Internet Identity, manage their profile, create and browse announcements, and receive near-real-time in-app notifications (with unread badge and toasts) that they can mark as read, all within a responsive themed UI.
