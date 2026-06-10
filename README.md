# LetteraMia

Italian document assistant for expats. Describe your situation in any language — get a formal Italian letter ready to send.

## Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/omaaoui/letteramia.git
   cd letteramia
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.local.example .env.local
   ```
   Edit `.env.local` and add your [Anthropic API key](https://console.anthropic.com/).

4. **Run locally**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/omaaoui/letteramia)

Set the `ANTHROPIC_API_KEY` environment variable in your Vercel project settings.

## Stack

- [Next.js 15](https://nextjs.org/) (App Router)
- [Anthropic Claude API](https://docs.anthropic.com/)

## Disclaimer

Not legal advice. For administrative assistance only.
