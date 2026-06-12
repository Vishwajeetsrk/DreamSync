# DreamSync — AI-Powered Career Intelligence & Empathetic Support Platform

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.2.2-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=for-the-badge&logo=vercel)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Empowering career journeys for students and care-experienced youth.**
**Find your path, build your professional identity, and grow with empathetic AI guidance.**

### 🌐 [Live Platform →](https://dream-sync-nine.vercel.app/) &nbsp;&nbsp;|&nbsp;&nbsp; 📂 [Source Code →](https://github.com/Vishwajeetsrk/DreamSync)

</div>

---

##  Human-Centric Design System

DreamSync features an **NGO-Inspired, Supportive, and Highly Accessible** design architecture:

| Principle | Implementation |
| :--- | :--- |
| **Trust & Clarity** | Calming `Stone-50` and `Emerald` palettes with soft organic shapes (`rounded-[3rem]`) to reduce digital anxiety |
| **High Readability** | Modern typography (`Inter`, `Outfit`) with high-contrast buttons suitable for all digital literacy levels |
| **Empathetic UX** | Interactive micro-animations via `Framer Motion` with premium, organic visual feedback |
| **Mobile-First** | Fully responsive layouts across all 9 modules with optimized touch targets and mobile navigation |

---

## ✨ 9 Core Support Modules

### 1. 🧠 Ikigai Architect
Discover your professional alignment at the intersection of **Passion, Skills, Market, and Income** with automated Venn diagram rendering. Features interactive exploration with personalized career path suggestions.

### 2. 📄 AI Resume Forge & Builder
A tabbed sidebar resume editor with powerful AI enhancements:
- **✨ Optimize Summary with AI** — Generates tailored professional bios
- **✨ AI Enhance Bullets** — Rewrites experience bullets using the STAR method
- **ATS Insights Tab** — Real-time compatibility scores, target company checklists (Google, Microsoft), missing keyword analysis, and recommended courses
- **Export Options** — Printer-ready PDF & Word document exports

### 3. 🛡️ ATS Resume Score Checker
Drag-and-drop resume scanner that checks keyword density and structural alignment against target job descriptions with instant rewrite indicators and actionable improvement suggestions.

### 4. 🤖 AI Career Guide & Coach
Empathetic AI coach delivering:
- Real-time salary insights for Indian markets
- Localized job postings and opportunities
- Structured 90-day progress roadmaps
- Personalized career path recommendations

### 5. 💼 LinkedIn Pro Profile Optimizer
Instantly optimize LinkedIn profiles with AI-powered headline tuning, "About" bio generation, and personalized outreach networking templates.

### 6. 🗺️ Skills & Document Roadmap
Milestone progress timelines paired with a dedicated guide on obtaining essential Indian documents (Aadhaar, PAN, E-Shram, Bank Account, etc.).

### 7. 🌱 Peer Community Hub
A safe ecosystem for connecting with peer circles, digital mentors, and local NGO career events. Features community cards and social proof indicators.

### 8. 🖼️ Dynamic Stand-alone Portfolio Engine
Instantly generate responsive web portfolios with **7 distinct themes**:

| Theme | Style |
| :--- | :--- |
| **Minimal Dev** | Clean white, editorial typography, professional |
| **Soft Warm** | Rose/cream gradients, empathetic, friendly |
| **Glass Light** | Violet glassmorphism, modern, futuristic |
| **Emerald Pro** | Green success theme, professional growth |
| **Neo-Brutalism** | Bold borders, yellow/pink accents, high contrast |
| **Glass Dark** | Apple-level dark mode, violet/cyan glows |
| **Vishwa Pro (Data)** | Particle backgrounds, data-driven, tech-forward |

Features:
- **Interactive Real-Time Preview** — Maps theme colors, glassmorphism, fonts, and user updates instantly
- **Resume Import** — Upload PDF resume to auto-populate all fields
- **Profile Photo Upload** — Base64-encoded image embedding
- **Resume/CV Link** — Prominent download button in hero section
- **Project Image Support** — Display screenshots/GIFs for each project
- **One-Click Download** — Export complete HTML portfolio file
- **Deployment Guide** — Built-in instructions for Vercel, GitHub Pages, and Netlify

