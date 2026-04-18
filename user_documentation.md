# DreamSync User Module Documentation

## 1. Overview
DreamSync is a high-fidelity career intelligence platform designed to empower students and job seekers through AI-driven tools. It follows a unique "Neobrutalist" aesthetic characterized by high contrast, hard shadows, and bold typography.

## 2. Core Features (The 9 Career Intelligence Modules)
Each module is designed for mobile-first accessibility and professional utility.

| Feature | Description | Key Components |
| :--- | :--- | :--- |
| **Ikigai Finder** | Helps users find their "reason for being" by intersecting passion, mission, vocation, and profession. | Circular Venn UI, AI Analysis |
| **Resume Builder** | Generates professional, minimalist resumes in real-time. | Live Preview, Multi-Section Form |
| **ATS Score Check** | Analyzes resume alignment with industrial hiring standards. | Percentage Gauge, Skill Gap Analysis |
| **Portfolio Generator** | Creates a single-file, stunning HTML portfolio using AI. | Theme Selection, Live AI Generation |
| **AI Roadmap** | Generates a 90-day step-by-step career progression plan. | Progress Timeline, Resource Links |
| **Documents & Resources** | A central repository for govt. documents and free educational material. | Resource Grid, Downloadable Assets |
| **LinkedIn Helper** | Optimizes profiles to attract recruiters and technical leads. | Profile Audit, Headline Generator |
| **Career Agent** | A proactive AI chat assistant for strategic career advice. | Real-time Chat, Flowchart Rendering |
| **Mental Health AI** | A supportive AI companion specializing in career stress and student well-being. | Voice Interaction (Speech-to-Text) |

## 3. Technology Stack
- **Framework**: [Next.js 16.2.2](https://nextjs.org/) (Turbopack)
- **Styling**: Vanilla CSS + [Tailwind CSS](https://tailwindcss.com/)
- **Authentication**: Dual-layer ([NextAuth.js](https://next-auth.js.org/) + [Firebase Auth](https://firebase.google.com/docs/auth))
- **Database**: [Firebase Firestore](https://firebase.google.com/docs/firestore)
- **State Management**: React Context API (`AuthContext`)
- **AI Integration**: Multi-provider fallback (Groq, OpenRouter, Google Gemini)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/) + FontAwesome 6.4.0

## 4. Visual Language & Typography
- **Design Style**: Neobrutalism (High-fidelity black borders, offset shadows, vibrant accents).
- **Core Font**: 'Space Grotesk' (Headings), 'Inter' (Body).
- **Palette**:
    - **Primary Black**: `#000000`
    - **Electric Blue**: `#2563EB`
    - **Warning Yellow**: `#FACC15`
    - **Soft Teal**: `#14B8A6`
    - **Canvas White**: `#FFFFFF`

## 5. Navigation & User Lifecycle
1. **Landing Page**: Modular scroll experience with high-impact CTAs.
2. **Onboarding**: Login/Signup via Google, GitHub, or Email.
3. **Dashboard**: Centralized tool matrix for launching career modules.
4. **Community**: Access to live workshops, group chats, and job opportunities.
5. **Profile**: Management of career data and platform settings.

---
*Last Updated: April 18, 2026*
