# RAZA v2 — React AI Voice Studio

A polished React/Vite + Node/Express text-to-speech creator studio.

## Features

- React + Vite frontend
- Advanced dark studio UI
- Voice cards
- English, Hindi and Nepali
- Script editor
- Speed, pitch, volume
- Emotion/style controls
- Browser preview
- Generated audio player
- Waveform-style visualization
- MP3 download
- WAV download button with clear limitation
- Local browser history
- Responsive mobile sidebar
- Node/Express API
- Rate limiting

## Run on Windows

Install Node.js 18+.

Open Command Prompt in the project folder:

```bash
cd backend
npm install
npm start
```

In another Command Prompt:

```bash
cd frontend
npm install
npm run dev
```

Open:

http://localhost:5173

## Free TTS note

This starter uses the community `@sefinek/google-tts-api` package. It is not Google Cloud TTS and should not be treated as an unlimited commercial API. For a production service, replace the TTS service with a properly licensed/self-hosted engine.

## History

Generated items are stored in the browser's localStorage. Audio data is stored locally in the browser history, so clearing site data removes the history.

## WAV

The current backend generates MP3. The WAV button is intentionally labeled as a fallback because genuine WAV conversion requires a conversion pipeline such as FFmpeg. Do not claim that an MP3 blob is WAV.

## Project

```text
RAZA-v2/
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   │   ├── package.json
│   │   └── vite.config.js
│   ├── index.html
├── backend/
│   ├── server.js
│   └── package.json
└── README.md
```