### 9. 🌸 Serenity AI Mental Health Companion
Empathetic voice & text buddy for burnout and stress:
- **Language Selection** — 11+ Indian languages (Hindi, Telugu, Tamil, Bengali, Marathi, Gujarati, Kannada, Malayalam, Odia, Punjabi, Urdu)
- **Dynamic Prompt Lock** — AI replies restricted to the chosen language
- **Optimized TTS** — Pitch `1.0`, rate `0.90` with high-quality natural/neural browser voices
- **Local Helplines** — Indian mental health crisis helplines integrated

---

## 🔄 Latest Updates & Bug Fixes (June 2026)

### 🐛 Portfolio Engine — Critical Fixes & Features
- **Added**: Smart Social Link Formatter — automatically formats raw usernames into valid LinkedIn/GitHub URLs.
- **Added**: Profile Photo Rendering — integrated base64 profile image rendering directly into the hero section of generated portfolios with theme-specific styling.
- **Fixed**: Missing UI Fields — restored LinkedIn and GitHub input fields in the Portfolio UI (Step 1) so users can easily append their social links.
- **Improved**: Enhanced Presentation — Experience and Projects in the fallback generator are now parsed into beautiful standalone UI cards instead of continuous text.
- **Added**: Smart Project Rendering — The engine now detects base64 images and URLs inside project descriptions to automatically render rich project cards with image previews and "View Project" buttons.
- **Improved**: Robust Parsing Engine — Replaced standard newline joining with a highly secure custom delimiter (`|§|`) to ensure multi-line project descriptions and massive base64 image strings parse flawlessly without truncating or merging.
- **Fixed**: Project Showcase Images & GIFs — resolved an issue where project screenshots/GIFs (like the one for "DreamSync — AI Career Intelligence & Support Platform") were not rendering in the final generated HTML portfolio. Implemented explicit tag-style delimiters (`[LINK]`, `[IMAGE]`, and `[CERTIFICATE]`) to prevent serialization collision. Also implemented an automatic Google Drive link formatter that detects and converts web viewer URLs (`drive.google.com/file/d/.../view`) into direct embeddable download URLs (`lh3.googleusercontent.com/d/...`) so that Google Drive hosted images/GIFs render perfectly in standard HTML `<img>` tags.
- **Added**: Advanced Experience Presentation — Upgraded Experience cards to automatically format task lists into bullet points (`<ul><li>`), dynamically highlight company names in blue, and color-code `[Internship]` (green) and `[Work]` (yellow) tags.
- **Added**: Comprehensive Profile Sections — Upgraded the frontend UI (Steps 1 & 3) to include dedicated input fields and dynamic array builders for Languages, Awards, and Certifications. The "Parse Resume" AI now automatically extracts and populates these fields. The fallback generator fully parses and renders these into standalone UI cards (with dynamic link buttons and custom skills chips).
- **Improved**: Dynamic Fallback Themes — the static HTML fallback generator now fully supports and dynamically injects CSS for all 7 themes (Neo-Brutalism, Emerald Pro, Glass Dark, etc.), ensuring beautiful results even when AI providers hit rate limits.
- **Fixed**: 400 "Invalid Input" error when generating portfolios without a profile photo (Zod v4 schema nullable fix).
- **Fixed**: Right-column live preview panel was incorrectly nested inside the form column, breaking the 8+4 grid layout on desktop.
- **Improved**: Error messages now display detailed validation context (field path + reason) instead of generic "Invalid input".
- **Added**: Server-side error logging for faster debugging.

### 🏗️ Architecture Updates
- **Supabase Integration** — New primary database alongside Firebase for enhanced data management
- **Multi-Provider AI Pipeline** — Groq → OpenRouter → Gemini fallback chain with per-provider timeout controls
- **Edge Caching** — AI responses cached in Upstash Redis (24h TTL) for faster repeat queries
- **Zod v4 Migration** — Updated all API validation schemas to Zod v4 with nullable field support

---

## 🛡️ Robustness & Fault Tolerance

