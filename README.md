# Chatt App

A simple real‑time chat application consisting of:
- Backend: Java 17 + Spring Boot (WebSocket/STOMP) built with Gradle
- Frontend: React + TypeScript using Vite

The app enables users to join a public room and exchange messages over STOMP via a WebSocket endpoint exposed by the Spring Boot backend.

## Tech Stack and Entry Points

Backend
- Language/Runtime: Java 17
- Framework: Spring Boot 3 (Web, WebSocket, Spring Integration)
- Build tool: Gradle (Gradle Wrapper provided)
- Entry point: `src/main/java/org/demo/chattapp/ChattAppApplication.java`
- WebSocket/STOMP configuration: `src/main/java/org/demo/chattapp/config/WebSocketConfig.java`
  - STOMP endpoint: `/ws`
  - App destination prefix: `/app`
  - Simple broker destination: `/topic`
- Messaging controller: `src/main/java/org/demo/chattapp/controller/ChatController.java`
  - Publish to `/app/chat.addUser` and `/app/chat.sendMessage`, messages broadcast on `/topic/public`
- Disconnect handling listener: `src/main/java/org/demo/chattapp/config/WebSocketEventListener.java`

Frontend
- Framework: React 18 + TypeScript
- Dev/build: Vite
- Package manager: npm
- Entry: `chatt-app-frontend/src/main.tsx`
- Chat UI: `chatt-app-frontend/src/components/chatRoom/chatRoom.tsx`
  - Connects to backend STOMP endpoint: `http://localhost:8080/ws` (see TODO under Environment Variables)

## Requirements

- Java 17 (for Spring Boot 3 toolchain)
- Node.js 18+ and npm (for the React/Vite frontend)
- Bash shell (to run Gradle wrapper scripts on Unix/macOS)

Optional
- A modern browser for the frontend (tested with Chrome/Firefox)

## Getting Started

Clone the repository and open two terminals: one for the backend and one for the frontend.

### 1) Backend (Spring Boot)

From the repository root:

- Build
  - Unix/macOS: `./gradlew build`
  - Windows: `gradlew.bat build`

- Run (starts at http://localhost:8080)
  - Unix/macOS: `./gradlew bootRun`
  - Windows: `gradlew.bat bootRun`

- Tests
  - Unix/macOS: `./gradlew test`
  - Windows: `gradlew.bat test`

Configuration (default): `src/main/resources/application.properties`
- `server.port=8080`

### 2) Frontend (React + Vite)

From the repository root, change into the frontend directory:

```bash
cd chatt-app-frontend
npm install
```

- Start dev server (default: http://localhost:5173)
  - `npm run dev`

- Lint
  - `npm run lint`

- Build for production
  - `npm run build`

- Preview built app (after `npm run build`)
  - `npm run preview`

Note: The chat room component currently connects to the backend at `http://localhost:8080/ws`.
Ensure the backend is running before starting to chat.

## Scripts Summary

Backend (Gradle wrapper)
- `./gradlew bootRun` — run backend locally
- `./gradlew build` — build the backend JAR and run tests
- `./gradlew test` — run backend tests only

Frontend (npm in `chatt-app-frontend`)
- `npm run dev` — start Vite dev server
- `npm run build` — type‑check + build production assets
- `npm run preview` — serve built assets locally
- `npm run lint` — run ESLint


## How It Works (Quick Overview)

1. The frontend creates a STOMP client and connects to the backend endpoint at `/ws`.
2. Upon connection, it subscribes to `/topic/public` to receive messages.
3. It sends a JOIN message to `/app/chat.addUser` and later CHAT messages to `/app/chat.sendMessage`.
4. The backend broadcasts messages to all subscribers of `/topic/public`.
5. When a user disconnects, a LEAVE message is broadcast by the backend event listener.


## Running Both Parts Together

- Start the backend on port 8080: `./gradlew bootRun`.
- Start the frontend dev server (default port 5173): `npm run dev` inside `chatt-app-frontend`.
- Open the frontend in your browser (Vite prints the URL, typically http://localhost:5173) and join the chat. Make sure the backend is running so the WebSocket can connect.

## Deployment

- Backend: Build with `./gradlew build` and deploy the resulting JAR.
- Frontend: Build with `npm run build` and host the `dist/` directory on a static file server.
  - TODO: Provide a unified deployment approach (e.g., serve frontend from Spring Boot or configure reverse proxy for both services).