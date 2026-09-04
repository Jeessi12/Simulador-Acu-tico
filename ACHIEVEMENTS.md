# BlueEcoSim Achievement System

## Installation

New installations can import `MySQL/simuladorDB.sql`, the original database for users and general application data. Species data is installed separately from `MySQL/simulador_especiesDB.sql`. The PHP service also applies the same idempotent achievement schema automatically on first use and records schema version `2`, so subsequent requests only perform one lightweight version check.

## Architecture

- `AchievementSchema` owns tables, indexes, seed categories, badge definitions, and data-driven rules.
- `AchievementManager` is the only component that calculates metrics, progress, unlock state, dates, and XP.
- `AchievementPageTracker` translates authentication and page visits into manager events without embedding reward rules in views.
- `views/api_achievements.php` securely handles simulation start, heartbeat, pause, resume, and completion actions.
- `achievement-notifications.php` and the achievement CSS/JavaScript provide reusable, queued unlock popups.
- `perfilUsuario.php` renders the complete categorized collection, including locked badges and progress.

Simulation completions require at least 60 seconds of active time. Heartbeats are capped at 90 seconds per request, paused time is not credited, assignments are validated against the logged-in student, and a session token can be completed only once.

## Adding achievements without changing core logic

1. Insert the badge into `achievements` and choose any category from `achievement_categories`.
2. Add one or more rows to `achievement_rules`. All rules assigned to one achievement must pass.
3. Use an existing metric key and put metric-specific parameters in `options_json`.

Supported metric keys:

- `login_days_total`
- `consecutive_login_days`
- `simulation_completed_count`
- `distinct_simulations_completed`
- `required_simulations_completed` with `{"simulation_ids":[1,2,3]}`
- `simulation_seconds`
- `simulation_type_completed_count` with `{"simulation_id":3}`
- `educational_sections_visited`
- `section_visited` with `{"section_key":"resources"}`
- `profile_completeness_percent`

The schema already includes level, XP, hidden status, season code, activation windows, and active flags. These fields provide the foundation for rankings, leaderboards, rewards, seasonal/limited-time events, and secret achievements without structural database changes.

## Verification

Run:

```text
php tests/AchievementManagerTest.php
```

The integration test creates a temporary user, verifies idempotent login rewards, educational exploration, simulation completion, duplicate protection, and profile totals, then removes the user.
