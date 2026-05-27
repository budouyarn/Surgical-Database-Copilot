Surgical Database + Co-pilot
A vibecoding project for a web app for operating theatre staff to manage surgeon procedure preference cards and get AI-powered assistance via a built-in co-pilot.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
Open [http://localhost:3000](http://localhost:3000)  to view the prototype.

## Features

- **Surgeon Profiles** — store surgeon details including gown/glove sizes and specialty
- **Procedure Cards** — detailed preference cards covering instruments, pharmaceuticals, positioning, supplies, surgeon preferences, surgery steps, blades/sutures, BHO, drain, and dressing
- **AI Co-pilot** — AI Co-pilot — Powered by Claude (Anthropic), answers questions about cases, generates prep checklists, and suggests templates based on procedure type
- **Add Surgeons** — Expand the database with new surgeon profiles directly in the UI
- **Authentication** — email/password login, self-registration, and JWT sessions via NextAuth
- **Password Reset** — secure time-limited reset links sent via Microsoft Outlook (hospital domain)
- **Rate Limiting** — per-email and per-IP limits on reset requests via Upstash Redis

## In Progress Features
- **Authentication with MFA** — Had little to no permission with company's API, which needs approval formally with managers and organization.
- **Email Setup**- For prototype version, email setup for authentication will be used for sampling.
---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
Open [http://localhost:3000](http://localhost:3000)  to view the prototype.


## Architecture

The project is split into two apps:

| App | Stack | Purpose |
|---|---|---|
| `surgical-database-copilot` | React + Vite | Frontend UI |
| `surgical-db-server` | Next.js (App Router) | Backend API + auth |

---

## Tech Stack

- [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/) — frontend
- [Next.js 14](https://nextjs.org/) — backend API server
- [NextAuth v5](https://authjs.dev/) — authentication & JWT sessions
- [Prisma](https://www.prisma.io/) + PostgreSQL — database
- [Anthropic Claude API](https://docs.anthropic.com/) (`claude-sonnet-4-20250514`) — AI co-pilot
- [Nodemailer](https://nodemailer.com/) + Microsoft Outlook SMTP — password reset emails
- [Upstash Redis](https://upstash.com/) — rate limiting
- [Vercel](https://vercel.com/) — deployment

---

## Project Structure

```
surgical-database-copilot/       # Frontend (Vite)
├── src/
│   ├── App.jsx                  # Main application
│   ├── Auth.jsx                 # Login & register screens
│   ├── ResetPassword.jsx        # Forgot & reset password screens
│   └── main.jsx                 # Entry point + routing
├── .env                         # VITE_API_URL
├── package.json
└── vite.config.js

surgical-db-server/              # Backend (Next.js)
├── app/
│   └── api/
│       ├── auth/
│       │   ├── [...nextauth]/route.ts    # NextAuth endpoints
│       │   ├── register/route.ts        # Staff self-registration
│       │   ├── forgot-password/route.ts # Request reset link
│       │   └── reset-password/route.ts  # Submit new password
│       └── chat/route.ts                # Protected Claude AI proxy
├── lib/
│   ├── mailer.ts                # Outlook SMTP email sender
│   └── ratelimit.ts             # Upstash rate limiters
├── prisma/
│   └── schema.prisma            # DB schema
├── auth.ts                      # NextAuth config
├── middleware.ts                # CORS + origin guard
└── .env.local                   # Server environment variables
```

---
Patient data is reminded to be handled in compliance with local healthcare data regulations (e.g. PDPA in Singapore)

License
MIT




