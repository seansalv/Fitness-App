## Hero Arc Backend

Server-side API for Hero Arc, built with Next.js App Router. Routes live under `src/app/api/*` and talk to Supabase using the service-role key. This layer keeps custom business logic (quest logging, onboarding sync, party management) off the client and ready for future monetization.

### Requirements

Create a `.env.local` in `server/` with:

```
SUPABASE_URL=https://<your-project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-secret>
```

> Never expose the service role key to the Expo app. It is only used here.

Install dependencies (already run once):

```
npm install
```

### Running locally

```
npm run dev
```

API routes (examples):

- `POST /api/onboarding-sync` – persists onboarding answers (`hero_profiles` table).
- `POST /api/quest` – logs a quest, updates `workouts` + `user_stats`.
- `POST /api/party` – handles party create/join/leave actions.

Each route expects a Supabase schema with the corresponding tables (`hero_profiles`, `workouts`, `user_stats`, `parties`, `party_members`). Add them to `supabase/schema.sql` so both frontend and backend share the same source of truth.

### Next steps

- Add authentication middleware (verify Supabase JWTs before executing actions).
- Extend `/api/party` with invite codes, shared boss HP, etc.
- Add payment webhooks (Stripe/RevenueCat) when monetization is enabled.
