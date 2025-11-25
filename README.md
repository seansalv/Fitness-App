# Level-Up IRL

Level-Up IRL is an anime-inspired fitness companion that reframes every workout as an RPG quest. Users start as E-rank hunters, earn XP from real sessions, and climb toward SSS-rank through streaks and quests. The goal is to give Solo Leveling vibes while staying lightweight enough for daily use.

## Why it matters

- **Motivation over metrics:** Instead of spreadsheets, the app focuses on streaks, rank evolutions, and narrative copy that keep gym beginners coming back.
- **Frictionless onboarding:** New hunters pick a handle + goal, see the “System online” animation, and land in the HUD already primed to log a quest.
- **Deterministic progression:** XP, levels, ranks, and streaks are all derived from a single config so tuning the meta-game is trivial.
- **Device-native feel:** Built entirely with Expo + React Native + Supabase, so it runs on iOS/Android without a custom backend to maintain.

## Product walkthrough

| Flow | Experience |
| ---- | ---------- |
| Onboarding | Email/password auth, anime handle selection, and a “System activated” status card. |
| System HUD | Shows current rank, level, streak, latest quests, and a big “Start Quest” CTA. |
| Quest modal | Users pick quest type, intensity, and duration; XP + rank banners fire on completion. |
| Status screen | RPG-style panel summarizing rank, XP, streak, total quests, and a 7-day activity strip. |
| Reminders | Local-only notification toggle to nudge a “training arc” ping each evening. |

## Architecture snapshot

- **UI:** Expo Router, React Native, custom styling (dark nebula palette).
- **State / data:** React Query hooks over Supabase tables (`users`, `user_stats`, `workouts`).
- **Progression config:** `src/config/progression.ts` centralizes XP math, rank thresholds, streak logic.
- **API layer:** `src/services/api.ts` wraps Supabase auth and quest logging (including XP + streak updates).
- **Notifications:** `src/services/reminders.ts` stubs Expo Notifications for local reminder scheduling.
- **Schema:** `supabase/schema.sql` documents the Postgres tables + enum used in production.

## XP, levels, and ranks

```
xp = duration_minutes * 12 * intensityMultiplier * typeMultiplier + 20
```

- Intensity multipliers: Light 0.85, Medium 1.0, Intense 1.35.
- Type multipliers: Gym 1.10, Cardio 1.05, At-home 0.95, Custom 1.0.
- Level thresholds start at 180 XP and grow at 12% per level.
- Rank thresholds: E(0), D(500), C(1500), B(3200), A(5200), S(8200), SS(12000), SSS(17000).
- Streaks increment only on consecutive quest days; missing a day resets the counter.

All of the above lives in `src/config/progression.ts`, making it easy to iterate on the “game design” without touching UI.

## Local setup (5 minutes)

1. Install deps
   ```bash
   npm install
   ```
2. Create a Supabase project and add the env vars (Expo public env)
   ```
   EXPO_PUBLIC_SUPABASE_URL=...
   EXPO_PUBLIC_SUPABASE_ANON_KEY=...
   ```
3. Run the SQL in `supabase/schema.sql` to create `users`, `user_stats`, and `workouts` (RLS on by default).
4. Add RLS policies so users only touch their own rows (examples in `src/services/api.ts` comments).
5. Start Expo
   ```bash
   npx expo start
   ```
6. Load the app in Expo Go / simulator and create a hunter. Quest logging, streaks, and reminders work on device/emulator as long as Supabase creds are set.