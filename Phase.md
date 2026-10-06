# TimeBank — Development Phases

## Phase 0 — Product Definition
Finalize time-credit rules, roles, exchange lifecycle, skill model, monetization, AI boundaries and wallet rules.

**Deliverable:** PRD + architecture + database model.

## Phase 1 — Project Setup
React/Vite, Express, TypeScript, MongoDB Atlas, Mongoose, environment variables, GitHub, linting and CI.

## Phase 2 — Authentication
Register, login, logout, JWT, bcrypt, protected routes and role system.

## Phase 3 — Profile
Username, bio, timezone, languages, experience, availability and profile image.

## Phase 4 — Skills
Skill catalog, categories, proficiency, teach/learn mode, availability and descriptions.

## Phase 5 — Requests & Offers
Create requests/offers, browse skills, request details and accept/decline.

## Phase 6 — Time Wallet
Wallet, initial credit policy, transaction ledger, earn, spend, transfer, refund, history and idempotency.

## Phase 7 — Exchange Lifecycle
Create, accept, schedule, start, complete, cancel, confirm and settle credits.

## Phase 8 — AI Matching
Natural-language request parsing, skill extraction, candidate retrieval, AI ranking, match explanation and skill equivalence.

## Phase 9 — Real-Time Chat
Socket.IO, conversation creation, authentication, messaging, read status and exchange-linked conversations.

## Phase 10 — Reputation
Ratings, reviews, completed sessions and reliability indicators.

## Phase 11 — Notifications
Matches, requests, reminders, credits, chat and in-app notification center.

## Phase 12 — Payment
Pricing, premium plan, Razorpay order, checkout, server verification, webhook, entitlement, history and refunds.

## Phase 13 — Disputes & Safety
Reports, exchange disputes, admin review, credit-hold state, resolution and audit log.

## Phase 14 — Admin
Users, skills, exchanges, credit transactions, reports, disputes, payments and suspicious activity.

## Phase 15 — UX Polish
Loading/empty/error states, responsive design, accessibility, validation, confirmations and toasts.

## Phase 16 — Testing
### Unit
Wallet, ledger, matching eligibility, exchange state machine and payment verification.

### Integration
Exchange + wallet, chat authorization, payment + entitlement.

### E2E
`Register → Skill → Request → AI Match → Exchange → Chat → Schedule → Complete → Credit Transfer → Rating → Premium Payment`

## Phase 17 — Deployment
Production MongoDB, backend/frontend deployment, Cloudinary, Razorpay, environment configuration, logs and monitoring.

## Phase 18 — College Demo
Register → add React → set availability → another user requests help → AI matches → exchange → chat → schedule → complete → credit transfer → rating → Razorpay premium purchase.
