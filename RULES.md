VIBE CODING RULES FOR HERO ARC

- Limit code changes to the smallest set of files needed when implementing a new feature or bugfix.
- Do not introduce new dependencies unless absolutely necessary; prefer using existing libraries in the project.
- Keep all Supabase credentials and secrets in environment variables, never hardcode them.
- When modifying XP / rank logic, keep all tuning parameters in a single config file.
- When adding UI changes, keep the anime/RPG theme, but avoid excessive animations that hurt performance.
- Before large refactors, summarize the current structure and propose the change in natural language first.
- Prefer incremental changes + explanations over rewriting the whole project at once.
