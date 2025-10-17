# 🎧 Audiyn Music

> A collaborative music platform where everyone decides what plays next.  
> Users can upvote or suggest songs from **Spotify** or **YouTube**, making group listening sessions fun and democratic.

<p align="center">
  <img src="https://img.shields.io/badge/Built%20with-Bun-orange?style=for-the-badge&logo=bun" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=nextdotjs" />
  <img src="https://img.shields.io/badge/Express.js-grey?style=for-the-badge&logo=express" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" />
  <img src="https://img.shields.io/badge/Turborepo-black?style=for-the-badge&logo=turborepo" />
</p>

---

## 🚀 Overview

**Audiyn Music** is a real-time, full-stack application built using a **monorepo** architecture powered by **Bun**.  
It allows users to connect, join rooms, and collectively decide which song should play next — powered by **WebSockets**, **REST APIs**, and **Spotify integration**.

This project is fully open source and aims to explore scalable architecture, modern DevOps practices, and open collaboration.

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Language** | TypeScript |
| **Runtime** | Bun |
| **Frontend** | Next.js, Tailwind CSS, ShadCN UI |
| **Backend** | Express.js + WebSocket |
| **Database** | PostgreSQL (via Prisma ORM) |
| **Cache/Queue** | Redis |
| **API Integrations** | Spotify API, YouTube API |
| **Infrastructure** | Monorepo (managed by Turborepo) |
| **Dev Tools** | ESLint, Prettier, Husky (for lint-staged commits) |
| **Future Setup** | Docker, Docker Compose, CI/CD Pipeline |

---

## 🗂️ Monorepo Structure


---

## ⚙️ Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/audiyn-music.git
cd audiyn-music

bun install
cp .env.example .env

✅ Real-time collaborative music control
✅ Spotify API integration
✅ WebSocket-based live updates
✅ Modern UI built with ShadCN & Tailwind
✅ Monorepo architecture using Turborepo
✅ Scalable backend with Redis and PostgreSQL
✅ TypeScript across the stack


FUTURE ROADMAP

 Add Docker & Docker Compose support

 Add CI/CD pipeline (GitHub Actions)

 Implement authentication system

 Add persistent queue management

 Mobile-friendly PWA version

 Deploy to production (Render / Vercel / Railway)