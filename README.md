# Platforms — AI-Assisted Asset Marketplace

Platforms is a marketplace prototype for discovering, comparing, and transacting 
high-value shared assets — built on the Gemini API and designed as a technical 
foundation for co-ownership and asset-sharing models in the GCC market.

## What it does

- **AI-powered asset matching** — Gemini interprets buyer intent from natural 
  language queries and surfaces relevant listings without requiring structured search
- **Co-ownership calculator** — models fractional ownership splits, usage rights, 
  and return scenarios for high-value assets (vehicles, real estate, marine)
- **Listing intelligence** — AI-generated descriptions and valuation context for 
  each asset, reducing the cognitive load of comparison shopping
- **Regulatory awareness layer** — surfaces jurisdiction-specific considerations 
  (RTA, DMCA, UAE property law) relevant to each asset category

## Why I built it

I'm building Coshare.ai — a UAE-based platform for sharing, swapping, and 
co-owning high-value assets. Platforms is the technical sandbox where I prototype 
and stress-test the AI-assisted discovery and transaction flows before they go 
into production. Building it myself means I understand the product constraints 
from the inside, not just the commercial ones.

## Tech stack

- **Frontend:** React + TypeScript (Vite)
- **AI layer:** Google Gemini API
- **Deployment:** Vercel

## Run locally

```bash
npm install
GEMINI_API_KEY=your_key_here
npm run dev
```

## Status

Active prototype. Core marketplace flow functional. Payment and smart contract 
integration layer in scoping.
