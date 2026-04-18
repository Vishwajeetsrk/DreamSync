# DreamSync Platform Requirement Specification (PRS)

## 1. Functional Requirements (FR)

### FR-01: Admin Authentication & Authorization
- System must identify users with `role: admin` in Firestore.
- System must restrict access to the `/admin` route group to verified administrators only.

### FR-02: Universal User CRUD
- Admin must be able to **Create** test users.
- Admin must be able to **Read** all user profiles and usage statistics.
- Admin must be able to **Update** user roles and career data.
- Admin must be able to **Delete** or deactivate accounts in case of safety violations.

### FR-03: Dynamic Content Management (CMS)
- Admin must be able to add/edit/delete records in the `activities` collection (Community Meetings).
- Admin must be able to add/edit/delete records in the `opportunities` collection (Jobs).
- System must provide a real-time preview of how events look in the Community Hub before publishing.

### FR-04: Meeting Integration
- Admin must be able to link specific Google Meet URLs to activity cards.

## 2. Non-Functional Requirements (NFR)

### NFR-01: Performance
- The Admin dashboard must load in under 2 seconds.
- Database updates (Firestore) must reflect on the user-side (Community Hub) within 5 seconds of submission.

### NFR-02: Security
- Secure API routes: All Admin-specific POST/PUT/DELETE requests must be verified via a Firebase ID token on the server.
- Audit Logging: Every administrative action must be logged with a timestamp and the Admin's ID.

### NFR-03: Responsiveness
- The Admin dashboard must be fully functional on a tablet/iPad Pro for "on-the-go" moderation.

## 3. Platform Languages & Frameworks
- **Frontend**: TypeScript, React, Next.js.
- **Backend**: Node.js (Next.js Serverless Functions).
- **Storage**: Firebase Firestore.
- **Auth**: Firebase Auth, NextAuth v5.

## 4. Constraint & Assumptions
- **Constraint**: Admin tools must not break the Neobrutalist styling.
- **Assumption**: The administrator has basic familiarity with web interfaces and career terminology.

---
*System Specification v1.0*
