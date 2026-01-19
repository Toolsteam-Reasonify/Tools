# Chapter 13 Projects (Reasonify)

This folder contains multiple Vite + React + TypeScript projects for Chapter 13. Each subfolder is a self-contained app/demo.

## Structure

- `ch13_Intro`
- `ch13_13.3`
- `ch13_13.4`
- `ch13_13.5`

Each subproject includes its own `package.json`, `src/` code, and build output in `dist/`.

## Prerequisites

- Node.js 18+ and npm

## Getting Started (per subproject)

From this directory, change into a subproject and run:

```bash
cd <subproject>
npm install
npm run dev
```

Then open the printed local URL in your browser (usually `http://localhost:5173`).

## Build

```bash
cd <subproject>
npm run build
```

Outputs to the subproject's `dist/` directory.

## Notes

- A single root-level `.gitignore` is provided to ignore `node_modules`, build artifacts, logs, and editor files across all subprojects.
- Each subproject may also contain its own `README.md` with additional details.

