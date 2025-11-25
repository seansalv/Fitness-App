# Hero Arc

Hero Arc is an anime-inspired fitness companion that reframes every workout as an RPG-style quest. Athletes earn XP from real sessions, progress through ranks, and track streaks inside a minimalist HUD designed for daily use.

## Why it matters

- **Motivation-first UX:** Progress copy, rank evolutions, and streak banners reinforce behaviour better than raw charts.
- **Launch-ready onboarding:** Email auth, alias creation, and a cinematic “Hero console” boot flow reduce drop-off.
- **Deterministic progression:** XP, ranks, and streak logic are all defined in one config, so balancing the game loop is low risk.
- **Mobile-native stack:** Expo + React Native + Supabase keeps deployments unified across iOS/Android with no custom infra.

## Product walkthrough

| Flow | Experience |
| ---- | ---------- |
| Onboarding | Email/password auth, hero alias selection, and a “Hero profile live” confirmation card. |
| Hero HQ | Displays current rank, level, streak, recent quests, and a primary “Start Quest” action. |
| Quest modal | Users choose quest type, intensity, and duration; XP and rank banners respond instantly. |
| Status screen | RPG panel summarising rank, XP, streak, total quests, plus a 7-day activity strip. |
| Reminders | Local notification toggle to send an evening training prompt. |

## Architecture snapshot

- **UI:** Expo Router, React Native, custom dark-nebula design system.
- **State / data:** React Query hooks over Supabase tables (`users`, `user_stats`, `workouts`).
- **Progression config:** `src/config/progression.ts` centralises XP math, rank thresholds, and streak logic.
- **API layer:** `src/services/api.ts` wraps Supabase auth plus quest logging (XP + streak updates are server-backed).
- **Notifications:** `src/services/reminders.ts` handles Expo Notifications for local reminders.
- **Schema:** `supabase/schema.sql` documents Postgres tables/enums, ready for migrations.

## XP, levels, and ranks

```
xp = duration_minutes * 12 * intensityMultiplier * typeMultiplier + 20
```

- Intensity multipliers: Light 0.85, Medium 1.0, Intense 1.35.
- Type multipliers: Gym 1.10, Cardio 1.05, At-home 0.95, Custom 1.0.
- Level thresholds start at 180 XP and grow at 12% per level.
- Rank thresholds: E(0), D(500), C(1500), B(3200), A(5200), S(8200), SS(12000), SSS(17000).
- Streaks increment only on consecutive quest days; missing a day resets the counter.

All tuning parameters live in `src/config/progression.ts`, so gameplay tweaks never require UI rework.

## Local setup (5 minutes)

1. Install dependencies
   ```bash
   npm install
   ```
2. Create a Supabase project and surface the Expo public env vars
   ```
   EXPO_PUBLIC_SUPABASE_URL=...
   EXPO_PUBLIC_SUPABASE_ANON_KEY=...
   ```
3. Run the SQL in `supabase/schema.sql` to create `users`, `user_stats`, and `workouts` (RLS enabled).
4. Add RLS policies so users only access their own rows (`src/services/api.ts` lists the checks).
5. Start Expo
   ```bash
   npx expo start
   ```
6. Load the app in Expo Go or a simulator and create a hero. Quest logging, streaks, and reminders all run locally once Supabase creds are set.