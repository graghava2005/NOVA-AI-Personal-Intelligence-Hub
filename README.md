# NOVA – AI-Powered Personal Intelligence Hub

> **Think Smarter. Work Better. Live Intelligently.**  
> *Category 08: AI, Machine Learning & Future Technology*

---

## 🏆 Official Google Lighthouse Benchmark Scores

Audited with **Google Lighthouse v13.6.0** against production distribution on Chromium:

| Audit Mode | Performance | Accessibility | Best Practices | SEO | Core Web Vitals Status |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Desktop** | **100 / 100** | **100 / 100** | **100 / 100** | **100 / 100** | **FCP 0.6s · LCP 0.6s · TBT 0ms · CLS 0.005** |
| **Mobile**  | **99 / 100**  | **100 / 100** | **100 / 100** | **100 / 100** | **FCP 1.6s · LCP 1.6s · TBT 80ms · CLS 0.020** |

Detailed audit documentation and performance logs:
- 📊 [LIGHTHOUSE_RESULTS.md](file:///c:/Users/G%20Raghava/Desktop/NOVA%20AI-Powered%20Personal%20Intelligence%20Hub/LIGHTHOUSE_RESULTS.md) — Raw audit metrics, Core Web Vitals, and scorecards.
- 🧪 [FINAL_VERIFICATION_REPORT.md](file:///c:/Users/G%20Raghava/Desktop/NOVA%20AI-Powered%20Personal%20Intelligence%20Hub/FINAL_VERIFICATION_REPORT.md) — End-to-end browser journey log, module verifications, and automated tests.
- 📋 [BENCHMARK_REPORT.md](file:///c:/Users/G%20Raghava/Desktop/NOVA%20AI-Powered%20Personal%20Intelligence%20Hub/BENCHMARK_REPORT.md) — Architectural QA analysis, bundle composition, and WCAG AA accessibility audit.

---

## 🌌 Overview

Modern knowledge workers lose up to 40% of their productive output toggling across fragmented applications: one tool for task tracking, another for notes, another for reading PDFs, and separate chat tabs for AI assistance. This fragmentation creates severe cognitive residue and information overload.

**NOVA** solves this by unifying personal execution into a single, cohesive intelligence workspace. Built with a high-performance **Local-First** design philosophy, NOVA provides an interactive AI co-pilot, browser-side document intelligence, structured second-brain note vault, Eisenhower-calibrated task planner, and real-time cognitive analytics—**all running 100% on-device with zero mandatory cloud subscriptions or API keys**.

---

## 🎨 Futuristic SaaS Design System

NOVA's UI is designed with the aesthetic standards of modern enterprise AI SaaS platforms:
- **Background**: `#090D1A` (Deep Obsidian Void)
- **Sidebar & Panels**: `#101629` (Midnight Tech Slate)
- **Cards**: `#151D32` (Ambient Glass Matrix)
- **Primary Accent**: `#8B5CF6` (Vibrant Neural Purple)
- **Secondary Accent**: `#22D3EE` (Bioluminescent Cyan)
- **Typography**: Clean, readable sans-serif hierarchy powered by *Plus Jakarta Sans* and *JetBrains Mono*
- **Visual Polish**: Subtle glassmorphism, glowing telemetry indicators, smooth Framer Motion transitions, responsive drawer layouts, and confetti reward feedback.

---

## ⚡ Core Feature Modules

### 1. 🚀 Landing & Onboarding
- Visually stunning product introduction with feature highlights, architecture pillars, and category badge.
- Interactive Workspace Onboarding modal to select personal intelligence focus (*AI Engineering*, *Research & Deep Learning*, or *Executive Strategy*).
- Instant local demo workspace entry with zero authentication friction.

### 2. 📊 Intelligence Command Dashboard
- **4 Real-Time Statistics Cards**: Tasks Completed, Documents Saved, Knowledge Notes, and Productivity Score (dynamically calculated from state).
- **Cognitive Velocity Chart**: Interactive Recharts visualization tracking focus hours against output ratings.
- **Priority Focus Queue**: Direct one-click completion toggle for High-Priority tasks.
- **Quick Action Command Bar**: Instant triggers for "Ask NOVA", "Upload Document", "Add Task", and "Save Note".
- **Live System Activity Feed**: Tracks timestamped events across all modules.

### 3. 🤖 Interactive AI Assistant Co-Pilot
- Full conversational interface simulating intelligent guidance for sprint planning, brainstorming, summaries, and technical explanations.
- **Suggested Prompt Library**: Categorized prompt pills (*Brainstorming*, *Planning*, *Summary*, *Explanation*) for instant experimentation.
- **Dual Direct Actions**: One-click convert any AI recommendation into a task in the Task Planner or a note in the Knowledge Vault.
- Keyboard shortcuts: `Enter` to send, `Shift + Enter` for multi-line formatting.
- Timestamps, simulated typing animations, and one-click clipboard copying.

### 4. 📑 Smart Document Intelligence
- Real browser-side PDF and TXT file extraction powered by **PDF.js**.
- **Deterministic Extractive NLP Engine**: Evaluates word frequency, sentence position, signal phrases, and semantic density on-device.
- **4 Tabbed Intelligence Views**:
  - *Executive Summary*: High-signal synthesized abstract with word count and estimated reading time.
  - *Key Action Points*: Extracted numbered takeaways.
  - *Extracted Raw Text*: Searchable full-text viewer with line and character counts.
  - *Keywords & Entity Cloud*: High-frequency thematic tags.
- Pre-loaded with research whitepaper demo files; allows instant uploading of custom documents.

### 5. 🧠 Knowledge Vault (Second Brain)
- Full CRUD note management with Markdown support.
- Category filtering (*Strategy*, *Frameworks*, *Research*, *Engineering*, *General*).
- Dynamic tag indexing and multi-tag search filtering.
- One-click note pinning to keep mission-critical reference architectures at the top.
- Responsive note cards with glowing hover states and timestamps.

### 6. 📅 Task Planner & Execution Engine
- Eisenhower-calibrated milestone tracking (*High*, *Medium*, *Low* priorities).
- Status filtering (*All*, *Pending*, *In Progress*, *Completed*).
- Quick inline task capture bar for frictionless addition.
- Interactive completion progress bar with percentage calculation.
- Confetti visual celebration upon marking tasks complete.

### 7. 📈 Productivity & Cognitive Analytics
- Interactive Recharts components:
  - *Cognitive Focus vs. Productivity Trend* (Area Chart with dual gradient fills).
  - *Eisenhower Task Distribution* (Donut Chart breakdown).
  - *Deep Work Output by Domain* (Bar Chart).
- Configurable date filters (*Last 7 Days*, *Last 30 Days*, *Quarterly*).
- Algorithmic workflow recommendations derived from active state.

### 8. ⚙️ Hub Configuration & Sovereign Storage
- Editable user profile (Display Name, Email, Operational Role).
- Activity notification toggle and auto-summarization preferences.
- **JSON Backup Export**: Download entire second-brain database with a single click.
- **Safe Reset & Wipe Controls**: Reset to initial seed data or wipe LocalStorage with modal confirmation.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework & Build** | React 18, TypeScript, Vite |
| **Routing** | React Router v6 |
| **Styling & Design** | Tailwind CSS v3, PostCSS, Autoprefixer |
| **Icons & Motion** | Lucide React, Framer Motion, Canvas Confetti |
| **Data Visualization**| Recharts (Area, Bar, Pie charts) |
| **Document Parsing**  | PDF.js (`pdfjs-dist`) |
| **Persistence**       | HTML5 LocalStorage with schema validation |

---

## 🚀 Getting Started

### Prerequisites
- Node.js `v18+`, `v20+`, or `v24+`
- npm or pnpm

### Installation & Local Development

1. **Clone or navigate to the workspace**:
   ```bash
   cd "NOVA AI-Powered Personal Intelligence Hub"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to the local URL displayed in terminal (typically `http://localhost:5173`).

---

## 🧪 Automated Testing & Verification

Run the built-in comprehensive verification suite (15 automated tests covering NLP synthesis, AI prompt routing, state invariants, vault filtering, and security checks):

```bash
node test-suite.mjs
```

Expected output:
```text
=================================================
All Tests Completed: 15 / 15 Passed (100%)
=================================================
```

---

## 📦 Production Build & Local Preview

```bash
# 1. Compile TypeScript and bundle production assets
npm run build

# 2. Preview production build locally on port 4173
npm run preview -- --port 4173
```

Navigate to `http://localhost:4173` to test the production bundle.

---

## 🌐 Cloud Deployment Guide

NOVA is pre-configured with zero-configuration routing files for modern web hosting platforms.

### Option A: Deploying to Vercel (Recommended)

1. **Deploy via Vercel CLI**:
   ```bash
   # Install Vercel CLI globally (if not installed)
   npm install -g vercel

   # Deploy production build
   vercel --prod
   ```

2. **Deploy via Vercel Web Dashboard (GitHub Integration)**:
   - Push your project to GitHub (see [GitHub Push Guide](#-github-push-guide) below).
   - Go to [vercel.com/new](https://vercel.com/new) and import the repository.
   - Vercel automatically detects Vite:
     - **Framework Preset**: Vite
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
   - Click **Deploy**. SPA routes (`/`, `/landing`, `/assistant`, `/documents`, `/vault`, `/tasks`, `/analytics`, `/settings`) are automatically handled via the included `vercel.json`.

### Option B: Deploying to Netlify

1. Drag and drop the `dist` folder into [app.netlify.com/drop](https://app.netlify.com/drop), or:
2. Connect your GitHub repository. Netlify reads `public/_redirects` and serves all client-side routes with `200 OK`.

---

## 🐙 GitHub Push Guide

To push this repository to GitHub:

```bash
# 1. Initialize git (if not already initialized)
git init
git branch -M main

# 2. Stage all project files (node_modules and dist are excluded via .gitignore)
git add .

# 3. Create initial commit
git commit -m "feat: complete NOVA AI-Powered Personal Intelligence Hub v1.0.0"

# 4. Link your remote repository and push (replace with your repository URL)
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY_NAME>.git
git push -u origin main
```

---

## 🔒 Privacy & Sovereign Execution Architecture

- **100% Client-Side Sovereignty**: All tasks, documents, notes, and preferences remain strictly within your browser's LocalStorage. No user data is transmitted to external telemetry servers.
- **Deterministic Local Intelligence**: The assistant and document summarizer use deterministic client-side natural language processing and frequency-weighted extractive algorithms. They do not connect to external third-party paid LLMs (e.g. OpenAI, Anthropic), guaranteeing zero API costs, zero vendor lock-in, and instant offline reliability.

---

## 🏆 Project Classification
- **Project Name**: NOVA
- **Category**: AI, Machine Learning & Future Technology (Category 08)
- **Tagline**: Think Smarter. Work Better. Live Intelligently.
- **Participation**: Individual
- **Status**: Production Release v1.0.0 (100% Verified)
