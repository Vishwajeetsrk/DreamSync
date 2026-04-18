# DreamSync Admin Control Center — Planning & Phase 1

## 1. Vision
The Admin Module will transition the platform from a "Static/Curation" model to a "Dynamic Management" model. This allows administrators to manage users, update community calendars (Google Meets), and post jobs without touching the code.

## 2. Core Admin Features

### A. User Management
- **View All Users**: Paginated list of registered students from Firestore.
- **Search & Filter**: Find users by email, name, or career interest.
- **Edit Profile**: Capability to manually update user details if requested.
- **Access Control**: Switch user roles (User ↔ Admin).

### B. Community Management (Meetings & Events)
- **Meeting Scheduler**: Form to add new "Weekly Chats" or "Workshops."
- **Google Meet Integration**: Field to input active meet links.
- **Auto-Archive**: Hide meetings once their scheduled time has passed.

### C. Opportunity Management (Jobs & Internships)
- **Job Poster**: Dashboard to add "Junior Developer," "Internship," or "Volunteer" roles.
- **Application Tracker**: View internal applications if the platform supports "Easy Apply."
- **Direct Link Management**: Edit or remove expired job portal links.

### D. Resource Library
- **Docs Admin**: Add new career roadmaps (PDFs) or official govt. links.
- **Category Management**: Edit resource categories (e.g., "Engineering," "Law," "Freelance").

## 3. Technical Architecture

### Permission Logic
- **Firestore Security Rules**: Restrict write access to `/users`, `/activities`, and `/opportunities` based on `auth.token.role === 'admin'`.
- **Protected Layout**: A `/src/app/admin/layout.tsx` that checks for `userData.role` and redirects to login if unauthorized.

### Data Models (Firestore)
- **`activities`**: `{ title, desc, date, time, location, link, icon, type, count }`
- **`opportunities`**: `{ title, org, type, tags[], deadline, link }`
- **`users`**: `{ name, email, avatar_url, role: 'admin' | 'user', career_data }`

## 4. UI/UX Strategy
- **Dashboard Layout**: Sidebar navigation for "Users," "Community," "Jobs," and "Settings."
- **Action Feed**: A "Recent Activity" log showing what admins have changed recently.
- **Design Consistency**: Maintain the **Neobrutalist** DNA with sharp black borders but use a "High Contrast Admin Blue" to distinguish the workspace from the student dashboard.

---
*Status: Ready for implementation.*
