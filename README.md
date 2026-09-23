<div align="center">
  <img src="public/review-bit-eye-logo.svg" alt="ReviewBit Logo" width="80" height="48" />
  <h1>ReviewBit</h1>
  <p><strong>Instant, Intelligent & Context-Aware AI Code Reviews for GitHub Pull Requests</strong></p>

  <div>
    <img src="https://img.shields.io/badge/Next.js-16.2-black?style=flat&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=flat&logo=react" alt="React 19" />
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=flat&logo=tailwind-css" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Prisma-ORM_7-2D3748?style=flat&logo=prisma" alt="Prisma" />
    <img src="https://img.shields.io/badge/Inngest-Event--Driven-FF5722?style=flat&logo=inngest" alt="Inngest" />
    <img src="https://img.shields.io/badge/Pinecone-Vector_DB-000000?style=flat" alt="Pinecone" />
    <img src="https://img.shields.io/badge/Razorpay-Billing-0C2340?style=flat&logo=razorpay" alt="Razorpay" />
  </div>
</div>

---

## 📌 Overview

**ReviewBit** is a production-grade AI code reviewer SaaS built for developers and engineering teams. Whenever a pull request is opened or updated on a connected GitHub repository, ReviewBit automatically retrieves full codebase context, parses patch diffs, runs deep security and performance checks, and posts comprehensive inline reviews directly on GitHub.

---

## ✨ Features

- 🤖 **Automated PR Reviews:** Triggered automatically via GitHub webhooks on every `pull_request.opened` or `pull_request.synchronize`.
- 🧠 **Codebase Context Awareness:** Integrates with **Pinecone Vector Database** (`llama-text-embed-v2`) to perform semantic searches across repository files, providing the LLM with surrounding architecture context.
- 🛡️ **Security & Vulnerability Detection:** Identifies SQL injections, authentication flaws, unhandled exceptions, and memory leaks.
- ⚡ **Event-Driven Resilience:** Powered by **Inngest** background queues for reliable retries, step execution, and non-blocking webhook delivery.
- 📊 **Developer Dashboard:**
  - Real-time review metrics and usage monitoring.
  - Pull request history table with filtering and status tags (`completed`, `processing`, `failed`).
  - Interactive **Markdown Review Viewer Modal** with structured collapsible analysis sections.
  - Repository sync management and status indicators.
- 🔐 **GitHub Social Auth:** Passwordless sign-in powered by **Better-Auth** using your GitHub profile.
- 💳 **SaaS Subscription & Billing:** Integrated with **Razorpay Subscriptions** supporting Free ($0/mo, 5 reviews) and Pro (₹999/mo, unlimited reviews) tiers.
- 🌓 **Modern UI & Themes:** Built with Tailwind CSS v4, Radix UI, and Shadcn UI with full dark/light mode toggle.

---

## 🏗️ Architecture & Workflow

```mermaid
flowchart TD
    A[GitHub Developer Opens/Updates PR] -->|Webhook Event| B[ReviewBit API: /api/github/webhook]
    B -->|Verify Signature & Ingest| C[Inngest Background Queue]
    C -->|Fetch Changed Files & Patches| D[GitHub Octokit Installation Client]
    C -->|Query Semantic Context| E[(Pinecone Vector DB)]
    D --> F[Prompt Assembly: Diffs + Semantic Context]
    E --> F
    F -->|Analyze Code Changes| G[OpenRouter / Gemini AI Model]
    G -->|Structured Markdown Feedback| H[Inngest Step Execution]
    H -->|Post Automated Comment| I[GitHub PR Discussion Thread]
    H -->|Persist Status & Comment| J[(PostgreSQL Database via Prisma)]
```

---

## 🛠️ Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router, Turbopack, React 19) |
| **Styling & UI** | Tailwind CSS v4, Radix UI primitives, Lucide Icons, Shadcn UI |
| **Database & ORM** | PostgreSQL, Prisma ORM 7 (`@prisma/adapter-pg`, `pg`) |
| **Authentication** | Better-Auth 1.7 (GitHub Social Provider, HTTP-only Cookies) |
| **Background Queues** | Inngest (Serverless Event-Driven Workflows) |
| **AI / LLM Provider** | Vercel AI SDK (`ai`), OpenRouter Provider (Google Gemini 2.5 Flash) |
| **Vector Search** | Pinecone Vector Database (`@pinecone-database/pinecone`) |
| **GitHub Integration** | Octokit (GitHub App, JWT Authenticated Installation Tokens) |
| **Payments & Billing** | Razorpay Subscriptions (Checkout.js & Webhook Ingestion) |

---

## 🚀 Getting Started

### 1. Prerequisites

Ensure you have the following installed on your local machine:
- **Node.js**: `v20.x` or later
- **npm** / **pnpm** / **bun**
- **PostgreSQL**: Local database or cloud provider (e.g. Neon, Supabase)
- **GitHub App**: Configured on GitHub Developer Settings
- **Inngest CLI**: For local background job execution (`npx inngest-cli@latest dev`)
- **ngrok**: For forwarding local webhook traffic from GitHub

---

### 2. Clone & Install Dependencies

