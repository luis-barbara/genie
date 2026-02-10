# Genie – Analytical Error & Insight Detection Platform

Genie is a multi‑platform monitoring and insight engine designed to analyze errors, performance issues, security risks, and behavioral patterns across **websites, web apps, Android apps, and iOS applications**.  
It provides automatic event collection, intelligent grouping, anomaly detection, and AI‑powered explanations to help developers quickly understand root causes and improve their product stability.

---

## 🚀 What Genie Does

Genie integrates into your product via lightweight SDKs and captures:

- **Frontend errors** (JS exceptions, UI crashes, failed fetches)
- **Backend errors** (API failures, server exceptions)
- **Performance metrics** (TTFB, FCP, slow endpoints, app freezes)
- **Security events** (suspicious IPs, brute‑force login attempts, injections)
- **User behavior logs** (flows, anomalies, patterns)
- **Mobile‑specific issues** (Android ANRs, iOS crashes – planned)

AI then processes the events and produces:

- 📌 Insights describing what is happening  
- 🛠️ Recommendations for fixing the issue  
- 📈 Trends and anomaly alerts  
- 🧪 Possible root causes  

Genie gives developers a **single unified dashboard**, making it easy to monitor application health.

---

## 📁 Project Structure

This is the project structure used by the Genie platform (Next.js + TypeScript):

```
src/
├── app/
│   ├── (public)/               # Landing pages (marketing site)
│   ├── auth/                   # Login & signup pages
│   ├── dashboard/              # Main monitoring dashboard
│   │   ├── page.tsx            # Overview
│   │   ├── errors/             # Error analytics UI
│   │   ├── performance/        # Performance metrics UI
│   │   ├── security/           # Security monitoring
│   │   ├── insights/           # AI‑generated insights
│   │   └── settings/           # Project + billing settings
│   └── api/                    # Serverless API routes
│       ├── events/route.ts     # Event ingestion endpoint
│       ├── tickets/route.ts
│       ├── insights/route.ts
│       ├── usage/route.ts
│       └── projects/route.ts
│
├── components/                 # Shared UI components
├── hooks/                      # Custom React hooks
├── services/                   # Frontend API clients
├── lib/                        # Utils, Prisma, auth helpers
├── sdk/                        # JavaScript SDK injected into client apps
│   ├── index.ts
│   └── uploader.ts
│
└── types/                      # All shared TS interfaces (users, events, tickets…)
    └── types.ts
```

---

## 📦 Technologies Used

- **Next.js 14 (App Router)**
- **TypeScript**
- **Prisma ORM**
- **PostgreSQL**
- **shadcn/ui**
- **AI insight generation (model‑agnostic)**
- **REST & Serverless ingestion endpoints**

---

## 🧠 Core Concepts & Entities

Genie uses several core data structures:

- **Project** – A monitored app or website  
- **Event** – An error, performance issue, or security alert  
- **Insight** – AI‑generated explanation of an event  
- **Ticket** – A developer task opened from an event  
- **Usage** – Monthly quota tracking  
- **User** – Admin or collaborator  

All TypesScript types are stored in:  
`src/types/types.ts`

---

## ▶️ Getting Started

1. Clone the repository  
2. Install dependencies  
```
npm install
```
3. Start development server  
```
npm run dev
```

Environment variables required:
```
DATABASE_URL=
NEXTAUTH_SECRET=
GENIE_API_KEY=
```

---

## 📄 Summary

This project aims to be an intelligent observability and diagnostic platform that helps developers:

- Detect problems earlier  
- Understand them faster  
- Fix them more efficiently  

Genie centralizes event monitoring, AI insights, tickets, and performance analytics in one clean dashboard.

---


