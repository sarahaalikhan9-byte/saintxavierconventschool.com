# Saint Xavier Convent School

Easy local setup for the Saint Xavier Convent School app.

## Quick Start on Windows

1. Install Node.js LTS from https://nodejs.org if it is not already installed.
2. Double-click `INSTALL.bat` one time.
3. Double-click `START.bat` whenever you want to run the project.
4. Open the frontend URL shown in the terminal, usually:

```text
http://localhost:5173
```

The backend runs together with the frontend.

## Command Line

Install everything:

```bash
npm run install:all
```

Run frontend and backend together:

```bash
npm run dev
```

Build frontend:

```bash
npm run build
```

## Folder Structure

- `frontend/` - React, TypeScript, Vite school management UI
- `backend/` - Node/Express WhatsApp broadcast API
- `firebase.json` - Firebase hosting config for `frontend/dist`
- `deploy.bat` / `deploy.sh` - deployment helpers

## Important

Do not include `node_modules` in shared zip files. Run `INSTALL.bat` after extracting the project instead.

## Daily Updates

This README can be updated whenever required, including daily updates for setup notes, deployment steps, feature changes, or maintenance instructions. Keep updates short, clear, and in English so the project remains easy to understand for everyone working on it.
