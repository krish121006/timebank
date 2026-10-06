# TimeBank — UI/UX Design System

## 1. Design Goal
TimeBank should feel:
- Friendly
- Simple
- Trustworthy
- Community-oriented
- Professional
- Modern

**Visual direction:** Minimal + strong usability.

Avoid AI-brain graphics, robot imagery, neural backgrounds, neon sci-fi, heavy gradients, excessive glassmorphism and unnecessary 3D.

## 2. Design Philosophy
### Time Is the Product
Make time credits understandable everywhere.

### Trust Before Matching
Show who the user is exchanging with before commitment.

### Simple Flow
`Find → Request → Schedule → Exchange → Complete`

### Clear Credit Visibility
Show available, pending, earned and spent credits.

### Community Without Clutter
Keep profiles useful without social-media noise.

## 3. Colors
- Deep Navy `#0F172A`
- Blue `#2563EB`
- White `#FFFFFF`
- Surface `#F8FAFC`
- Border `#E2E8F0`
- Text `#0F172A`
- Secondary `#64748B`
- Success `#16A34A`
- Warning `#D97706`
- Error `#DC2626`

Use color mainly for actions/status.

## 4. Typography
Font: **Inter**  
Alternative: **Manrope**

```text
Display 40–48px
H1 32px
H2 24px
H3 20px
Body 15–16px
Small 13–14px
Caption 12px
```

## 5. Navigation
Desktop:
```text
TimeBank | Search | Credits | Profile
---------------------------------------
Dashboard
Discover
Requests
Exchanges
Wallet
Messages
Profile
```

Mobile bottom navigation:
`Home | Discover | Exchanges | Wallet | Profile`

## 6. Dashboard
Top:
`Good morning`

Show:
- Available Credits
- Pending Credits
- Recommended Matches
- Active Exchanges
- Quick Actions

Quick actions:
`Offer a Skill | Request a Skill | Find a Match | Wallet`

Do not create an analytics-heavy dashboard.

## 7. Discover
Search:
`What skill do you need?`

Filters:
- Skill
- Level
- Availability
- Language
- Timezone
- Rating

Candidate card:
```text
Avatar
Name
React · Node.js
Intermediate
★ 4.8
Available Saturday
[View Profile] [Request Skill]
```

## 8. Profile
Order:
`Header → Skills → Offers → Availability → Completed Exchanges → Ratings`

Clearly separate:
**Can Teach**
and
**Wants to Learn**

## 9. Match Results
Example:
```text
Best Matches

Rahul
React
4.8 ★
Saturday
English/Hindi

Why this matches:
✓ Skill
✓ Availability
✓ Level

[View Profile]
```

Keep AI explanation short. Do not expose confusing technical AI scores.

## 10. Exchange Request
```text
Request React Help

With Rahul

Duration [1 hour]
Date [Saturday]
Time [6:00 PM]

You will spend
1 Time Credit

[Send Request]
```

Credit cost must be visible before confirmation.

## 11. Exchange Details
Show:
- participants
- status
- date/time
- credit amount
- chat
- cancel action

After completion:
`Session Complete — 1 Time Credit transferred — [Rate Session]`

## 12. Wallet
Top:
`12 Time Credits`

Then:
`Pending 2 | Earned 24 | Spent 14`

Transactions:
```text
+1 React mentoring — Sep 21
-1 UI/UX session — Sep 20
```

Use labels as well as color.

## 13. Chat
Keep it simple:
```text
Rahul
React Mentoring

Hey, available Saturday at 6?
Yes 👍

[Type a message...]
```

Show exchange details in a small panel.

## 14. Reputation
Show:
`4.8 ★ | 32 completed exchanges | Reliability: High`

Then recent reviews.

Avoid mysterious trust scores.

## 15. Payment
```text
Premium
Advanced Matching

₹XXX / month

✓ Better matching
✓ Advanced filters
✓ Profile visibility
✓ More active requests

[Continue to Payment]
```

After payment:
`Payment Successful — Premium is now active.`

## 16. Empty States
### No Matches
“We couldn't find a strong match yet.”
`[Adjust Filters] [Create Request]`

### Empty Wallet
“You don't have time credits yet.”
`[Offer a Skill]`

### No Exchanges
“Your completed exchanges will appear here.”
`[Discover Skills]`

## 17. Error States
Explain what happened and the next action.

Example:
“Payment could not be verified. Your premium access has not been activated.”
`[Try Again]`

## 18. Accessibility
- Strong contrast
- Keyboard navigation
- Visible focus
- Semantic HTML
- Proper labels
- Screen-reader-friendly status
- Never use color alone

Example:
`✓ Completed` rather than only green.

## 19. Component Library
`Button, Input, Select, Textarea, Avatar, Badge, StatusBadge, SkillChip, ProfileCard, MatchCard, ExchangeCard, WalletCard, TransactionRow, Rating, Calendar, TimeSlot, ChatWindow, NotificationItem, Modal, Drawer, Tabs, Toast, Alert, EmptyState, LoadingState, Pagination`

## 20. AI UX
AI should remain subtle.

Use:
**Smart Match**

instead of:
**✨ AI SUPER MATCH ✨**

Use:
“Matched based on skill, availability, experience, and language.”

The user should experience the benefit without the UI looking like an AI product.

## 21. Visual Summary
**Minimal + Friendly + Trustworthy**

Use:
- whitespace
- navy typography
- blue actions
- thin borders
- subtle shadows
- simple icons
- clear status labels
- human profile imagery

Avoid:
- neon
- futuristic UI
- AI brains
- heavy gradients
- excessive animation
- complex 3D

## 22. Core UX
```text
What can I offer?
       ↓
What do I need?
       ↓
Who matches?
       ↓
How much time?
       ↓
When is the session?
       ↓
Complete exchange
       ↓
Earn/spend credit
       ↓
Build reputation
```

The experience should feel like a **simple professional skill-exchange network**, not a complicated financial application.
