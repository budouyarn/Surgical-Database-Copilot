Surgical Database + Co-pilot
A web app for operating theatre staff to manage surgeon procedure preference cards and get AI-powered assistance via a built-in co-pilot.
Features

Surgeon Profiles — Store surgeon details including gown/glove sizes and specialty
Procedure Cards — Detailed preference cards covering instruments, pharmaceuticals, positioning, supplies, surgeon preferences, surgery steps, blades/sutures, BHO, drain, and dressing
AI Co-pilot — Powered by Claude (Anthropic), answers questions about cases, generates prep checklists, and suggests templates based on procedure type
Add Surgeons — Expand the database with new surgeon profiles directly in the UI

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


Tech Stack

React + Vite
Anthropic Claude API (claude-sonnet-4-20250514)
Deployed via Vercel 

Getting Started
Prerequisites

Node.js 18+
An Anthropic API key

Installation
bashgit clone https://github.com/YOUR_USERNAME/surgical-database-copilot.git
cd surgical-database-copilot
npm install
Environment Variables
Create a .env file in the root:
envVITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here

Note: For production, proxy API calls through a backend to avoid exposing your API key in the browser.

Run Locally
bashnpm run dev
Open http://localhost:5173 in your browser.
Build for Production
bashnpm run build
npm run preview
Project Structure
surgical-database-copilot/
├── public/
├── src/
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles
├── .env                 # Environment variables (not committed)
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
Deployment
See DEPLOYMENT.md for step-by-step instructions for Vercel and Netlify.
Security Notes

Never commit your .env file or expose your Anthropic API key publicly
For multi-user production deployments, move API calls to a server-side backend (e.g. Express, Next.js API routes)
Patient data should be handled in compliance with local healthcare data regulations (e.g. PDPA in Singapore)

License
MIT



