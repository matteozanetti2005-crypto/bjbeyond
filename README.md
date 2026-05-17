# 🕊️ Phoenix — X Algorithm Simulator

**Real-time AI simulation of X's For You algorithm (Phoenix)**

> Based on the official xAI open-source release (May 2026)

[![Live Demo](https://img.shields.io/badge/Live%20Demo-bjbeyond.it%2FPhoenix-blue?style=for-the-badge)](https://bjbeyond.it/Phoenix)

---

## 🚀 What is Phoenix?

**Phoenix** is an interactive web simulator that predicts how X's recommendation algorithm (codenamed "Phoenix") would score and rank your posts in the For You feed.

It combines:
- Official xAI algorithm signals
- Audience persona modeling (BI Analyst, Finance Pro, Creator, Developer)
- Real-time AI analysis (Claude + Groq)
- Visual scoring with engagement predictions

Perfect for creators, marketers, and data analysts who want to understand and optimize their reach on X.

---

## 🎯 Features

- ✅ **Live simulation** of the Phoenix pipeline (6 stages)
- ✅ **4 audience personas** with different scoring logic
- ✅ **Detailed metrics**: Like, Reply, Repost, Dwell, Click probability
- ✅ **AI-powered analysis** with rewrite suggestions
- ✅ **Signal detection** (questions, links, media, hashtags, CTA, etc.)
- ✅ **Two versions**:
  - `phoenix.html` — Advanced version (Claude 4.5 Haiku)
  - `phoenix-worker.js` — Lightweight version (Groq Llama 3.1)

---

## 🔧 Tech Stack

- Pure HTML + Tailwind + Vanilla JS (no build step)
- Anthropic Claude API (advanced version)
- Groq API (light version)
- Font Awesome + custom design system

---

## 🚀 Quick Start

1. Clone or download this repo
2. Open `index.html` for the main BJ Beyond site
3. Open `phoenix.html` or `phoenix-worker.js` for the simulator
4. (Optional) Replace the API keys in the files with your own

> **Note**: The current versions contain placeholder/demo API keys. Replace them before going live.

---

## 📁 Project Structure

```
bjbeyond/
├── index.html              # Main personal site (BJ Beyond brand)
├── phoenix.html            # Advanced Phoenix Simulator (Claude)
├── phoenix-worker.js       # Lightweight Phoenix Simulator (Groq)
├── Official Music Soundtrack.mp4
├── schema.json
├── privacy-policy.md
├── cookie-policy.md
├── CNAME
└── README.md
```

---

## ⚠️ Security Note

The current HTML files contain **hardcoded API keys** (Anthropic + Groq). 
**Never commit real API keys to a public repo.**

Recommended: Move keys to environment variables or use a backend proxy.

---

## 🚀 Roadmap

- [ ] Add real backend proxy for API keys
- [ ] Support for more personas
- [ ] Export results as image/PDF
- [ ] Batch analysis mode
- [ ] Integration with X API for live post fetching

---

## 🤝 Credits

- Based on **xAI Phoenix algorithm** (open-source release May 2026)
- Built by **BJ Beyond** (@bj_beyond)
- Powered by Claude (Anthropic) + Groq

---

## 👉 Live Demo

**https://bjbeyond.it/Phoenix**

---

*One step beyond pure AI.*