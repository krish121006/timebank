# TimeBank — Development Rules

## 1. Product
1. Time credits are the core exchange unit.
2. Do not turn TimeBank into a money-first marketplace.
3. Every credit movement requires a ledger record.
4. Exchanges have explicit states.
5. AI recommends; deterministic rules enforce.
6. Users must understand how credits are earned/spent.

## 2. Credit Rules
Default rule:
`1 completed hour = 1 time credit`

Do not silently create, delete or double-spend credits. Corrections use compensating transactions.

## 3. Ledger
Every transaction requires:
- user
- amount
- type
- reference
- status
- timestamp
- idempotency key

Prefer append-only financial records.

## 4. Exchange States
`REQUESTED → ACCEPTED → SCHEDULED → IN_PROGRESS → PENDING_CONFIRMATION → COMPLETED`

Alternative:
`CANCELLED`, `DISPUTED`

Frontend cannot arbitrarily change state.

## 5. AI
Use AI for:
- skill extraction
- request parsing
- matching
- skill equivalence
- explanations
- anomaly signals

Do NOT use AI for:
- credit transfers
- payment verification
- final disputes
- bans
- authorization

## 6. Matching
Before AI:
- skill compatibility
- availability
- account status
- block list
- language
- eligibility

AI ranks eligible candidates.

## 7. Reputation
Only completed exchanges can create ratings. Users cannot rate themselves. Reviews must be tied to exchanges. Flag suspicious review patterns.

## 8. Chat
Only authorized participants access private conversations. Validate conversation ownership and rate-limit messages.

## 9. Payments
Use Razorpay. Verify signatures server-side. Validate webhooks. Never store card information. Never activate premium from browser callback alone.

## 10. Authentication
Use bcrypt, JWT, protected routes, role authorization, secure token handling and login rate limiting.

## 11. Database
MongoDB is source of truth. Use Mongoose validation, timestamps and indexes. Avoid destructive updates to financial records.

## 12. API
Every protected API:
`Authenticate → Authorize → Validate → Ownership Check → Business Logic → Response`

Never trust client-supplied IDs.

## 13. Frontend
Responsive, consistent, accessible, clear CTAs, useful empty/error states and no unnecessary animation.

## 14. UX
Always show:
- credit balance
- why credits changed
- exchange status
- next step
- partner
- session time
- cancellation conditions

## 15. Security
Validate inputs/uploads, sanitize content, rate-limit APIs, protect Socket.IO, keep secrets outside Git and audit admin actions.

## 16. Code
TypeScript strict mode, feature modules, reusable components, focused controllers/services, no secrets in source code, tests for core business rules.

## 17. Architecture
Start as a modular monolith. Extract services only when real scale requires them.

## 18. College Requirements
Demonstrate:
- React
- Node/Express
- MongoDB
- Auth
- AI
- Real-time communication
- time-credit ledger
- real Razorpay payment
- admin
- complete exchange workflow

## 19. Differentiation
Time banking itself is not new. Product differentiation should come from matching quality, clear credit mechanics, trust/reputation, exchange lifecycle and UX. Do not claim the underlying concept is globally new.