### Multi-Provider AI Fallback Chain
```
Groq (llama-3.3-70b → llama-3.1-8b)
  ↓ on failure
OpenRouter (7 models: Llama-3.3-70b, Qwen-2.5-72b, GPT-4o-mini, Claude-3-Haiku, Gemini Flash)
  ↓ on failure
Google Gemini (1.5-flash direct API)
```

### Safety & Security
- **AI Safety Guard** — Blocks harmful/illegal career inputs with whole-word keyword matching and safe exemptions (ethical hacker, cybersecurity analyst, etc.)
- **Rate Limiting** — Upstash Redis-powered per-user rate limiting across all API endpoints
- **Auth Protection** — Protected routes with `ProtectedRoute` wrapper enforcing authentication
- **Input Sanitization** — All API inputs validated through Zod schemas with max-length guards

### Client-Side Resilience
- **Auth Fallback** — Automatically intercepts Firestore write errors and reroutes profile updates to server-side Redis storage
- **Token Optimization** — Portfolio generation capped at 4000 tokens to prevent TPM rate limits (503 errors)
- **Timeout Control** — 45-second per-provider AbortController timeouts prevent hanging requests

---

## 🛠️ Technical Stack

### Core Framework
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| [Next.js](https://nextjs.org/) | 16.2.2 (Turbopack) | Full-stack React framework with App Router |
| [React](https://react.dev/) | 19.2.4 | UI component library |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | Type-safe development |
| [Tailwind CSS](https://tailwindcss.com/) | v4 | Utility-first CSS styling |
| [Framer Motion](https://www.framer.com/motion/) | 12+ | Animations & transitions |

### Backend & Data
| Technology | Purpose |
| :--- | :--- |
| [Supabase](https://supabase.com/) | Primary database & auth (OAuth 2.1) |
| [Firebase](https://firebase.google.com/) | Cloud Firestore, Auth (Google/GitHub/Credentials), Storage |
| [Upstash Redis](https://upstash.com/) | Rate limiting, AI response caching, profile fallback storage |
| [NextAuth.js](https://next-auth.js.org/) | Session management & multi-provider OAuth |

### AI & Intelligence
| Provider | Models | Role |
| :--- | :--- | :--- |
| [Groq](https://groq.com/) | Llama-3.3-70B, Llama-3.1-8B | Primary inference (fastest) |
| [OpenRouter](https://openrouter.ai/) | 7-model rotation | Secondary fallback |
| [Google Gemini](https://ai.google.dev/) | Gemini 1.5 Flash | Tertiary fallback |

### Utilities
| Package | Purpose |
| :--- | :--- |
| [Zod v4](https://zod.dev/) | Runtime schema validation |
| [Lucide React](https://lucide.dev/) | Icon system |
| [pdf-parse](https://www.npmjs.com/package/pdf-parse) | Resume PDF text extraction |
| [docx](https://www.npmjs.com/package/docx) | Word document generation |
| [Resend](https://resend.com/) | Transactional email delivery |

---

## 📁 Project Structure

```
DreamSync/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/                # 13 API route handlers
│   │   │   ├── portfolio/      # AI portfolio generation
│   │   │   ├── resume/         # Resume optimization
│   │   │   ├── resume-parse/   # PDF resume parsing
│   │   │   ├── career-agent/   # AI career coaching
│   │   │   ├── ats-advanced/   # ATS scoring engine
│   │   │   ├── ikigai/         # Ikigai analysis
│   │   │   ├── linkedin/       # LinkedIn optimizer
│   │   │   ├── mental-health/  # Mental health AI
│   │   │   ├── roadmap/        # Career roadmap
│   │   │   ├── profile/        # User profile management
│   │   │   ├── stats/          # Platform analytics
│   │   │   ├── usage/          # Usage tracking
│   │   │   └── auth/           # NextAuth handlers
│   │   ├── portfolio/          # Portfolio generator page
│   │   ├── resume-builder/     # Resume editor page
│   │   ├── career-agent/       # Career coach page
│   │   ├── mental-health/      # Mental health page
│   │   └── ...                 # 20+ route pages
│   ├── components/             # Reusable UI components
│   │   ├── Navbar.tsx          # Navigation bar
│   │   ├── Footer.tsx          # Site footer
│   │   ├── AIAssistant.tsx     # Floating AI assistant
│   │   ├── ResumePreview.tsx   # Live resume preview
│   │   ├── IkigaiDiagram.tsx   # Venn diagram renderer
│   │   └── ProtectedRoute.tsx  # Auth guard wrapper
│   ├── context/                # React context providers
│   │   ├── AuthContext.tsx     # Authentication state
│   │   └── LanguageContext.tsx # i18n language state
│   ├── lib/                    # Shared utilities
│   │   ├── ai.ts              # Multi-provider AI caller
│   │   ├── aiGuard.ts         # Safety input filter
│   │   ├── ratelimit.ts       # Redis rate limiter
│   │   ├── firebase.ts        # Firebase client SDK
│   │   ├── firebase-admin.ts  # Firebase Admin SDK
│   │   └── supabase.ts        # Supabase client
│   └── data/                   # Static data files
├── public/                     # Static assets
├── portfolio/                  # Standalone portfolio templates
│   ├── script.js              # Portfolio interactivity
│   └── style.css              # Portfolio styles
└── package.json               # Dependencies & scripts
```

---

## 🔑 Infrastructure & API Requirements

To operate this platform locally or in production, acquire API credentials for:

| Service | Config Key(s) | Purpose |
| :--- | :--- | :--- |
| **Firebase** | `NEXT_PUBLIC_FIREBASE_*` | Authentication & Firestore DB |
| **Supabase** | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Primary database & OAuth |
| **Upstash Redis** | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Rate limiting & caching |
| **Groq** | `GROQ_API_KEY` | Primary AI inference |
| **OpenRouter** | `OPENROUTER_API_KEY` | Secondary AI fallback |
| **Google Gemini** | `GOOGLE_API_KEY` | Tertiary AI fallback |
| **Google OAuth** | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google sign-in |
| **GitHub OAuth** | `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` | GitHub sign-in |
| **Serper** | `SERPER_API_KEY` (Optional) | Live job search indexing |

---

## 🏁 Local Development & Setup

### Prerequisites
- **Node.js** `20.x` or `22.x` — [Download](https://nodejs.org/)
- **Git** — Version control CLI
- **VS Code** — Recommended editor

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/Vishwajeetsrk/DreamSync.git
cd DreamSync

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Create environment file
cp .env.example .env.local
# Edit .env.local with your API keys

# 4. Start development server (Turbopack)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the platform.

### Environment Variables Template
Create a `.env.local` file in the project root:
```env
# Authentication
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Redis Cache
UPSTASH_REDIS_REST_URL=https://your-database.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_upstash_token

# AI Providers (at least one required)
GROQ_API_KEY=your_groq_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
GOOGLE_API_KEY=your_google_api_key

# OAuth Providers
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Optional
SERPER_API_KEY=your_serper_api_key
```

---

## 🚀 Deployment (Vercel)

1. **Push to GitHub** — Commit and push your code to the repository
2. **Import on Vercel** — [vercel.com](https://vercel.com) → Add New → Project → Import `DreamSync`
3. **Configure**:
   - Framework: **Next.js**
   - Build Command: `next build`
   - Node.js: `20.x` or `22.x`
4. **Environment Variables** — Copy all `.env.local` variables to Vercel Project Settings
5. **Deploy** — Click Deploy. Vercel builds and hosts on global edge networks
6. **Authorize Domain** — Add your Vercel URL to Firebase Console → Authentication → Authorized Domains

---

## 🧩 Recommended VS Code Extensions

| Extension | Purpose |
| :--- | :--- |
| Tailwind CSS IntelliSense | Real-time utility autocomplete |
| ESLint | Code quality & TypeScript validation |
| Prettier | Auto-format on save |
| GitLens | Enhanced Git tracking |
| Lucide Icon Searcher | Icon discovery for custom modules |

---

## 📊 Platform Stats

- **9** Core AI-powered modules
- **13** API route handlers
- **20+** Application pages
- **7** Portfolio themes
- **11+** Indian language support
- **3** AI provider fallback chain
- **3** OAuth providers (Google, GitHub, LinkedIn)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<div align="center">

**© 2026 DreamSync. Empowering Futures.**

Built with ❤️ by [Vishwajeet](https://github.com/Vishwajeetsrk)

</div>
