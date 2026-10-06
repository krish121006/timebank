# TimeBank — System Architecture

## 1. Stack
### Frontend
- React.js
- Vite
- TypeScript
- Tailwind CSS

### Backend
- Node.js
- Express.js
- TypeScript

### Database
- MongoDB
- Mongoose

### Other
- JWT + bcrypt
- Socket.IO
- Razorpay
- Cloudinary
- AI provider
- Vercel + Render
- MongoDB Atlas

## 2. High-Level Architecture
```text
React/Vite
    ↓
Express REST API
    ↓
MongoDB/Mongoose
    ├── AI Provider
    ├── Cloudinary
    └── Razorpay

React ↔ Socket.IO ↔ Express ↔ MongoDB
```

## 3. Frontend Structure
```text
frontend/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── skills/
│   │   ├── wallet/
│   │   ├── exchange/
│   │   ├── chat/
│   │   └── profile/
│   ├── features/
│   │   ├── auth/
│   │   ├── profile/
│   │   ├── skills/
│   │   ├── matching/
│   │   ├── wallet/
│   │   ├── exchange/
│   │   ├── booking/
│   │   ├── chat/
│   │   ├── reputation/
│   │   └── billing/
│   ├── pages/
│   ├── hooks/
│   ├── services/
│   ├── store/
│   ├── types/
│   └── utils/
└── main.tsx
```

## 4. Backend Structure
```text
backend/
├── src/
│   ├── config/
│   ├── middleware/
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── profiles/
│   │   ├── skills/
│   │   ├── requests/
│   │   ├── matching/
│   │   ├── wallet/
│   │   ├── transactions/
│   │   ├── exchanges/
│   │   ├── sessions/
│   │   ├── chat/
│   │   ├── reputation/
│   │   ├── notifications/
│   │   ├── payments/
│   │   ├── subscriptions/
│   │   ├── disputes/
│   │   └── admin/
│   ├── ai/
│   ├── sockets/
│   ├── utils/
│   ├── app.ts
│   └── server.ts
└── tests/
```

## 5. MongoDB Collections
`users, profiles, skills, userSkills, skillRequests, matches, exchanges, sessions, wallets, creditTransactions, ratings, reviews, conversations, messages, notifications, reports, disputes, plans, subscriptions, orders, payments, adminLogs`

## 6. Wallet Architecture
```text
Wallet
├── userId
├── cachedBalance
├── currency: TIME_CREDIT
└── status

CreditTransaction
├── userId
├── amount
├── type
├── direction
├── exchangeId
├── status
├── idempotencyKey
└── createdAt
```

Types:
`EARN, SPEND, TRANSFER, REFUND, ADJUSTMENT, BONUS`

Never move credits without a ledger record.

## 7. Matching Architecture
```text
Natural-language Request
        ↓
Request Parser
        ↓
Structured Requirements
        ↓
Eligibility Filters
        ↓
Candidate Retrieval
        ↓
AI Ranking
        ↓
Rule Validation
        ↓
Matches
```

Eligibility checks happen before AI ranking.

## 8. AI Input/Output
Input may contain skill, level, availability, timezone, language, experience and reputation.

AI returns structured match reasoning.

AI must NOT:
- transfer credits
- verify payments
- decide disputes
- ban users
- modify authorization

## 9. Exchange Model
```text
Exchange
├── requester
├── provider
├── skill
├── duration
├── creditAmount
├── status
├── scheduledAt
├── completionState
└── disputeState
```

## 10. API Examples
```text
POST /api/auth/register
POST /api/auth/login

GET  /api/profile/me
PATCH /api/profile/me
GET  /api/profile/:username

GET  /api/skills
POST /api/profile/skills

POST /api/requests
GET  /api/requests

POST /api/matching/search
GET  /api/matching/recommendations

GET /api/wallet
GET /api/wallet/transactions

POST /api/exchanges
GET  /api/exchanges
PATCH /api/exchanges/:id/status
POST /api/exchanges/:id/complete
POST /api/exchanges/:id/dispute

POST /api/payments/order
POST /api/payments/verify
POST /api/payments/webhook
```

## 11. Credit Settlement
```text
Check exchange
↓
Check completion requirements
↓
Check idempotency
↓
Create provider EARN
↓
Create requester SPEND
↓
Update exchange
↓
Commit transaction
```

No double settlement.

## 12. Security
- bcrypt
- JWT
- RBAC
- Input validation
- Rate limiting
- CORS
- Socket authentication
- File validation
- Razorpay signature verification
- Audit logging
- Ownership checks

## 13. Deployment
Frontend: Vercel  
Backend: Render  
Database: MongoDB Atlas  
Storage: Cloudinary  
Payments: Razorpay  
CI/CD: GitHub Actions

## 14. Architecture Principle
Start as a modular monolith. Do not create microservices just to look advanced.

The strongest technical subsystems are:
**time-credit ledger + exchange lifecycle + AI matching.**
