# 🖋️ Inkpot — A Paper Task List App

> *A task list that feels like a sheet of handmade paper, where every task is a sticky slip you can write, tear off, stamp as done, or rewrite.*

Built for the **Android Club (VIT Bhopal) Task Round** strictly following the official **Product Requirements Document (PRD Version 1.0)**.

---

## 🎨 Design Direction: "Paper and Pigment"

Inkpot avoids standard dark-mode and neon glows in favor of a warm, tactile, handmade aesthetic:
- **Oat Paper (`#FBF4E6`)** background with subtle SVG paper fiber texture.
- **Milk (`#FFFDF8`)** card surfaces with warm offset shadows.
- Rotating pastel slip tints: **Butter (`#FFD966`)**, **Rose Clay (`#F2A1A1`)**, **Sky Wash (`#A8D8F0`)**, and **Periwinkle (`#7C83E8`)**.
- **Plum Ink (`#3B2A4A`)** high-contrast text (> 10:1 WCAG AA compliant).
- **Tangerine Ink (`#F26B3A`)** primary accents and squiggly hand-drawn underlines.
- Slight tactile rotations (`-1.5°` to `1.5°`) on slips that straighten softly on hover.
- Circular red **DONE** rubber stamp animation and strike-through on completion.
- Paper crumple animation on delete with a **5-second undo toast window**.
- Paper scrap confetti burst when tasks are completed.

---

## 🌟 Key Features

| Feature | PRD Spec | Status |
| :--- | :--- | :--- |
| **Add Task** | Title (1–120 chars, trimmed), description (≤ 500 chars), tag (≤ 30 chars), due date | ✅ Implemented |
| **Edit Task Inline** | Edit without leaving the page, Esc to cancel | ✅ Implemented |
| **Delete Task** | Crumple animation + 5-second undo toast window | ✅ Implemented |
| **Toggle Status** | Rubber DONE stamp thump + strike-through + optimistic update | ✅ Implemented |
| **Filter & Search** | Tabs: *All*, *Open*, *Done* + instant title/description search | ✅ Implemented |
| **Progress Ring** | Dynamic SVG ring calculating completed share | ✅ Implemented |
| **Responsive Grid** | 1 column (mobile 320px+), 2 columns (tablet), 3 columns (desktop) | ✅ Implemented |
| **Zero-Config DB** | MongoDB Atlas support with seamless local persistent fallback (`data.json`) | ✅ Implemented |
| **Central Error Handling** | Standardized `{ success: false, error: { code, message } }` envelope | ✅ Implemented |

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 18, Vite, CSS Variables, Lucide Icons, Canvas Confetti
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Mongoose / Hybrid zero-config file-backed repository
- **API Documentation**: [docs/API.md](file:///e:/New%20folder/docs/API.md)

---

## 📁 Suggested Folder Structure (PRD 6.6)

```text
inkpot/
├── README.md
├── docs/
│   ├── API.md
│   └── screenshots/
├── server/
│   ├── src/
│   │   ├── config/          # Database connection & fallback
│   │   ├── models/          # Task model & repository
│   │   ├── routes/          # REST routes (/api/tasks)
│   │   ├── controllers/     # Task business logic
│   │   ├── middleware/      # Validation & errorHandler
│   │   └── app.js           # Server entry point
│   ├── .env.example
│   └── package.json
└── client/
    ├── src/
    │   ├── components/      # ProgressRing, TaskComposer, FilterTabs, TaskSlip, EmptyState
    │   ├── api/             # API client with error normalization
    │   ├── styles/          # Paper & Pigment CSS tokens & animations
    │   ├── App.jsx          # Root state & optimistic updates
    │   └── main.jsx
    ├── .env.example
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Getting Started (< 5 Minutes)

### Prerequisites
- Node.js (v18 or above recommended)
- npm

### 1. Backend Setup
```bash
cd server
npm install
npm start
```
*The server will start on `http://localhost:5000`.*
> **Note**: A MongoDB URI can be added to `server/.env`, but is optional! If none is provided, the backend automatically uses persistent local storage (`data.json`) so evaluators can run the project immediately without configuring external databases.

### 2. Frontend Setup
In a new terminal:
```bash
cd client
npm install
npm run dev
```
*The frontend will run on `http://localhost:5173` with proxy configured to the backend.*

---

## 🔌 API Summary

Detailed specs are in [docs/API.md](file:///e:/New%20folder/docs/API.md).

- `GET /api/tasks` — List tasks (`?completed=true|false&q=text`)
- `GET /api/tasks/:id` — Get one task
- `POST /api/tasks` — Create a task (201 Created)
- `PUT /api/tasks/:id` — Inline edit (200 OK)
- `PATCH /api/tasks/:id/toggle` — Flip completed status (200 OK)
- `DELETE /api/tasks/:id` — Delete task (204 No Content)
- `DELETE /api/tasks?completed=true` — Clear all completed tasks (200 OK)

---

## 📸 Screenshots
*(Saved in `docs/screenshots/`)*
- `empty_state.png`
- `populated_board.png`
- `edit_mode.png`
- `completed_stamp.png`
