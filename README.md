# SmartTracker

SmartTracker is a React + Vite workspace for project requirements, manual and AI-assisted test cases, bug tracking, and BRD/SRS drafts. Supabase provides authentication and persisted data; Gemini 3.5 Flash-Lite streams AI test cases through the Interactions API from a Supabase Edge Function, with Gemini 3.8 Flash as an overload fallback. Document generation uses Gemini 3.8 Flash with Gemini 3.5 Flash-Lite as its overload fallback.

## Requirements

- Node.js 20+
- A Supabase project
- A Google Gemini API key for AI generation

## Run locally

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. In the Supabase SQL Editor, run `supabase/schema.sql`.
4. Start the frontend: `npm run dev`

For signup, configure the email confirmation behavior in Supabase Authentication. Deploy both functions and set the Gemini key as a server-side secret:

```powershell
npx supabase login
npx supabase link --project-ref <your-project-ref>
npx supabase secrets set GEMINI_API_KEY=<your-gemini-api-key>
npx supabase functions deploy generate-testcases
npx supabase functions deploy generate-doc
```

Do not put the Gemini key in a `VITE_` variable or commit `.env`.

After deployment, open the Supabase dashboard and verify under **Edge Functions** that both functions are deployed and under **Edge Functions > Secrets** that `GEMINI_API_KEY` exists.

If AI test generation fails, confirm `generate-testcases` is deployed and the `GEMINI_API_KEY` secret is set, then redeploy the function. Generation time depends on the Gemini service and can increase during provider load.

## Features

- Supabase email/password signup, sign-in, and session-protected routes
- Project, requirement, test case, and bug create/read/update/delete workflows
- Search, status/priority filtering, dashboard metrics, and charts
- AI test case generation with a selectable preview before saving
- Streaming test-case previews as each case is completed
- BRD/SRS generation and saved-document viewing/printing
- Per-user row-level security policies

## Build

Run `npm run build` to create the production bundle in `dist/`.
