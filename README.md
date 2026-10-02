# CursorBench (full charts)

A local rebuild of [cursor.com/cursorbench](https://cursor.com/cursorbench) where **all 63 model variants** appear on the score charts (cost, tokens, and steps). The official embed only plots a subset of families by default; this version uses the same underlying benchmark numbers as the public table.

## Features

- Three scatter charts: score vs **cost**, **tokens**, and **steps**
- Effort curves per model line (Max → Low) where multiple effort tiers exist
- **Model filter** dropdown to show or hide any combination of models
- Leaderboard table and benchmark history section aligned with the official page

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43123](http://127.0.0.1:43123).

## GitHub Pages

Pushes to `main` deploy to **https://reztag.github.io/cursorbench-reloaded/** via GitHub Actions.

## Data

Model metrics are extracted from the Cursor marketing site bundle (`CURSORBENCH_31_LEADERBOARD` source) and stored in `src/data/leaderboard.json`.
