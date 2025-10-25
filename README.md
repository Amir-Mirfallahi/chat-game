# 🧠 CHAT — AI-Based Interactive Language Development Platform

**CHAT** is an AI-powered web application designed to help children with **Late Language Emergence (LLE)** through **live, natural conversations** with an intelligent agent.  
It integrates **real-time communication, AI speech understanding, and voice synthesis** in an engaging, child-friendly environment.

---

## 🚀 Tech Stack Overview

### 🖥 Backend
- **Framework:** [Django 5.2 LTS](https://www.djangoproject.com/) — chosen for its reliability, maturity, and strong ecosystem.  
- **API Layer:** Django REST Framework (DRF).  
- **Realtime Communication:** [LiveKit](https://livekit.io/) API for creating and managing video/audio rooms via JWT tokens.  
- **Task Management:** Celery & Celery Beat for background and scheduled jobs.  

### 💻 Frontend
- **Library:** React 18 + React Router DOM v6.  
- **Styling:** Tailwind CSS.  
- **Animations & Icons:** Framer Motion and Lucide React.  
- **Networking:** Axios for API calls.  

### 🤖 Agent (AI Brain)
- **Language:** Python (separate service).  
- **Libraries:** LiveKit SDK for Python to connect and manage rooms dynamically.  
- **AI Model:** OpenAI **GPT-5-mini** for intelligent, context-aware responses.  
- **Speech Recognition (STT):** [Cartesia](https://cartesia.ai/).  
- **Text-to-Speech (TTS):** [ElevenLabs](https://elevenlabs.io/) — warm, child-friendly voice.  
- The agent monitors room activity and automatically connects the AI to sessions when users start their conversation.  

### 🐳 CI/CD & Infrastructure
- **Containerization:** Docker for efficient environment setup and reproducible builds.  
- **CI/CD:** GitHub Actions for continuous deployment.  
- **Database:** PostgreSQL (running in a Docker container and connected via internal Docker networks).  

### ☁️ Deployment & Server
- **Initial Deployment:** Oracle Cloud (migrated after encountering network and port configuration issues).  
- **Current Hosting:** [Hetzner Cloud](https://www.hetzner.com/) — stable and developer-friendly.  
- Learned valuable lessons about configuring **Security Lists**, **subnet rules**, and **stateless ports** for proper SSH (port 22) and app connectivity.

---

## 🧩 Setup & Run

Clone the repository:
```bash
git clone https://github.com/Amir-Mirfallahi/chat-game.git
cd chat
````

Run the app with Docker:

```bash
docker compose up -d
```

Edit the environment variables for the AI agent:

```bash
cd agents
nano .env
# Update required keys and tokens
```

After setup, the full system (backend, frontend, agent, and database) will be running and connected automatically.

---

## 🏆 Honors & Achievements

* 🥈 **Silver Medal** — *Indonesia International Innovation Expo 2025*
* 🇮🇷 Advanced to the **National Level** in the *Khwarazmi Competition (Iran)*

---

## 💡 Key Features

* Real-time voice conversations between children and an AI companion.
* Adaptive dialogue and emotion-aware responses.
* Support for language development therapy (LLE & late talkers).
* Modern architecture with scalable microservices.

---

## 🤝 Contributors

| Name                       | Role                             |
| -------------------------- | -------------------------------- |
| **Amirhossein Mirfallahi** | Co-Founder, Full-Stack Developer |
| **Arad Etemad**        | Co-Founder, Researcher   |

---

## 📜 License

This project is currently closed-source and developed for research and educational purposes.
Please contact the maintainers for collaboration or licensing inquiries.

---

## 🌐 Live Demo

[https://chatai-talk.ir](https://chatai-talk.ir)

