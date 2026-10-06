# TimeBank — Project Memory & Master Blueprint

This document synthesizes and consolidates all core technical specifications, design philosophies, architecture blueprints, development phases, and system rules from `PRD.md`, `Architecture.md`, `Design.md`, `Phase.md`, and `Rules.md`.

---

## 1. Product Summary & Identity
- **Name:** TimeBank
- **Core Concept:** An AI-powered skill-exchange platform where skills and services are exchanged using **Time Credits** (1 hour = 1 credit) instead of money.
- **Core Loop:** `Skills → Matching → Time Credits → Exchange → Reputation`
- **Core Principle:** Time is the primary unit of exchange. It is a peer-to-peer skill economy, not a monetary marketplace.
- **Target Audience:** Students, freelancers, professionals, mentors, hobbyists, skill seekers/learners.

---

## 2. System Architecture & Tech Stack

### Technology Stack
- **Frontend:** React.js, Vite, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express.js, TypeScript (Modular Monolith architecture)
- **Database:** MongoDB Atlas + Mongoose
- **Real-time:** Socket.IO
- **Payments & Media:** Razorpay (Monetization: Premium memberships/features), Cloudinary
- **AI Integration:** AI provider for natural language request parsing, skill extraction, candidate ranking, and match explanations.

### High-Level Topology
```text
React/Vite (Frontend)
    ↓ (REST API / Socket.IO)
Express API Server
    ↓
MongoDB / Mongoose Database
    ├── AI Provider (Matching & Request Parsing)
    ├── Cloudinary (Avatar & Media Assets)
    └── Razorpay (Subscriptions & Monetization)
```

### Directory Structures
- **Frontend (`frontend/src/`):** `components/` (ui, layout, skills, wallet, exchange, chat, profile), `features/` (auth, profile, skills, matching, wallet, exchange, booking, chat, reputation, billing), `pages/`, `hooks/`, `services/`, `store/`, `types/`, `utils/`.
- **Backend (`backend/src/`):** `config/`, `middleware/`, `modules/` (auth, users, profiles, skills, requests, matching, wallet, transactions, exchanges, sessions, chat, reputation, notifications, payments, subscriptions, disputes, admin), `ai/`, `sockets/`, `utils/`.

---

## 3. Core Subsystems & Lifecycle Rules

### 3.1. Time Wallet & Credit Ledger
- **Ledger Rule:** Credits MUST NOT be modified through direct mutable counter updates alone. Every movement requires an append-only ledger transaction (`CreditTransaction`).
- **Transaction Types:** `EARN`, `SPEND`, `TRANSFER`, `REFUND`, `ADJUSTMENT`, `BONUS`.
- **Transaction Fields:** `userId`, `amount`, `type`, `direction`, `exchangeId`, `status`, `idempotencyKey`, `createdAt`.
- **Default Rate:** `1 hour of completed exchange = 1 time credit`.

### 3.2. Exchange Lifecycle State Machine
```text
REQUESTED ──► ACCEPTED ──► SCHEDULED ──► IN_PROGRESS ──► PENDING_CONFIRMATION ──► COMPLETED
   │             │             │
   └─────────────┴─────────────┴──────────► CANCELLED / DISPUTED
```
- **Credit Settlement:** Triggered ONLY upon reaching `COMPLETED` state after meeting completion criteria with idempotency checks.

### 3.3. AI Intelligence Layer Boundaries
- **AI Responsibilities:**
  - Natural-language request parsing & skill extraction
  - Candidate recommendation & contextual ranking (considering skill level, availability, language, experience, reputation)
  - Match reasoning generation
  - Anomaly detection signals (flagging suspicious transactions/reviews for admins)
- **AI Strict Anti-Rules (MUST NOT):**
  - Transfer credits
  - Verify payments
  - Decide dispute outcomes
  - Ban users
  - Modify RBAC / authorization

### 3.4. Monetization Model (Razorpay)
- Skills exchange uses **Time Credits**.
- Monetization relies on **Premium Memberships** (advanced matching, enhanced filters, increased visibility, active request boosts).
- Payment flow requires strict server-side signature verification & webhook processing (never rely solely on client callbacks).

---

## 4. UI/UX Design System Guidelines

- **Visual Tone:** Minimal, Friendly, Trustworthy, Modern, Community-Oriented.
- **Palette:** Deep Navy (`#0F172A`), Blue (`#2563EB`), Surface (`#F8FAFC`), Border (`#E2E8F0`), Success (`#16A34A`), Warning (`#D97706`), Error (`#DC2626`).
- **Typography:** Inter or Manrope.
- **AI Display Rule:** Keep AI subtle. Use clean terms like *"Smart Match"* and bulleted match rationale. Avoid AI sci-fi brain graphics, neon colors, excessive glassmorphism, or heavy 3D visuals.
- **Accessibility:** High contrast, visible focus states, screen-reader labels, semantic HTML, multi-modal status indicators (never rely on color alone).

---

## 5. Development Roadmap Summary (Phases 0 - 18)

| Phase | Focus Area | Key Scope |
|---|---|---|
| **Phase 0** | Definition | PRD, Architecture, Rules, Database Schema |
| **Phase 1-3** | Foundation & Auth | Project setup, Auth (JWT, bcrypt), User Profiles |
| **Phase 4-5** | Skills & Requests | Skill catalog, teach/learn modes, Request creation |
| **Phase 6** | Time Wallet | Ledger schema, transaction engine, idempotency |
| **Phase 7** | Exchange Engine | State machine, scheduling, credit settlement |
| **Phase 8** | AI Matching | Request parsing, candidate retrieval & ranking |
| **Phase 9-11**| Communication & Trust | Socket.IO chat, Reputation ratings, Notifications |
| **Phase 12-14**| Commercial & Safety | Razorpay payment flow, Disputes engine, Admin dashboard |
| **Phase 15-18**| Polish & Deployment | UI polish, Unit/Integration/E2E testing, Vercel/Render deploy, College Demo flow |

---

## 6. Critical Engineering & Development Rules

1. **Security & Validation:** Always enforce `Authenticate → Authorize → Validate → Ownership Check → Business Logic` on protected APIs. Never trust client-supplied IDs.
2. **Database Schema Integrity:** MongoDB Atlas is the source of truth. Use Mongoose schemas with strict validations, indexing, and immutable ledger histories.
3. **TypeScript Compliance:** Strict mode across both backend and frontend.
4. **Architecture Strategy:** Maintain a clean **Modular Monolith**. Avoid premature microservices abstraction.
