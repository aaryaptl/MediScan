# 🩺 MediScan – AI-Powered Medical Report Management System

MediScan is a **full-stack medical report management application** that allows users to upload, analyze, and securely manage medical reports. The system leverages **OCR (Optical Character Recognition)** to extract text from uploaded reports and provides an intuitive web interface for users to view history and reports.

This project is designed as an **academic + practical full‑stack solution**, demonstrating backend APIs, authentication, OCR processing, and a modern frontend UI.

---

## 🚀 Features

### 🔐 Authentication

* User **Signup & Login**
* Secure authentication flow
* Session-based / token-based access (as implemented)

### 📄 Medical Report Handling

* Upload medical reports
* OCR-based text extraction
* Store and retrieve report history
* View extracted report details

### 📊 User Dashboard

* Upload reports
* View previous reports
* Access report history in a structured format

---

## 🛠️ Tech Stack

### Backend

* **Python**
* **FastAPI** – REST API framework
* **OCR Engine** – for text extraction
* **MongoDB** - Database

### Frontend

* **React (Vite)**
* **Tailwind CSS** – UI styling

### Tools & Others

* Git & GitHub
* VS Code

---

## 📁 Project Structure

```
MediScan-main/
│
├── backend/
│   ├── main.py              # FastAPI entry point
│   ├── auth.py              # Authentication logic
│   ├── database.py          # Database configuration
│   ├── models.py            # Database models
│   ├── ocr_pipeline.py      # OCR processing logic
│   ├── requirements.txt     # Backend dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # App pages (Login, Signup, Upload, History)
│   │   ├── context/         # Auth context
│   │   └── api/     
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/USERNAME/MediScan.git
cd MediScan
```

---

### 2️⃣ Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt

uvicorn main:app --reload
```

Backend will run at:

```
http://127.0.0.1:8000
```

FastAPI Docs:

```
http://127.0.0.1:8000/docs
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run at:

```
http://localhost:5173
```

---
## 📸 Screenshots
<img width="1003" height="466" alt="image" src="https://github.com/user-attachments/assets/fa2db43c-29b1-457b-9c0d-857497a60737" />
<img width="997" height="354" alt="image" src="https://github.com/user-attachments/assets/40439cc2-49ca-43ad-81d0-2e62edb72ca9" />

---

## 🎯 Use Cases

* Digitizing medical reports
* Centralized health record storage
* Academic demonstration of OCR + full‑stack development

---

## 🧑‍💻 Author

**Aarya Patel**
Software Engineer

---

⭐ If you like this project, consider giving it a star on GitHub!
