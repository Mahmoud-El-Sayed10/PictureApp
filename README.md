# PictureApp

A full-stack desktop application for managing and editing pictures, built using React (Vite), Electron.js, Laravel, Node.js WebSocket, Docker, and deployed via CI/CD to an AWS EC2 instance.

---

## 🧠 Project Overview
PictureApp is designed to:
- Allow users to upload, edit (crop, rotate, grayscale, watermark), and delete images locally
- Support authentication and login event logging
- Provide real-time WebSocket-based chat functionality
- Run as a native desktop application using Electron.js

---

## 🖥️ Local Development Environment
### 1. Prerequisites
- WSL2 installed on Windows 11
- Ubuntu (latest stable)
- Docker & Docker Compose
- Node.js + npm
- Git + GitHub CLI

### 2. Linux/WSL Setup
```bash
sudo apt update && sudo apt upgrade
sudo apt install docker.io docker-compose git curl wget unzip net-tools
```
Make sure Docker runs under WSL:
```bash
sudo service docker start
```

### 3. Clone Project
```bash
git clone git@github.com:Mahmoud-El-Sayed10/PictureApp.git
cd PictureApp
```

---

## ⚙️ Dockerized Stack Setup
### 1. Backend (Laravel + MySQL)
Configure `.env`:
```
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=root
```
Then run:
```bash
docker compose up --build
```

Access Laravel at: `http://127.0.0.1:8000`

### 2. Frontend (React + Electron)
```bash
cd frontend
npm install
npm run dev     # Start Vite
npm run electron  # Run Electron window
```

### 3. Chat Server (Node.js WebSocket)
```bash
cd chat-server
node index.js
```
Accessible via `ws://localhost:3001`

---

## 🔁 CI/CD with GitHub Actions
### 1. GitHub Secrets
In your repo settings → Secrets and variables → Actions:
- `HOST`: your EC2 IP
- `USERNAME`: `ubuntu`
- `PEM_KEY`: paste your private key here (RSA, base64 encoded)

### 2. Workflow Trigger
Any push to `main` will trigger `.github/workflows/main.yml`:
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
      - name: Build Docker images
      - name: Upload artifacts
      - name: SSH to EC2 and deploy
```

---

## ☁️ AWS EC2 Deployment
### 1. Prepare Instance
- Ubuntu 22.04 LTS
- Open ports: 22, 8000, 3001, 3306

SSH into it:
```bash
ssh -i ~/Desktop/deploy_key.pem ubuntu@<your-ec2-ip>
```
### 2. On First Setup
```bash
sudo apt update && sudo apt install docker.io docker-compose
```
The GitHub Action will `scp` your files and run:
```bash
docker compose -f docker-compose.prod.yml up --build -d
```

---

## 🧪 Troubleshooting Log
### ❌ Electron `libnss3.so` error
```bash
sudo apt install libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libxss1 libasound2t64 libxrandr2 libxdamage1 libxcomposite1 libxcursor1 libxinerama1 libappindicator3-1
```

### ❌ Laravel Permissions
```bash
docker exec -it pictureapp-laravel-1 bash
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
chmod -R 775 /var/www/storage /var/www/bootstrap/cache
```

### ❌ MySQL connection error from Laravel
Ensure Laravel container connects using `mysql` as host name (Docker network alias).

---

## ✨ Notes from the Developer
- First time using Linux (WSL2)
- Set up a complete containerized workflow with CI/CD
- Learned low-level debugging: port conflicts, service dependencies, Electron issues
- Practiced full-stack integration with desktop environment

---

## 📦 Folder Structure
```
PictureApp/
├── backend/              # Laravel backend
├── chat-server/          # WebSocket chat
├── frontend/             # React + Electron
├── .github/workflows/    # GitHub Actions CI/CD
├── docker-compose.yml
├── docker-compose.prod.yml
```
