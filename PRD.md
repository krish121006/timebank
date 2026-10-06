# TimeBank — Product Requirements Document

## 1. Overview
**TimeBank** is an AI-powered skill-exchange platform where users exchange skills/services using **time credits** rather than requiring direct monetary payment.

Core loop:
`Skills → Matching → Time Credits → Exchange → Reputation`

Core principle:
> Time is the unit of exchange.

## 2. Problem
People have useful skills but may not have money to buy every service they need. At the same time, many people have unused skills and time. Traditional marketplaces are money-first and often make skill discovery difficult.

TimeBank creates a structured, reputation-backed time-credit economy.

## 3. Target Users
- Students
- Freelancers
- Professionals
- Mentors
- Hobbyists
- People learning new skills

## 4. Roles
### Member
Profile, skills, availability, offers, requests, matches, exchanges, wallet, chat, ratings.

### Admin/Moderator
Users, skills, reports, disputes, transactions, payments, suspicious activity.

## 5. Core Modules
1. Authentication
2. Profiles
3. Skills
4. Skill offers/requests
5. AI matching
6. Time wallet
7. Transaction ledger
8. Exchange lifecycle
9. Scheduling
10. Real-time chat
11. Reputation
12. Notifications
13. Disputes
14. Payments
15. Admin

## 6. Main User Journey
`Register → Profile → Add Skills → Set Availability → Request/Offer → AI Match → Exchange Request → Schedule → Session → Completion → Credit Transfer → Rating`

## 7. Skill Model
Each skill contains:
- Name
- Category
- Proficiency
- Teach/Learn mode
- Description
- Availability

Example:
`React | Intermediate | Teach | Saturday`

## 8. Time-Credit Economy
Example:
- User teaches React for 1 hour → +1 credit.
- User receives UI/UX help for 1 hour → -1 credit.

### Important
Do not use only a mutable `balance` as the source of truth.

Use:
`Wallet → Transaction Ledger → Earn / Spend / Transfer / Refund / Adjustment`

Every transaction needs an ID, user, amount, type, reference, status and timestamp.

## 9. Exchange Lifecycle
`REQUESTED → ACCEPTED → SCHEDULED → IN_PROGRESS → PENDING_CONFIRMATION → COMPLETED`

Alternative states:
`CANCELLED`, `DISPUTED`

Credit settlement happens only when completion rules are satisfied.

## 10. AI Features
AI is an intelligence layer, not a chatbot.

### Skill extraction
Convert natural-language descriptions into structured skills.

### Smart matching
Consider:
- Requested skill
- Offered skill
- Level
- Availability
- Timezone
- Language
- Experience
- Reputation
- Preferences

### Request understanding
Example:
“I need help deploying my Node app this weekend.”
→ Node.js, deployment, weekend, required level.

### Skill equivalence
Identify related skills without treating every related skill as identical.

### Anomaly signals
Flag unusual credit movement, rating patterns or spam for admin review.

AI recommends/flags; deterministic rules make final eligibility, credit, payment and moderation decisions.

## 11. Reputation
Show:
- Rating
- Reviews
- Completed exchanges
- Reliability
- Skills taught/learned

Avoid an unexplained single AI trust score.

## 12. Chat
Socket.IO based:
- One-to-one messaging
- Exchange-linked conversation
- Read status
- Notifications

## 13. Payments
The time exchange remains credit-based. TimeBank can monetize through:
- Premium membership
- Verified profile
- Advanced matching
- Advanced filters
- Featured profile
- Optional future credit purchase

Razorpay flow:
`Create Order → Checkout → Payment → Webhook → Server Verification → Entitlement`

Never trust only the browser callback.

## 14. MVP
### Must Have
Auth, profile, skills, offers/requests, AI matching, wallet, ledger, exchanges, scheduling, completion, ratings, chat, Razorpay, admin.

### Should Have
Verification, disputes, advanced filters, notifications.

### Future
Group sessions, video calls, mobile app, organizations, calendar integration, global skill taxonomy.

## 15. Success Metrics
- Active users
- Skill listings
- Match rate
- Exchange acceptance
- Completed sessions
- Credits earned/spent
- Credit circulation
- Average rating
- Dispute rate
- Premium conversion
- Revenue

## 16. Product Rule
TimeBank must not become a normal Fiverr-style marketplace. Its identity is a **skill-exchange economy powered by time credits**.