```bash
git clone https://github.com/your-username/review-bit.git
cd review-bit
npm install
```

---

### 3. Environment Variables Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Populate the required credentials:

```ini
# PostgreSQL Database
DATABASE_URL="postgresql://user:password@localhost:5432/review_bit?sslmode=prefer"

# Better-Auth & GitHub OAuth
GITHUB_CLIENT_ID="your_github_oauth_client_id"
GITHUB_CLIENT_SECRET="your_github_oauth_client_secret"
BETTER_AUTH_SECRET="generate_with_openssl_rand_hex_32"
BETTER_AUTH_URL="http://localhost:3000"

# GitHub App Credentials (for Webhooks & PR Comments)
GITHUB_APP_ID="your_github_app_id"
GITHUB_APP_NAME="your_github_app_slug"
GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
GITHUB_WEBHOOK_SECRET="your_github_webhook_secret"

# Inngest Configuration
INNGEST_DEV=1

# Pinecone Vector Search
PINECONE_API_KEY="your_pinecone_api_key"
PINECONE_INDEX="your_pinecone_index_name"

# OpenRouter / Gemini AI
OPENROUTER_API_KEY="your_openrouter_api_key"

# Razorpay Subscriptions (₹999/mo Pro Plan)
RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
RAZORPAY_PLAN_ID="your_razorpay_monthly_plan_id"
RAZORPAY_WEBHOOK_SECRET="your_razorpay_webhook_secret"
NEXT_PUBLIC_RAZORPAY_KEY_ID="your_razorpay_key_id"
```

---

### 4. Database Setup & Migrations

Push the Prisma schema to your PostgreSQL database:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

### 5. Running Locally

To run the complete ReviewBit development environment with local webhooks and background workers, start these 3 services in separate terminal tabs:

#### Terminal 1: Next.js Web App
```bash
npm run dev
```
> App runs at `http://localhost:3000`

#### Terminal 2: Inngest Dev Server
```bash
npx inngest-cli@latest dev
```
> Inngest dashboard runs at `http://localhost:8288`

#### Terminal 3: ngrok Webhook Tunnel
```bash
ngrok http 3000
```
> Copy the forwarded HTTPS URL (e.g. `https://xxxx.ngrok-free.app`) and configure it in your GitHub App settings:
> - **Webhook URL:** `https://xxxx.ngrok-free.app/api/github/webhook`
> - **Webhook Secret:** Matches `GITHUB_WEBHOOK_SECRET` in your `.env`

---

## 🤖 GitHub App Permissions & Setup

Create a GitHub App under **GitHub Settings > Developer settings > GitHub Apps**:

1. **General:**
   - **Homepage URL:** `http://localhost:3000` (or production domain)
   - **Callback URL:** `http://localhost:3000/api/github/callback`
   - **Webhook URL:** `https://your-domain.com/api/github/webhook`
   - **Webhook Secret:** Set a secure secret and copy to `.env`
2. **Repository Permissions:**
   - **Pull requests:** `Read and write` (to read diffs and post review comments)
   - **Contents:** `Read-only` (to inspect files and sync repository context)
   - **Metadata:** `Read-only` (mandatory default)
3. **Subscribe to Events:**
   - `Pull request`
   - `Installation`
   - `Installation target`

---

## 📁 Project Structure

```text
review-bit/
├── app/
│   ├── (auth)/sign-in/          # GitHub OAuth sign-in page
│   ├── (protected)/dashboard/   # Metrics, PR history, settings, repos
│   ├── api/github/              # Webhook ingestion & OAuth callbacks
│   ├── api/inngest/             # Inngest background handler
│   ├── api/razorpay/webhook/    # Payment subscription webhooks
│   ├── page.tsx                 # SaaS marketing landing page
│   └── layout.tsx               # Root layout & providers
├── features/
│   ├── auth/                    # Better-Auth server actions & components
│   ├── billing/                 # Razorpay subscription logic & buttons
│   ├── dashboard/               # PR list, stats, modals, navigation
│   ├── github/                  # Octokit installation client & queries
│   ├── repo-sync/               # Codebase vectorization & embedding
│   ├── reviews/                 # Diff formatting, prompt building & AI review
│   └── settings/                # Profile, plan details & subscription tab
├── inngest/                     # Inngest client, events & workflow functions
├── prisma/                      # Prisma schema & SQL migrations
└── public/                      # Static brand assets & logos
```

---

## 📦 Production Deployment

### 1. Deploy on Vercel
1. Import repository to [Vercel](https://vercel.com).
2. Configure all environment variables from `.env.example`.
3. Set `BETTER_AUTH_URL` to your production domain (e.g., `https://review-bit.vercel.app`).
4. Set build command: `prisma generate && next build`.

### 2. Configure Production GitHub App
1. Update GitHub App **Webhook URL** to `https://your-domain.com/api/github/webhook`.
2. Update **Callback URL** to `https://your-domain.com/api/github/callback`.

### 3. Connect Inngest Cloud
1. Create a project at [Inngest Cloud](https://www.inngest.com).
2. Add `INNGEST_SIGNING_KEY` and `INNGEST_EVENT_KEY` to your production environment variables.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
