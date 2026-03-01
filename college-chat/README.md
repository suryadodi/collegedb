# 🎓 CollegePulse AI - Student Database Assistant

A complete **Next.js 14** application built with strict **Full Server Side Rendering (SSR)** patterns. No `useEffect` for data, no client-side `fetch`. Everything happens on the server via **Server Components** and **Server Actions**.

## 🚀 Key Features

- **GPT-4o-mini AI Engine**: OpenAI agentic function calling loop for precise database queries.
- **SQLite Database**: Native `better-sqlite3` integration for student data.
- **SSR Architecture**: Blazing fast initial loads and state management via `useFormState`.
- **Audit Logs**: Live tracking of user-agent interactions and tool usage.
- **Premium UI**: Modern dark theme with smooth animations and responsive layout.

## 🛠️ Setup Instructions

### 1. Prerequisites
- Node.js 18.17+
- npm

### 2. Implementation & Dependencies
The following core packages are used:
```bash
npm install openai better-sqlite3 lucide-react clsx tailwind-merge
```

### 3. API Configuration
Create a `.env.local` file and add your OpenAI API Key:
```env
OPENAI_API_KEY=your_actual_key_here
```
> [!TIP]
> Get your key at [OpenAI Platform](https://platform.openai.com/api-keys).

### 4. Direct Execution
Ensure the database is seeded by running the app for the first time:
```bash
npm run dev
```
The database `college.db` will be auto-created and seeded with 25 realistic student records.

## 📁 Architecture Overview

- **`lib/ai.ts`**: The "Brain" - handles OpenAI stream and recursive function calling (Agentic Loop).
- **`lib/db.ts`**: The "Memory" - SQLite queries and initial schema setup.
- **`app/actions/`**: The "Triggers" - Server Actions for chat and log management.
- **`components/ChatInput.tsx`**: The ONLY Client Component boundary in the chat flow.

## ⚖️ SSR Logic Flow
1. **User Submits Form** → Server Action runs on Node.js.
2. **Server Action** calls Gemini API.
3. **Gemini** requests database access via Tool Call.
4. **Server** executes SQLite query and returns results to Gemini.
5. **Gemini** generates final Natural Language response.
6. **Next.js** revalidates the UI and streams new HTML back.
