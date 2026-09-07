# 5 AM Prayer Bible Study

Mobile-first static Bible study app for **Carmen** — fourteen days through the **Book of Acts** (two chapters per day), with reading links, lesson notes, a word-connect puzzle that unlocks a featured verse, and a multiple-choice quiz.

**Live path (GitHub Pages):** `/5am-prayer-bible-study/`

## Stack

- Vite + React + TypeScript
- Plain CSS (royal purple / gold devotion theme)
- Client-side only — no auth, no payments

## Features

1. Todays assignment from a date-based schedule (`planStartDate`)
2. Before the start date → Day 1; after the last day → completion message + link to all lessons
3. All lessons list for catch-up / day picking
4. Each day: scripture refs, Bible Gateway reading links, audio placeholders, lesson text, word-connect puzzle → featured verse unlock, graded quiz with explanations

## Study plan (14 days)

| Day | Chapters |
|-----|----------|
| 1 | Acts 1–2 |
| 2 | Acts 3–4 |
| 3 | Acts 5–6 |
| 4 | Acts 7–8 |
| 5 | Acts 9–10 |
| 6 | Acts 11–12 |
| 7 | Acts 13–14 |
| 8 | Acts 15–16 |
| 9 | Acts 17–18 |
| 10 | Acts 19–20 |
| 11 | Acts 21–22 |
| 12 | Acts 23–24 |
| 13 | Acts 25–26 |
| 14 | Acts 27–28 |

## Edit content

### Schedule start date

Edit `src/data/config.json` and set `planStartDate` (ISO `YYYY-MM-DD`, default `2026-09-08`). Day 1 is that calendar day in the readers local timezone.

### Lessons, questions, word puzzles, audio

Edit `src/data/lessons.json`. Each lesson includes `id`, `dayNumber`, `title`, `scriptureReference`, `readingLinks`, `audioLinks` (ESV embed player; Day 1 may also list optional Audible), `lesson` paragraphs, `wordPuzzle` (`letters`, `targetWords`, `featuredVerse`), and `questions` (`prompt`, `choices`, `correctIndex`, `explanation`).

### Branding

Title / subtitle / completion copy live in `src/data/config.json`.

## Local development

```bash
npm install
npm run dev
npm run build
npm run preview
```

Use Node 20+. Vite `base` is `/5am-prayer-bible-study/` for GitHub Pages.

## GitHub Pages setup

1. Push this repo to GitHub (default branch `main`).
2. Settings → Pages → Build and deployment → Source: GitHub Actions.
3. Workflow `.github/workflows/deploy-pages.yml` builds on push to `main` and deploys `dist`.
4. Site URL shape: `https://<user>.github.io/5am-prayer-bible-study/`

If the repo name differs, change `base` in `vite.config.ts` to match the Pages path.

## Notes

- Day 1 includes an optional Audible secondary link; primary listen for every day is the ESV audio embed.
- Word-connect is an original study mechanic inspired by popular Bible word games; no third-party assets or IP are copied.
